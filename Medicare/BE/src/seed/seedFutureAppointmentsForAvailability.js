require('dotenv').config({ path: './Medicare/BE/.env' });
const mongoose = require('mongoose');
const Counter = require('../models/Counter');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Specialty = require('../models/Specialty');
const User = require('../models/User');

const FACILITY_NAME = 'MedCare Clinic - Quận 1';

const computeDeposit = (fee) => Math.max(Math.round((fee * 0.3) / 1000) * 1000, 100000);

const genAppointmentCode = async () => {
  const seq = await Counter.next('appointment');
  return `#LH-${String(seq).padStart(4, '0')}`;
};

const genInvoiceCode = async () => {
  const seq = await Counter.next('invoice');
  return `HD-${String(seq).padStart(6, '0')}`;
};

const genPatientCode = async () => {
  const seq = await Counter.next('patient');
  return `BN-${new Date().getFullYear()}-${String(seq).padStart(4, '0')}`;
};

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (value) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const seedPlan = [
  { date: '2026-07-20', specialtySlug: 'cardiology', doctorName: 'Nguyễn Văn An', time: '08:30', patientEmail: 'ngmanhcuong300906@gmail.com' },
  { date: '2026-07-20', specialtySlug: 'musculoskeletal', doctorName: 'Hoàng Văn Đức', time: '10:00', patientEmail: 'phandinhban11022005@gmail.com' },
  { date: '2026-07-20', specialtySlug: 'obstetrics-pediatrics', doctorName: 'Nguyễn Thị Giang', time: '14:00', patientEmail: 'tranxuanthuan443@gmail.com' },
  { date: '2026-07-20', specialtySlug: 'ophthalmology', doctorName: 'Trần Anh Khoa', time: '15:30', patientEmail: 'toandm1103@gmail.com' },
  { date: '2026-07-21', specialtySlug: 'cardiology', doctorName: 'Lê Hoàng Cường', time: '09:30', patientEmail: 'khoi09012022@gmail.com' },
  { date: '2026-07-21', specialtySlug: 'musculoskeletal', doctorName: 'Trần Thị Phương', time: '13:30', patientEmail: 'hohuutin52@gmail.com' },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const patients = await Patient.find().select('code fullName phone email insurance gender dob').lean();
  const users = await User.find({ role: 'patient' }).select('fullName email phone').lean();
  const doctors = await Doctor.find().select('name specialtySlug').lean();
  const specialties = await Specialty.find().select('slug name departmentLabel consultationFee').lean();

  const patientByEmail = new Map(patients.filter((item) => item.email).map((item) => [item.email.toLowerCase(), item]));
  const userByEmail = new Map(users.filter((item) => item.email).map((item) => [item.email.toLowerCase(), item]));
  const specialtyBySlug = new Map(specialties.map((item) => [item.slug, item]));

  let created = 0;
  let skipped = 0;

  for (const item of seedPlan) {
    const specialty = specialtyBySlug.get(item.specialtySlug);
    const doctor = doctors.find(
      (entry) => entry.specialtySlug === item.specialtySlug && entry.name.includes(item.doctorName),
    );
    const user = userByEmail.get(item.patientEmail.toLowerCase());
    let patient = patientByEmail.get(item.patientEmail.toLowerCase());

    if (!specialty || !doctor || !user) {
      skipped += 1;
      continue;
    }

    if (!patient) {
      const code = await genPatientCode();
      patient = await Patient.create({
        code,
        fullName: user.fullName,
        phone: user.phone || `09${Math.floor(10000000 + Math.random() * 89999999)}`,
        email: user.email.toLowerCase(),
        gender: 'other',
      });
      patientByEmail.set(user.email.toLowerCase(), patient.toObject());
    }

    const visitDate = new Date(`${item.date}T00:00:00.000Z`);
    const duplicate = await Appointment.findOne({
      doctorRef: doctor._id,
      date: { $gte: startOfDay(visitDate), $lte: endOfDay(visitDate) },
      time: item.time,
      status: { $in: ['pending', 'confirmed', 'checked-in', 'done'] },
    }).select('_id');

    if (duplicate) {
      skipped += 1;
      continue;
    }

    const consultationFee = specialty.consultationFee;
    const depositAmount = computeDeposit(consultationFee);
    const appointmentCode = await genAppointmentCode();

    const appointment = await Appointment.create({
      code: appointmentCode,
      patient: patient._id,
      patientUser: user._id,
      patientName: patient.fullName,
      patientCode: patient.code,
      phone: patient.phone,
      doctor: doctor.name,
      doctorRef: doctor._id,
      department: specialty.departmentLabel,
      specialty: specialty._id,
      date: visitDate,
      time: item.time,
      service: `Khám ${specialty.name}`,
      symptoms: 'Đặt lịch khám định kỳ để kiểm tra theo dõi sức khỏe.',
      additionalNotes: 'Dữ liệu demo thực tế cho kiểm tra khóa khung giờ.',
      consultationFee,
      depositAmount,
      insured: Boolean(patient.insurance?.code),
      status: 'confirmed',
      source: 'patient',
      isSeed: true,
    });

    const invoiceCode = await genInvoiceCode();
    await Invoice.create({
      code: invoiceCode,
      patientUser: user._id,
      appointment: appointment._id,
      bookingReferenceCode: appointmentCode,
      doctorName: doctor.name,
      specialtyName: specialty.name,
      facility: FACILITY_NAME,
      visitDate,
      lineItems: [{ label: `Phí khám ${specialty.name}`, amount: consultationFee, type: 'charge' }],
      depositAmount,
      depositPaymentMethod: 'banking',
      depositPaidAt: new Date(),
      estimatedRemaining: Math.max(consultationFee - depositAmount, 0),
      status: 'awaiting_visit',
      isSeed: true,
    });

    created += 1;
  }

  console.log(JSON.stringify({ created, skipped }, null, 2));
  await mongoose.connection.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
