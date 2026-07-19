require('dotenv').config();

const connectDB = require('../config/database');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
const Visit = require('../models/Visit');
const LabResult = require('../models/LabResult');
const MedicalHistory = require('../models/MedicalHistory');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

const PHONE = '0812414556';

const run = async () => {
  await connectDB();

  const users = await User.find({ phone: PHONE }).lean();
  const patients = await Patient.find({ phone: PHONE }).lean();

  const userIds = users.map((item) => item._id);
  const patientIds = patients.map((item) => item._id);

  const [
    appointmentsByUser,
    appointmentsByPatient,
    invoices,
    visits,
    labs,
    histories,
    reviews,
    notifications,
  ] = await Promise.all([
    Appointment.find({ patientUser: { $in: userIds } }).select('_id code patientUser patient patientName patientCode doctor date status').lean(),
    Appointment.find({ patient: { $in: patientIds } }).select('_id code patientUser patient patientName patientCode doctor date status').lean(),
    Invoice.find({ patientUser: { $in: userIds } }).select('_id code patientUser appointment').lean(),
    Visit.find({ patientUser: { $in: userIds } }).select('_id patientUser appointment doctorName date').lean(),
    LabResult.find({ patientUser: { $in: userIds } }).select('_id patientUser visit name date').lean(),
    MedicalHistory.find({ patientUser: { $in: userIds } }).select('_id patientUser type label').lean(),
    Review.find({ patientUser: { $in: userIds } }).select('_id patientUser invoice visit').lean(),
    Notification.find({ user: { $in: userIds } }).select('_id user title createdAt').lean(),
  ]);

  console.log(JSON.stringify({
    phone: PHONE,
    users,
    patients,
    appointmentsByUser,
    appointmentsByPatient,
    invoices,
    visits,
    labs,
    histories,
    reviews,
    notifications,
  }, null, 2));

  process.exit(0);
};

run().catch((error) => {
  console.error('Inspect duplicate phone failed:', error);
  process.exit(1);
});
