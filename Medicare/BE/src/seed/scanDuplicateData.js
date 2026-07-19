require('dotenv').config();

const connectDB = require('../config/database');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const findDuplicates = async (Model, matchField) => Model.aggregate([
  { $match: { [matchField]: { $nin: [null, ''] } } },
  {
    $group: {
      _id: `$${matchField}`,
      count: { $sum: 1 },
      ids: { $push: '$_id' },
      names: { $push: '$fullName' },
    },
  },
  { $match: { count: { $gt: 1 } } },
]);

const run = async () => {
  await connectDB();

  const [userEmail, userPhone, patientEmail, patientPhone, doctorName, appointmentCode] =
    await Promise.all([
      findDuplicates(User, 'email'),
      findDuplicates(User, 'phone'),
      findDuplicates(Patient, 'email'),
      findDuplicates(Patient, 'phone'),
      Doctor.aggregate([
        { $group: { _id: '$name', count: { $sum: 1 }, ids: { $push: '$_id' } } },
        { $match: { count: { $gt: 1 } } },
      ]),
      Appointment.aggregate([
        { $group: { _id: '$code', count: { $sum: 1 }, ids: { $push: '$_id' } } },
        { $match: { count: { $gt: 1 } } },
      ]),
    ]);

  const report = {
    userEmail,
    userPhone,
    patientEmail,
    patientPhone,
    doctorName,
    appointmentCode,
  };

  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
};

run().catch((error) => {
  console.error('Duplicate scan failed:', error);
  process.exit(1);
});
