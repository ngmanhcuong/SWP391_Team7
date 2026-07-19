const Counter = require('../models/Counter');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const QueueTicket = require('../models/QueueTicket');
const Specialty = require('../models/Specialty');
const Doctor = require('../models/Doctor');

const atToday = (time) => {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

const PATIENTS = [
  { fullName: 'Trần Văn Tú', phone: '0901234567', gender: 'male', address: 'Quận Bình Thạnh, TP.HCM', email: 'tran.van.tu@example.com', insurance: { code: 'DN4790123', place: 'BV Bạch Mai' } },
  { fullName: 'Phạm Mỹ Linh', phone: '0982555111', gender: 'female', address: 'Quận Phú Nhuận, TP.HCM', email: 'pham.my.linh@example.com' },
  { fullName: 'Lê Hoàng Nam', phone: '0911333999', gender: 'male', address: 'TP. Thủ Đức, TP.HCM', email: 'le.hoang.nam@example.com' },
  { fullName: 'Nguyễn Diệu Nhi', phone: '0888123456', gender: 'female', address: 'Quận 10, TP.HCM', email: 'nguyen.dieu.nhi@example.com' },
  { fullName: 'Hoàng Công Thành', phone: '0977444888', gender: 'male', address: 'Quận Gò Vấp, TP.HCM', email: 'hoang.cong.thanh@example.com' },
  { fullName: 'Vương Quốc Anh', phone: '0901111222', gender: 'male', address: 'Quận 7, TP.HCM', email: 'vuong.quoc.anh@example.com', insurance: { code: 'HN1230456', place: 'BV E' } },
];

const QUEUE = [
  { ticket: 1024, patientName: 'Lê Hoàng Nam', code: 'BN-2026-0500', doctor: 'TS.BS. Nguyễn Văn An', room: 'Phòng 101', department: 'Khoa Tim mạch', roomKey: 'P101', status: 'in-progress', waitMinutes: 0 },
  { ticket: 1027, patientName: 'Phạm Mỹ Linh', code: 'BN-2026-1244', doctor: 'BS. Phạm Thu Dung', room: 'Phòng 102', department: 'Khoa Cơ xương khớp', roomKey: 'P102', status: 'waiting', waitMinutes: 5 },
  { ticket: 1023, patientName: 'Trần Văn Tú', code: 'BN-2026-0911', doctor: 'BS. Nguyễn Thị Giang', room: 'Phòng 201', department: 'Khoa Sản & Nhi', roomKey: 'P201', status: 'in-progress', waitMinutes: 12 },
  { ticket: 1022, patientName: 'Đỗ Duy Mạnh', code: 'BN-2026-0410', doctor: 'BS. Trần Anh Khoa', room: 'Phòng 202', department: 'Khoa Mắt', roomKey: 'P202', status: 'skipped', waitMinutes: 0 },
  { ticket: 1025, patientName: 'Nguyễn Diệu Nhi', code: 'BN-2026-0582', doctor: 'BS. Nguyễn Thị Giang', room: 'Phòng 301', department: 'Khoa Sản & Nhi', roomKey: 'P301', status: 'waiting', waitMinutes: 22 },
  { ticket: 1026, patientName: 'Hoàng Công Thành', code: 'BN-2026-1102', doctor: 'BS. Trần Anh Khoa', room: 'Phòng 401', department: 'Khoa Mắt', roomKey: 'P401', status: 'waiting', waitMinutes: 8 },
];

const seedReceptionist = async () => {
  if (process.env.NODE_ENV === 'production' || process.env.SEED_RECEPTIONIST === 'false') {
    return;
  }

  const existing = await Appointment.countDocuments();
  if (existing > 0) return;

  const [specialties, doctors] = await Promise.all([
    Specialty.find().sort({ order: 1 }),
    Doctor.find().sort({ name: 1 }),
  ]);

  const specialtyBySlug = new Map(specialties.map((item) => [item.slug, item]));
  const doctorBySlug = new Map();
  doctors.forEach((doctor) => {
    const list = doctorBySlug.get(doctor.specialtySlug) || [];
    list.push(doctor);
    doctorBySlug.set(doctor.specialtySlug, list);
  });

  // Patients
  const patientDocs = [];
  for (let i = 0; i < PATIENTS.length; i += 1) {
    const seq = await Counter.next('patient');
    const code = `BN-${new Date().getFullYear()}-${String(seq).padStart(4, '0')}`;
    const doc = await Patient.create({ ...PATIENTS[i], code });
    patientDocs.push(doc);
  }

  const appointmentSeeds = [
    { patientIdx: 0, code: '#LH-9802', specialtySlug: 'cardiology', time: '08:30', service: 'Khám tăng huyết áp định kỳ', status: 'pending' },
    { patientIdx: 1, code: '#LH-9801', specialtySlug: 'obstetrics-pediatrics', time: '09:15', service: 'Khám thai quý II', status: 'confirmed' },
    { patientIdx: 2, code: '#LH-9799', specialtySlug: 'musculoskeletal', time: '08:00', service: 'Khám đau vai gáy', status: 'pending' },
    { patientIdx: 3, code: '#LH-9795', specialtySlug: 'ophthalmology', time: '07:30', service: 'Đo thị lực tổng quát', status: 'done' },
    { patientIdx: 4, code: '#LH-9790', specialtySlug: 'cardiology', time: '10:00', service: 'Khám tim mạch tổng quát', status: 'cancelled' },
    { patientIdx: 5, code: '#LH-9803', specialtySlug: 'cardiology', time: '09:00', service: 'Tái khám huyết áp', status: 'confirmed' },
  ];

  let maxApptSeq = 0;
  for (const a of appointmentSeeds) {
    const patient = patientDocs[a.patientIdx];
    const specialty = specialtyBySlug.get(a.specialtySlug);
    const doctor = (doctorBySlug.get(a.specialtySlug) || [])[0];
    maxApptSeq = Math.max(maxApptSeq, Number(a.code.replace(/\D/g, '')));
    await Appointment.create({
      code: a.code,
      patient: patient?._id || null,
      patientName: patient?.fullName || 'Khách',
      patientCode: patient?.code || '',
      phone: patient?.phone || '',
      doctor: doctor?.name || 'Bác sĩ phụ trách',
      doctorRef: doctor?._id || null,
      department: specialty?.departmentLabel || 'Khoa khám bệnh',
      specialty: specialty?._id || null,
      date: atToday(a.time),
      time: a.time,
      service: a.service,
      insured: Boolean(patient?.insurance?.code),
      status: a.status,
      consultationFee: specialty?.consultationFee || 300_000,
      depositAmount: Math.round(((specialty?.consultationFee || 300_000) * 0.3) / 1000) * 1000,
      source: 'reception',
    });
  }

  // Queue tickets
  let maxTicket = 0;
  for (const q of QUEUE) {
    maxTicket = Math.max(maxTicket, q.ticket);
    const { waitMinutes, ...rest } = q;
    const doc = await QueueTicket.create(rest);
    if (waitMinutes > 0) {
      await QueueTicket.updateOne(
        { _id: doc._id },
        { createdAt: new Date(Date.now() - waitMinutes * 60000) },
        { timestamps: false },
      );
    }
  }

  await Counter.ensureAtLeast('appointment', maxApptSeq);
  await Counter.ensureAtLeast('ticket', maxTicket);

  console.log('🌱 Seeded receptionist data: patients, appointments, queue');
};

module.exports = seedReceptionist;
