require('dotenv').config();

const connectDB = require('../config/database');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
const Visit = require('../models/Visit');
const LabResult = require('../models/LabResult');
const MedicalHistory = require('../models/MedicalHistory');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

const DUPLICATE_PHONE = '0812414556';

const run = async () => {
  await connectDB();

  const canonicalUser = await User.findById('6a2e984d212aeb3d7ec19bf6');
  const duplicateUsers = await User.find({
    _id: { $in: ['6a2d735767dbf8f3a3e20991', '6a5c9dbc6d2c98fe4cc631ef'] },
  });
  const doctorWithWrongPhone = await User.findById('6a3826b23c75fe66f9ba2de8');

  const canonicalPatient = await Patient.findById('6a3830c0912c6e43e6b96810');
  const duplicatePatient = await Patient.findById('6a389ab426bd4ed625768e8e');

  if (!canonicalUser || !canonicalPatient) {
    throw new Error('Canonical records not found, aborting dedupe.');
  }

  const duplicateUserIds = duplicateUsers.map((item) => item._id);

  await Appointment.updateMany(
    { patientUser: { $in: duplicateUserIds } },
    {
      $set: {
        patientUser: canonicalUser._id,
        patient: canonicalPatient._id,
        patientName: canonicalPatient.fullName,
        patientCode: canonicalPatient.code,
        phone: canonicalPatient.phone,
      },
    },
  );

  if (duplicatePatient) {
    await Appointment.updateMany(
      { patient: duplicatePatient._id },
      {
        $set: {
          patient: canonicalPatient._id,
          patientName: canonicalPatient.fullName,
          patientCode: canonicalPatient.code,
          phone: canonicalPatient.phone,
        },
      },
    );
  }

  await Promise.all([
    Invoice.updateMany({ patientUser: { $in: duplicateUserIds } }, { $set: { patientUser: canonicalUser._id } }),
    Visit.updateMany({ patientUser: { $in: duplicateUserIds } }, { $set: { patientUser: canonicalUser._id } }),
    LabResult.updateMany({ patientUser: { $in: duplicateUserIds } }, { $set: { patientUser: canonicalUser._id } }),
    MedicalHistory.updateMany({ patientUser: { $in: duplicateUserIds } }, { $set: { patientUser: canonicalUser._id } }),
    Review.updateMany({ patientUser: { $in: duplicateUserIds } }, { $set: { patientUser: canonicalUser._id } }),
    Notification.updateMany({ user: { $in: duplicateUserIds } }, { $set: { user: canonicalUser._id } }),
  ]);

  if (doctorWithWrongPhone && doctorWithWrongPhone.phone === DUPLICATE_PHONE) {
    doctorWithWrongPhone.phone = undefined;
    await doctorWithWrongPhone.save();
  }

  if (duplicatePatient) {
    await Patient.deleteOne({ _id: duplicatePatient._id });
  }

  if (duplicateUsers.length > 0) {
    await User.deleteMany({ _id: { $in: duplicateUserIds } });
  }

  const residualUsers = await User.find({ phone: DUPLICATE_PHONE }).select('_id fullName email role phone');
  const residualPatients = await Patient.find({ phone: DUPLICATE_PHONE }).select('_id fullName email code phone');
  const residualAppointments = await Appointment.find({ phone: DUPLICATE_PHONE }).select('_id code patientUser patient patientName patientCode');

  console.log('Known duplicate records were merged and cleaned.');
  console.log({
    deletedUserIds: duplicateUserIds.map(String),
    deletedPatientId: duplicatePatient ? String(duplicatePatient._id) : null,
    clearedDoctorPhone: doctorWithWrongPhone ? String(doctorWithWrongPhone._id) : null,
    residualUsers,
    residualPatients,
    residualAppointments,
  });

  process.exit(0);
};

run().catch((error) => {
  console.error('Known duplicate cleanup failed:', error);
  process.exit(1);
});
