const Counter = require('../models/Counter');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const QueueTicket = require('../models/QueueTicket');

const atToday = (time) => {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

const PATIENTS = [
  { fullName: 'Trần Văn Tú', phone: '0901234567', gender: 'male', address: 'Hà Nội', insurance: { code: 'DN4790123', place: 'BV Bạch Mai' } },
  { fullName: 'Phạm Mỹ Linh', phone: '0982555111', gender: 'female', address: 'Hà Nội' },
  { fullName: 'Lê Hoàng Nam', phone: '0911333999', gender: 'male', address: 'Hải Phòng' },
  { fullName: 'Nguyễn Diệu Nhi', phone: '0888123456', gender: 'female', address: 'Hà Nội' },
  { fullName: 'Hoàng Công Thành', phone: '0977444888', gender: 'male', address: 'Bắc Ninh' },
  { fullName: 'Vương Quốc Anh', phone: '0901111222', gender: 'male', address: 'Hà Nội', insurance: { code: 'HN1230456', place: 'BV E' } },
];

const APPOINTMENTS = [
  { patientIdx: 0, code: '#LH-9802', doctor: 'BS. Lê Minh Hoàng', department: 'Khoa Nội', time: '08:30', service: 'Khám nội tổng quát', status: 'pending' },
  { patientIdx: 1, code: '#LH-9801', doctor: 'BS. Nguyễn Thu Thủy', department: 'Khoa Sản', time: '09:15', service: 'Siêu âm thai', status: 'confirmed' },
  { patientIdx: 2, code: '#LH-9799', doctor: 'BS. Đặng Quốc Anh', department: 'Khoa Ngoại', time: '08:00', service: 'Khám chấn thương', status: 'pending' },
  { patientIdx: 3, code: '#LH-9795', doctor: 'BS. Vũ Hà Phương', department: 'Khoa Nhi', time: '07:30', service: 'Khám nhi tổng quát', status: 'done' },
  { patientIdx: 4, code: '#LH-9790', doctor: 'BS. Lê Minh Hoàng', department: 'Khoa Nội', time: '10:00', service: 'Khám nội tổng quát', status: 'cancelled' },
  { patientIdx: 5, code: '#LH-9803', doctor: 'BS. Lê Minh Hoàng', department: 'Khoa Nội', time: '09:00', service: 'Khám nội tổng quát', status: 'confirmed' },
];

// Standalone queue tickets representing the current waiting room.
// 4 khoa (Nội/Ngoại/Sản/Nhi), mỗi khoa 2 phòng → tổng 8 phòng khám.
const QUEUE = [
  { ticket: 1024, patientName: 'Lê Hoàng Nam', code: 'BN-2024-0500', doctor: 'BS. Phan Minh Hưng', room: 'Phòng 101', department: 'Khoa Nội', roomKey: 'P101', status: 'in-progress', waitMinutes: 0 },
  { ticket: 1027, patientName: 'Vũ Thị Mỹ Linh', code: 'BN-2024-1244', doctor: 'BS. Lê Minh Hoàng', room: 'Phòng 102', department: 'Khoa Nội', roomKey: 'P102', status: 'waiting', waitMinutes: 5 },
  { ticket: 1023, patientName: 'Phạm Thúy Hạnh', code: 'BN-2024-0911', doctor: 'BS. Lê Quang', room: 'Phòng 201', department: 'Khoa Ngoại', roomKey: 'P201', status: 'in-progress', waitMinutes: 12 },
  { ticket: 1022, patientName: 'Đỗ Duy Mạnh', code: 'BN-2024-0410', doctor: 'BS. Đặng Quốc Anh', room: 'Phòng 202', department: 'Khoa Ngoại', roomKey: 'P202', status: 'skipped', waitMinutes: 0 },
  { ticket: 1025, patientName: 'Trần Văn Tú', code: 'BN-2024-0582', doctor: 'BS. Nguyễn Lan Anh', room: 'Phòng 301', department: 'Khoa Sản', roomKey: 'P301', status: 'waiting', waitMinutes: 22 },
  { ticket: 1026, patientName: 'Hoàng Anh Quân', code: 'BN-2024-1102', doctor: 'BS. Trần Thu Hà', room: 'Phòng 401', department: 'Khoa Nhi', roomKey: 'P401', status: 'waiting', waitMinutes: 8 },
];

const seedReceptionist = async () => {
  if (process.env.NODE_ENV === 'production' || process.env.SEED_RECEPTIONIST === 'false') {
    return;
  }

  const existing = await Appointment.countDocuments();
  if (existing > 0) return;

  // Patients
  const patientDocs = [];
  for (let i = 0; i < PATIENTS.length; i += 1) {
    const seq = await Counter.next('patient');
    const code = `BN-${new Date().getFullYear()}-${String(seq).padStart(4, '0')}`;
    const doc = await Patient.create({ ...PATIENTS[i], code });
    patientDocs.push(doc);
  }

  // Appointments
  let maxApptSeq = 0;
  for (const a of APPOINTMENTS) {
    const patient = patientDocs[a.patientIdx];
    maxApptSeq = Math.max(maxApptSeq, Number(a.code.replace(/\D/g, '')));
    await Appointment.create({
      code: a.code,
      patient: patient?._id || null,
      patientName: patient?.fullName || 'Khách',
      patientCode: patient?.code || '',
      phone: patient?.phone || '',
      doctor: a.doctor,
      department: a.department,
      date: atToday(a.time),
      time: a.time,
      service: a.service,
      insured: Boolean(patient?.insurance?.code),
      status: a.status,
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
