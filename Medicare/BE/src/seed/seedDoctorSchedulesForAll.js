require('dotenv').config();
const mongoose = require('mongoose');
const Counter = require('../models/Counter');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');

const PATIENT_SEEDS = [
  { fullName: 'Nguyễn Mạnh Cường', phone: '0902000001', gender: 'male', address: 'Quận 1, TP.HCM', email: 'patient.cuong01@example.com' },
  { fullName: 'Trần Thu Hà', phone: '0902000002', gender: 'female', address: 'Quận 3, TP.HCM', email: 'patient.ha02@example.com' },
  { fullName: 'Lê Minh Khoa', phone: '0902000003', gender: 'male', address: 'Bình Thạnh, TP.HCM', email: 'patient.khoa03@example.com' },
  { fullName: 'Phạm Ngọc Anh', phone: '0902000004', gender: 'female', address: 'Phú Nhuận, TP.HCM', email: 'patient.anh04@example.com' },
  { fullName: 'Võ Quốc Bảo', phone: '0902000005', gender: 'male', address: 'Thủ Đức, TP.HCM', email: 'patient.bao05@example.com' },
  { fullName: 'Đặng Mỹ Linh', phone: '0902000006', gender: 'female', address: 'Quận 7, TP.HCM', email: 'patient.linh06@example.com' },
  { fullName: 'Bùi Gia Hân', phone: '0902000007', gender: 'female', address: 'Gò Vấp, TP.HCM', email: 'patient.han07@example.com' },
  { fullName: 'Hồ Thành Nam', phone: '0902000008', gender: 'male', address: 'Quận 10, TP.HCM', email: 'patient.nam08@example.com' },
  { fullName: 'Ngô Tuấn Kiệt', phone: '0902000009', gender: 'male', address: 'Quận 5, TP.HCM', email: 'patient.kiet09@example.com' },
  { fullName: 'Lý Diệu Trang', phone: '0902000010', gender: 'female', address: 'Tân Bình, TP.HCM', email: 'patient.trang10@example.com' },
  { fullName: 'Dương Hoài Phương', phone: '0902000011', gender: 'female', address: 'Quận 12, TP.HCM', email: 'patient.phuong11@example.com' },
  { fullName: 'Mai Quốc Thịnh', phone: '0902000012', gender: 'male', address: 'Quận 6, TP.HCM', email: 'patient.thinh12@example.com' },
];

const TIME_SLOTS = [
  ['08:00', '08:30'],
  ['09:00', '09:30'],
  ['10:00', '10:30'],
  ['13:30', '14:00'],
  ['14:30', '15:00'],
  ['15:30', '16:00'],
];

const SERVICE_BY_SPECIALTY = {
  cardiology: ['Khám tăng huyết áp', 'Tái khám tim mạch'],
  musculoskeletal: ['Khám đau vai gáy', 'Tư vấn đau cột sống'],
  'obstetrics-pediatrics': ['Khám nhi tổng quát', 'Tư vấn sức khỏe thai kỳ'],
  ophthalmology: ['Đo thị lực', 'Khám mắt định kỳ'],
};

const atDateTime = (dateString, time) => {
  const [hour, minute] = time.split(':').map(Number);
  const date = new Date(dateString);
  date.setHours(hour, minute, 0, 0);
  return date;
};

async function ensurePatient(seed) {
  let patient = await Patient.findOne({ email: seed.email.toLowerCase() });
  if (patient) return patient;

  const seq = await Counter.next('patient');
  const code = `BN-${new Date().getFullYear()}-${String(seq).padStart(4, '0')}`;
  patient = await Patient.create({
    code,
    fullName: seed.fullName,
    phone: seed.phone,
    gender: seed.gender,
    address: seed.address,
    email: seed.email.toLowerCase(),
  });
  return patient;
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const doctors = await Doctor.find().populate('specialty', 'slug departmentLabel consultationFee').sort({ specialtySlug: 1, name: 1 });
  const patients = [];
  for (const seed of PATIENT_SEEDS) {
    patients.push(await ensurePatient(seed));
  }

  const targetDate = '2026-07-19T00:00:00+07:00';
  let createdOrUpdated = 0;

  for (let index = 0; index < doctors.length; index += 1) {
    const doctor = doctors[index];
    const patientA = patients[index % patients.length];
    const patientB = patients[(index + 4) % patients.length];
    const slots = TIME_SLOTS[index % TIME_SLOTS.length];
    const services = SERVICE_BY_SPECIALTY[doctor.specialtySlug] || ['Khám tổng quát', 'Tái khám'];
    const baseCode = 9900 + index * 2;
    const appointmentDefs = [
      {
        code: `#LH-${baseCode}`,
        patient: patientA,
        time: slots[0],
        service: services[0],
        status: 'confirmed',
      },
      {
        code: `#LH-${baseCode + 1}`,
        patient: patientB,
        time: slots[1],
        service: services[1] || services[0],
        status: index % 3 === 0 ? 'pending' : 'confirmed',
      },
    ];

    for (const item of appointmentDefs) {
      const result = await Appointment.findOneAndUpdate(
        { code: item.code },
        {
          code: item.code,
          patient: item.patient._id,
          patientName: item.patient.fullName,
          patientCode: item.patient.code,
          phone: item.patient.phone,
          doctor: doctor.name,
          doctorRef: doctor._id,
          department: doctor.specialty?.departmentLabel || 'Khoa khám bệnh',
          specialty: doctor.specialty?._id || null,
          date: atDateTime(targetDate, item.time),
          time: item.time,
          service: item.service,
          insured: Boolean(item.patient.insurance?.code),
          status: item.status,
          consultationFee: doctor.specialty?.consultationFee || 300000,
          depositAmount: Math.round(((doctor.specialty?.consultationFee || 300000) * 0.3) / 1000) * 1000,
          source: 'reception',
        },
        { upsert: true, new: true },
      );
      if (result) createdOrUpdated += 1;
    }
  }

  const summary = [];
  for (const doctor of doctors) {
    const count = await Appointment.countDocuments({
      doctorRef: doctor._id,
      date: {
        $gte: new Date('2026-07-19T00:00:00+07:00'),
        $lt: new Date('2026-07-20T00:00:00+07:00'),
      },
    });
    summary.push({ doctor: doctor.name, specialty: doctor.specialtySlug, appointmentsToday: count });
  }

  console.log(JSON.stringify({ createdOrUpdated, doctors: summary }, null, 2));
  await mongoose.connection.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
