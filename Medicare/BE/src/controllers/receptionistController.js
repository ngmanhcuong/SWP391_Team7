const Counter = require('../models/Counter');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const QueueTicket = require('../models/QueueTicket');

// ─── Helpers ─────────────────────────────────────────────
const genPatientCode = async () => {
  const seq = await Counter.next('patient');
  return `BN-${new Date().getFullYear()}-${String(seq).padStart(4, '0')}`;
};

const genAppointmentCode = async () => {
  const seq = await Counter.next('appointment');
  return `#LH-${String(seq).padStart(4, '0')}`;
};

const genTicket = async () => Counter.next('ticket');

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

const roomKeyFromDepartment = (department = '') =>
  /sản|phụ/i.test(department) ? 'P102' : 'P101';

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ─── Patients ────────────────────────────────────────────
const listPatients = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = {};
    if (q && q.trim()) {
      const rx = new RegExp(escapeRegex(q.trim()), 'i');
      filter.$or = [{ fullName: rx }, { phone: rx }, { code: rx }, { nationalId: rx }];
    }
    const patients = await Patient.find(filter).sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, data: patients });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createPatient = async (req, res) => {
  try {
    const { fullName, phone, nationalId, dob, gender, address, email, insurance } = req.body;
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập họ và tên.' });
    }
    if (!/^0\d{9}$/.test(String(phone || '').trim())) {
      return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ.' });
    }
    const code = await genPatientCode();
    const patient = await Patient.create({
      code,
      fullName: fullName.trim(),
      phone: String(phone).trim(),
      nationalId: nationalId?.trim(),
      dob: dob ? new Date(dob) : undefined,
      gender,
      address: address?.trim(),
      email: email?.trim(),
      insurance: {
        code: insurance?.code?.trim() || '',
        expiry: insurance?.expiry ? new Date(insurance.expiry) : null,
        place: insurance?.place?.trim() || '',
      },
    });
    return res.status(201).json({ success: true, data: patient });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Appointments ────────────────────────────────────────
const listAppointments = async (req, res) => {
  try {
    const { status, department, q } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (department && department !== 'all') filter.department = department;
    if (q && q.trim()) {
      const rx = new RegExp(escapeRegex(q.trim()), 'i');
      filter.$or = [{ patientName: rx }, { code: rx }, { phone: rx }, { patientCode: rx }];
    }
    const appointments = await Appointment.find(filter).sort({ date: 1, time: 1 });
    return res.json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { patientId, patientName, phone, doctor, department, date, time, service } = req.body;
    if (!patientName || !patientName.trim()) {
      return res.status(400).json({ success: false, message: 'Thiếu tên bệnh nhân.' });
    }
    if (!doctor || !department || !date || !time) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin lịch hẹn.' });
    }

    let patientCode = '';
    let resolvedName = patientName.trim();
    let resolvedPhone = String(phone || '').trim();
    let insured = false;
    if (patientId) {
      const patient = await Patient.findById(patientId);
      if (patient) {
        patientCode = patient.code;
        resolvedName = patient.fullName;
        resolvedPhone = patient.phone;
        insured = Boolean(patient.insurance?.code);
      }
    }

    const code = await genAppointmentCode();
    const appointment = await Appointment.create({
      code,
      patient: patientId || null,
      patientName: resolvedName,
      patientCode,
      phone: resolvedPhone,
      doctor,
      department,
      room: req.body.room || '',
      date: new Date(date),
      time,
      service: service || 'Khám tổng quát',
      insured,
      status: 'pending',
    });
    return res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'cancelled', 'done'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn.' });
    }
    return res.json({ success: true, data: appointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const checkinAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn.' });
    }
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Lịch hẹn đã bị hủy.' });
    }
    if (appointment.status === 'checked-in' && appointment.queueTicket) {
      return res.json({ success: true, data: { appointment, ticket: appointment.queueTicket } });
    }

    const ticketNo = await genTicket();
    const roomKey = roomKeyFromDepartment(appointment.department);
    await QueueTicket.create({
      ticket: ticketNo,
      patientName: appointment.patientName,
      code: appointment.patientCode,
      doctor: appointment.doctor,
      room: appointment.room || (roomKey === 'P102' ? 'P.205' : 'P.204'),
      department: appointment.department,
      roomKey,
      status: 'waiting',
      appointment: appointment._id,
    });

    appointment.status = 'checked-in';
    appointment.checkedInAt = new Date();
    appointment.queueTicket = ticketNo;
    await appointment.save();

    return res.json({ success: true, data: { appointment, ticket: ticketNo } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Queue ───────────────────────────────────────────────
const listQueue = async (req, res) => {
  try {
    const { roomKey } = req.query;
    const filter = { status: { $in: ['waiting', 'in-progress', 'skipped'] } };
    if (roomKey && roomKey !== 'all') filter.roomKey = roomKey;

    const tickets = await QueueTicket.find(filter).sort({ ticket: 1 });
    const completedToday = await QueueTicket.countDocuments({
      status: 'done',
      completedAt: { $gte: startOfToday(), $lte: endOfToday() },
    });
    return res.json({
      success: true,
      data: {
        tickets,
        completedCount: completedToday,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const manualAddQueue = async (req, res) => {
  try {
    const { patientName, code, doctor, roomKey } = req.body;
    if (!patientName || !patientName.trim()) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên bệnh nhân.' });
    }
    const key = ['P101', 'P102'].includes(roomKey) ? roomKey : 'P101';
    const ticketNo = await genTicket();
    const ticket = await QueueTicket.create({
      ticket: ticketNo,
      patientName: patientName.trim(),
      code: code?.trim() || `BN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      doctor: doctor || '',
      room: key === 'P102' ? 'P.205' : 'P.204',
      department: key === 'P102' ? 'Sản khoa' : 'Nội khoa',
      roomKey: key,
      status: 'waiting',
    });
    return res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// A doctor (or room, when no doctor assigned) can only examine one patient at a
// time. When a new patient is called, the previous in-progress one is finished.
const finishConflicting = async (ticket) => {
  const filter = { status: 'in-progress', _id: { $ne: ticket._id } };
  if (ticket.doctor) filter.doctor = ticket.doctor;
  else filter.roomKey = ticket.roomKey;

  const others = await QueueTicket.find(filter);
  for (const other of others) {
    other.status = 'done';
    other.completedAt = new Date();
    await other.save();
    if (other.appointment) {
      await Appointment.findByIdAndUpdate(other.appointment, { status: 'done' });
    }
  }
};

const callNextQueue = async (req, res) => {
  try {
    const next = await QueueTicket.findOne({ status: 'waiting' }).sort({ ticket: 1 });
    if (!next) {
      return res.status(404).json({ success: false, message: 'Hết số chờ.' });
    }
    next.status = 'in-progress';
    next.calledAt = new Date();
    await next.save();
    await finishConflicting(next);
    return res.json({ success: true, data: next });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateQueueTicket = async (req, res) => {
  try {
    const { action } = req.body;
    const ticket = await QueueTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy số thứ tự.' });
    }

    let callsNewPatient = false;
    switch (action) {
      case 'call':
      case 'recall':
        ticket.status = 'in-progress';
        ticket.calledAt = new Date();
        callsNewPatient = true;
        break;
      case 'skip':
        ticket.status = 'skipped';
        break;
      case 'complete':
        ticket.status = 'done';
        ticket.completedAt = new Date();
        if (ticket.appointment) {
          await Appointment.findByIdAndUpdate(ticket.appointment, { status: 'done' });
        }
        break;
      default:
        return res.status(400).json({ success: false, message: 'Hành động không hợp lệ.' });
    }
    await ticket.save();
    if (callsNewPatient) await finishConflicting(ticket);
    return res.json({ success: true, data: ticket });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Overview (dashboard) ────────────────────────────────
const getOverview = async (req, res) => {
  try {
    const from = startOfToday();
    const to = endOfToday();
    const todayFilter = { date: { $gte: from, $lte: to } };

    const [appointmentsToday, checkedInToday, confirmedToday, pendingToday, cancelledToday] =
      await Promise.all([
        Appointment.countDocuments(todayFilter),
        Appointment.countDocuments({ ...todayFilter, status: 'checked-in' }),
        Appointment.countDocuments({ ...todayFilter, status: 'confirmed' }),
        Appointment.countDocuments({ ...todayFilter, status: 'pending' }),
        Appointment.countDocuments({ ...todayFilter, status: 'cancelled' }),
      ]);

    const waitingCount = await QueueTicket.countDocuments({ status: { $in: ['waiting', 'in-progress'] } });
    const completedCount = await QueueTicket.countDocuments({
      status: 'done',
      completedAt: { $gte: from, $lte: to },
    });

    const queuePreview = await QueueTicket.find({ status: { $in: ['waiting', 'in-progress'] } })
      .sort({ ticket: 1 })
      .limit(5);

    const upcoming = await Appointment.find({
      ...todayFilter,
      status: { $in: ['pending', 'confirmed'] },
    })
      .sort({ time: 1 })
      .limit(5);

    return res.json({
      success: true,
      data: {
        stats: {
          appointmentsToday,
          checkedInToday,
          confirmedToday,
          pendingToday,
          cancelledToday,
          waitingCount,
          completedCount,
        },
        queuePreview,
        upcoming,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  listPatients,
  createPatient,
  listAppointments,
  createAppointment,
  updateAppointmentStatus,
  checkinAppointment,
  listQueue,
  manualAddQueue,
  callNextQueue,
  updateQueueTicket,
  getOverview,
};
