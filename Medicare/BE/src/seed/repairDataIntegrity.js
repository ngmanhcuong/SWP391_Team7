require('dotenv').config();

const connectDB = require('../config/database');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Specialty = require('../models/Specialty');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
const Visit = require('../models/Visit');
const LabResult = require('../models/LabResult');
const MedicalHistory = require('../models/MedicalHistory');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const QueueTicket = require('../models/QueueTicket');

const run = async () => {
  await connectDB();

  const users = await User.find().select('_id email fullName');
  const userIds = new Set(users.map((item) => String(item._id)));
  const userByEmail = new Map(
    users.filter((item) => item.email).map((item) => [item.email.toLowerCase(), item]),
  );

  const patients = await Patient.find().select('_id code email fullName');
  const patientIds = new Set(patients.map((item) => String(item._id)));
  const patientByCode = new Map(patients.map((item) => [item.code, item]));
  const patientByEmail = new Map(
    patients.filter((item) => item.email).map((item) => [item.email.toLowerCase(), item]),
  );
  const patientByName = new Map(patients.map((item) => [item.fullName, item]));

  const doctors = await Doctor.find().select('_id name specialty specialtySlug');
  const doctorIds = new Set(doctors.map((item) => String(item._id)));
  const doctorByName = new Map(doctors.map((item) => [item.name, item]));

  const specialties = await Specialty.find().select('_id slug name departmentLabel');
  const specialtyIds = new Set(specialties.map((item) => String(item._id)));
  const specialtyByDepartment = new Map(specialties.map((item) => [item.departmentLabel, item]));

  const report = {
    appointmentsFixed: 0,
    invoicesFixed: 0,
    visitsFixed: 0,
    labResultsFixed: 0,
    medicalHistoriesFixed: 0,
    reviewsFixed: 0,
    notificationsDeleted: 0,
    queueTicketsFixed: 0,
  };

  const appointments = await Appointment.find();
  for (const appointment of appointments) {
    let changed = false;

    if (appointment.patient && !patientIds.has(String(appointment.patient))) {
      const patient =
        patientByCode.get(appointment.patientCode)
        || patientByEmail.get(String(appointment.email || '').toLowerCase())
        || patientByName.get(appointment.patientName);
      appointment.patient = patient?._id || null;
      changed = true;
    }

    if (appointment.patientUser && !userIds.has(String(appointment.patientUser))) {
      const patient =
        patientByCode.get(appointment.patientCode)
        || patientByName.get(appointment.patientName)
        || patientByEmail.get(String(appointment.email || '').toLowerCase());
      const user = patient?.email ? userByEmail.get(patient.email.toLowerCase()) : null;
      appointment.patientUser = user?._id || null;
      changed = true;
    }

    if (appointment.doctorRef && !doctorIds.has(String(appointment.doctorRef))) {
      appointment.doctorRef = doctorByName.get(appointment.doctor)?._id || null;
      changed = true;
    }

    if (appointment.specialty && !specialtyIds.has(String(appointment.specialty))) {
      appointment.specialty = specialtyByDepartment.get(appointment.department)?._id || null;
      changed = true;
    }

    if (changed) {
      await appointment.save();
      report.appointmentsFixed += 1;
    }
  }

  const appointmentById = new Map((await Appointment.find().select('_id patientUser')).map((item) => [String(item._id), item]));
  const visitIds = new Set((await Visit.find().select('_id')).map((item) => String(item._id)));
  const invoiceIds = new Set((await Invoice.find().select('_id')).map((item) => String(item._id)));

  const invoices = await Invoice.find();
  for (const invoice of invoices) {
    if (invoice.patientUser && userIds.has(String(invoice.patientUser)) && (!invoice.appointment || appointmentById.has(String(invoice.appointment)))) {
      continue;
    }

    let changed = false;
    if (invoice.patientUser && !userIds.has(String(invoice.patientUser))) {
      const linkedAppointment = invoice.appointment ? appointmentById.get(String(invoice.appointment)) : null;
      invoice.patientUser = linkedAppointment?.patientUser || null;
      changed = true;
    }
    if (invoice.appointment && !appointmentById.has(String(invoice.appointment))) {
      invoice.appointment = null;
      changed = true;
    }
    if (changed) {
      await invoice.save();
      report.invoicesFixed += 1;
    }
  }

  const visits = await Visit.find();
  for (const visit of visits) {
    let changed = false;
    if (visit.patientUser && !userIds.has(String(visit.patientUser))) {
      const linkedAppointment = visit.appointment ? appointmentById.get(String(visit.appointment)) : null;
      visit.patientUser = linkedAppointment?.patientUser || null;
      changed = true;
    }
    if (visit.appointment && !appointmentById.has(String(visit.appointment))) {
      visit.appointment = null;
      changed = true;
    }
    if (changed) {
      await visit.save();
      report.visitsFixed += 1;
    }
  }

  const labs = await LabResult.find();
  for (const lab of labs) {
    let changed = false;
    if (lab.patientUser && !userIds.has(String(lab.patientUser))) {
      lab.patientUser = null;
      changed = true;
    }
    if (lab.visit && !visitIds.has(String(lab.visit))) {
      lab.visit = null;
      changed = true;
    }
    if (changed) {
      if (!lab.patientUser) {
        await LabResult.findByIdAndDelete(lab._id);
      } else {
        await lab.save();
      }
      report.labResultsFixed += 1;
    }
  }

  const histories = await MedicalHistory.find();
  for (const history of histories) {
    if (history.patientUser && !userIds.has(String(history.patientUser))) {
      await MedicalHistory.findByIdAndDelete(history._id);
      report.medicalHistoriesFixed += 1;
    }
  }

  const reviews = await Review.find();
  for (const review of reviews) {
    let changed = false;
    if (review.patientUser && !userIds.has(String(review.patientUser))) {
      await Review.findByIdAndDelete(review._id);
      report.reviewsFixed += 1;
      continue;
    }
    if (review.visit && !visitIds.has(String(review.visit))) {
      review.visit = null;
      changed = true;
    }
    if (review.invoice && !invoiceIds.has(String(review.invoice))) {
      review.invoice = null;
      changed = true;
    }
    if (changed) {
      await review.save();
      report.reviewsFixed += 1;
    }
  }

  const notifications = await Notification.find();
  for (const notification of notifications) {
    if (notification.user && !userIds.has(String(notification.user))) {
      await Notification.findByIdAndDelete(notification._id);
      report.notificationsDeleted += 1;
    }
  }

  const tickets = await QueueTicket.find();
  for (const ticket of tickets) {
    if (ticket.appointment && !appointmentById.has(String(ticket.appointment))) {
      ticket.appointment = null;
      await ticket.save();
      report.queueTicketsFixed += 1;
    }
  }

  console.log('Repair completed.');
  console.log(report);
  process.exit(0);
};

run().catch((error) => {
  console.error('Repair failed:', error);
  process.exit(1);
});
