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

const requiredAccounts = [
  { email: 'nguyen.thi.lan@medicare.vn', role: 'admin' },
  { email: 'truong.my.duyen@medicare.vn', role: 'receptionist' },
  { email: 'nguyen.van.an@medicare.vn', role: 'doctor' },
  { email: 'nguyen.minh.khoi@example.com', role: 'patient' },
];

const run = async () => {
  const issues = [];
  await connectDB();

  const [
    users,
    doctors,
    patients,
    specialties,
    appointments,
    invoices,
    visits,
    labs,
    histories,
    reviews,
    notifications,
    tickets,
  ] = await Promise.all([
    User.find().select('_id email role fullName'),
    Doctor.find().select('_id name user specialty specialtySlug'),
    Patient.find().select('_id code fullName email'),
    Specialty.find().select('_id slug name departmentLabel'),
    Appointment.find().select('_id code patient patientUser specialty doctorRef'),
    Invoice.find().select('_id code patientUser appointment'),
    Visit.find().select('_id patientUser appointment'),
    LabResult.find().select('_id patientUser visit'),
    MedicalHistory.find().select('_id patientUser'),
    Review.find().select('_id patientUser visit invoice'),
    Notification.find().select('_id user'),
    QueueTicket.find().select('_id appointment'),
  ]);

  const ids = (items) => new Set(items.map((item) => String(item._id)));
  const userIds = ids(users);
  const doctorIds = ids(doctors);
  const patientIds = ids(patients);
  const specialtyIds = ids(specialties);
  const appointmentIds = ids(appointments);
  const visitIds = ids(visits);
  const invoiceIds = ids(invoices);

  const pushIssue = (message) => issues.push(message);

  requiredAccounts.forEach((account) => {
    const user = users.find((item) => item.email === account.email && item.role === account.role);
    if (!user) pushIssue(`Missing required account ${account.email} (${account.role}).`);
  });

  doctors.forEach((doctor) => {
    if (!doctor.specialty || !specialtyIds.has(String(doctor.specialty))) {
      pushIssue(`Doctor ${doctor.name} has missing specialty reference.`);
    }
    if (doctor.user && !userIds.has(String(doctor.user))) {
      pushIssue(`Doctor ${doctor.name} has orphan user reference.`);
    }
  });

  appointments.forEach((appointment) => {
    if (appointment.patient && !patientIds.has(String(appointment.patient))) {
      pushIssue(`Appointment ${appointment.code} has orphan patient reference.`);
    }
    if (appointment.patientUser && !userIds.has(String(appointment.patientUser))) {
      pushIssue(`Appointment ${appointment.code} has orphan patient user reference.`);
    }
    if (appointment.specialty && !specialtyIds.has(String(appointment.specialty))) {
      pushIssue(`Appointment ${appointment.code} has orphan specialty reference.`);
    }
    if (appointment.doctorRef && !doctorIds.has(String(appointment.doctorRef))) {
      pushIssue(`Appointment ${appointment.code} has orphan doctor reference.`);
    }
  });

  invoices.forEach((invoice) => {
    if (!userIds.has(String(invoice.patientUser))) {
      pushIssue(`Invoice ${invoice.code} has orphan patient user reference.`);
    }
    if (invoice.appointment && !appointmentIds.has(String(invoice.appointment))) {
      pushIssue(`Invoice ${invoice.code} has orphan appointment reference.`);
    }
  });

  visits.forEach((visit) => {
    if (!userIds.has(String(visit.patientUser))) {
      pushIssue(`Visit ${visit._id} has orphan patient user reference.`);
    }
    if (visit.appointment && !appointmentIds.has(String(visit.appointment))) {
      pushIssue(`Visit ${visit._id} has orphan appointment reference.`);
    }
  });

  labs.forEach((lab) => {
    if (!userIds.has(String(lab.patientUser))) {
      pushIssue(`LabResult ${lab._id} has orphan patient user reference.`);
    }
    if (lab.visit && !visitIds.has(String(lab.visit))) {
      pushIssue(`LabResult ${lab._id} has orphan visit reference.`);
    }
  });

  histories.forEach((entry) => {
    if (!userIds.has(String(entry.patientUser))) {
      pushIssue(`MedicalHistory ${entry._id} has orphan patient user reference.`);
    }
  });

  reviews.forEach((review) => {
    if (!userIds.has(String(review.patientUser))) {
      pushIssue(`Review ${review._id} has orphan patient user reference.`);
    }
    if (review.visit && !visitIds.has(String(review.visit))) {
      pushIssue(`Review ${review._id} has orphan visit reference.`);
    }
    if (review.invoice && !invoiceIds.has(String(review.invoice))) {
      pushIssue(`Review ${review._id} has orphan invoice reference.`);
    }
  });

  notifications.forEach((notification) => {
    if (!userIds.has(String(notification.user))) {
      pushIssue(`Notification ${notification._id} has orphan user reference.`);
    }
  });

  tickets.forEach((ticket) => {
    if (ticket.appointment && !appointmentIds.has(String(ticket.appointment))) {
      pushIssue(`QueueTicket ${ticket._id} has orphan appointment reference.`);
    }
  });

  const summary = {
    users: users.length,
    doctors: doctors.length,
    patients: patients.length,
    specialties: specialties.length,
    appointments: appointments.length,
    invoices: invoices.length,
    visits: visits.length,
    labResults: labs.length,
    medicalHistories: histories.length,
    reviews: reviews.length,
    notifications: notifications.length,
    queueTickets: tickets.length,
  };

  if (issues.length > 0) {
    console.error('Data integrity check failed.');
    issues.forEach((issue) => console.error(`- ${issue}`));
    console.error('Summary:', summary);
    process.exit(1);
  }

  console.log('Data integrity check passed.');
  console.log('Summary:', summary);
  process.exit(0);
};

run().catch((error) => {
  console.error('Data integrity check crashed:', error);
  process.exit(1);
});
