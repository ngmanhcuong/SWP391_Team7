const Counter = require('../models/Counter');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Specialty = require('../models/Specialty');
const Doctor = require('../models/Doctor');
const Invoice = require('../models/Invoice');
const Visit = require('../models/Visit');
const LabResult = require('../models/LabResult');
const MedicalHistory = require('../models/MedicalHistory');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

// ─── Helpers ─────────────────────────────────────────────
const DEPOSIT_RATE = 0.3;
const MIN_DEPOSIT_AMOUNT = 100_000;
const FACILITY_NAME = 'MedCare Clinic - Quận 1';

const computeDeposit = (fee) =>
  Math.max(Math.round((fee * DEPOSIT_RATE) / 1000) * 1000, MIN_DEPOSIT_AMOUNT);

const toISO = (date) => (date ? new Date(date).toISOString() : undefined);

const formatDateVN = (date) =>
  date
    ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
        new Date(date),
      )
    : '';

const formatCurrencyVnd = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const firstName = (fullName = '') => fullName.trim().split(/\s+/).slice(-1)[0] || fullName;

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

const startOfYear = () => new Date(new Date().getFullYear(), 0, 1);

const timeAgo = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.round(hours / 24);
  return `${days} ngày trước`;
};

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

// Tìm hoặc tạo bản ghi Patient (cho màn Lễ tân) gắn với tài khoản User
const normalizePhone = (phone) => {
  const trimmed = typeof phone === 'string' ? phone.trim() : '';
  return trimmed || 'Chua cap nhat';
};

const ensurePatientRecord = async (user) => {
  let patient = null;
  if (user.email) {
    patient = await Patient.findOne({ email: user.email.toLowerCase() });
  }
  if (!patient) {
    const code = await genPatientCode();
    patient = await Patient.create({
      code,
      fullName: user.fullName,
      phone: normalizePhone(user.phone),
      email: user.email ? user.email.toLowerCase() : undefined,
      dob: user.dateOfBirth || undefined,
      gender: user.gender,
      nationalId: user.nationalId || '',
    });
  } else {
    const nextFullName = user.fullName?.trim() || patient.fullName;
    const nextPhone = patient.phone?.trim() || normalizePhone(user.phone);
    const nextEmail = user.email ? user.email.toLowerCase() : patient.email;
    const nextDob = user.dateOfBirth || patient.dob;
    const nextNationalId = user.nationalId?.trim() || patient.nationalId || '';
    const shouldUpdate =
      patient.fullName !== nextFullName ||
      patient.phone !== nextPhone ||
      patient.email !== nextEmail ||
      patient.gender !== user.gender ||
      String(patient.dob || '') !== String(nextDob || '') ||
      (patient.nationalId || '') !== nextNationalId;

    if (shouldUpdate) {
      patient.fullName = nextFullName;
      patient.phone = nextPhone;
      patient.email = nextEmail;
      patient.gender = user.gender;
      patient.dob = nextDob;
      patient.nationalId = nextNationalId;
      await patient.save();
    }
  }
  return patient;
};

// ─── Mappers (DB doc -> shape mà FE đang dùng) ───────────
const mapDoctor = (doc) => ({
  id: doc._id.toString(),
  name: doc.name,
  specialtyId: doc.specialtySlug,
  departmentLabel: doc.populated?.departmentLabel || doc.departmentLabel || '',
  rating: doc.rating,
  reviewCount: doc.reviewCount,
  experienceYears: doc.experienceYears,
  tag: { label: doc.tag?.label || '', variant: doc.tag?.variant || 'potential' },
  nextAvailableSlot: doc.nextAvailableSlot ?? null,
  roomCode: doc.roomCode ?? null,
  roomName: doc.roomName ?? null,
  isAvailable: doc.isAvailable,
  avatarBg: doc.avatarBg,
});

const DOCTOR_TITLE_PREFIXES = [
  'TS.BS.',
  'TS.BS',
  'BSCKII.',
  'BSCKII',
  'BSCKI.',
  'BSCKI',
  'ThS.BS.',
  'ThS.BS',
  'PGS.TS.BS.',
  'PGS.TS.BS',
  'GS.TS.BS.',
  'GS.TS.BS',
  'BS.',
  'BS',
];

const getDoctorCoreName = (name = '') => {
  let normalized = String(name).trim();
  for (const prefix of DOCTOR_TITLE_PREFIXES) {
    if (normalized.startsWith(prefix)) {
      normalized = normalized.slice(prefix.length).trim();
      break;
    }
  }
  return normalized.toLowerCase();
};

const dedupeDoctorsByCoreName = (doctors) => {
  const uniqueDoctors = new Map();

  doctors.forEach((doctor) => {
    const key = `${doctor.specialtySlug}::${getDoctorCoreName(doctor.name)}`;
    const existing = uniqueDoctors.get(key);

    if (!existing) {
      uniqueDoctors.set(key, doctor);
      return;
    }

    const existingHasUser = Boolean(existing.user);
    const candidateHasUser = Boolean(doctor.user);

    if (candidateHasUser && !existingHasUser) {
      uniqueDoctors.set(key, doctor);
      return;
    }

    if (candidateHasUser === existingHasUser) {
      if ((doctor.experienceYears || 0) > (existing.experienceYears || 0)) {
        uniqueDoctors.set(key, doctor);
        return;
      }

      if ((doctor.rating || 0) > (existing.rating || 0)) {
        uniqueDoctors.set(key, doctor);
      }
    }
  });

  return Array.from(uniqueDoctors.values());
};

const MORNING_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
const AFTERNOON_SLOTS = ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
const ACTIVE_BOOKED_STATUSES = ['pending', 'confirmed', 'checked-in', 'done'];

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const startOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const endOfDay = (date) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

const buildDoctorAvailabilityDays = (appointments, fromDate, daysCount = 14) => {
  const bookedByDate = new Map();

  appointments.forEach((appointment) => {
    const dateKey = toDateKey(new Date(appointment.date));
    if (!bookedByDate.has(dateKey)) {
      bookedByDate.set(dateKey, new Set());
    }
    bookedByDate.get(dateKey).add(appointment.time);
  });

  const weekdayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const today = startOfToday();
  const start = startOfDay(fromDate);
  const days = [];

  for (let index = 0; index < daysCount; index += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + index);

    const dateKey = toDateKey(current);
    const isPast = current < today;
    const isSunday = current.getDay() === 0;
    const bookedSlots = bookedByDate.get(dateKey) || new Set();
    const slots = isPast || isSunday
      ? []
      : [
          ...MORNING_SLOTS.map((time) => ({
            id: `${dateKey}-${time}`,
            time,
            period: 'morning',
            available: !bookedSlots.has(time),
          })),
          ...AFTERNOON_SLOTS.map((time) => ({
            id: `${dateKey}-${time}`,
            time,
            period: 'afternoon',
            available: !bookedSlots.has(time),
          })),
        ];

    days.push({
      date: dateKey,
      dayNumber: current.getDate(),
      weekdayLabel: weekdayLabels[current.getDay()],
      isPast,
      hasAvailableSlots: slots.some((slot) => slot.available),
      slots,
    });
  }

  return days;
};

const mapInvoice = (doc) => {
  const lineItems = (doc.lineItems || []).map((item, index) => ({
    id: `${doc._id.toString()}-li-${index}`,
    label: item.label,
    amount: item.amount,
    type: item.type,
  }));
  const subtotal = lineItems
    .filter((item) => item.type === 'charge')
    .reduce((sum, item) => sum + item.amount, 0);

  let totalDue = 0;
  let estimatedRemaining;
  if (doc.status === 'pending_payment') {
    totalDue = Math.max(subtotal - doc.depositAmount, 0);
  } else if (doc.status === 'awaiting_visit') {
    estimatedRemaining = Math.max(subtotal - doc.depositAmount, 0);
  }

  return {
    id: doc._id.toString(),
    invoiceCode: doc.code,
    bookingReferenceCode: doc.bookingReferenceCode || undefined,
    visitDate: formatDateVN(doc.visitDate),
    doctorName: doc.doctorName,
    specialtyName: doc.specialtyName,
    status: doc.status,
    lineItems,
    subtotal,
    depositAmount: doc.depositAmount,
    depositPaymentMethod: doc.depositPaymentMethod || undefined,
    depositPaidAt: toISO(doc.depositPaidAt),
    totalDue,
    estimatedRemaining,
    paidAt: toISO(doc.paidAt),
    dueDate: doc.dueDate ? formatDateVN(doc.dueDate) : undefined,
    createdAt: toISO(doc.createdAt),
  };
};

const mapVisit = (doc) => ({
  id: doc._id.toString(),
  date: formatDateVN(doc.date),
  doctorName: doc.doctorName,
  specialty: doc.specialty,
  diagnosis: doc.diagnosis,
  symptoms: doc.symptoms,
  treatment: doc.treatment,
  prescriptions: (doc.prescriptions || []).map((p, index) => ({
    id: `${doc._id.toString()}-rx-${index}`,
    name: p.name,
    dosage: p.dosage,
  })),
  status: doc.status,
  facility: doc.facility,
});

const mapLab = (doc) => ({
  id: doc._id.toString(),
  name: doc.name,
  date: formatDateVN(doc.date),
  doctorName: doc.doctorName,
  status: doc.status,
  summary: doc.summary,
  visitId: doc.visit ? doc.visit.toString() : undefined,
});

const mapHistory = (doc) => ({
  id: doc._id.toString(),
  type: doc.type,
  label: doc.label,
  detail: doc.detail,
  since: doc.since || undefined,
});

const mapNotification = (doc) => ({
  id: doc._id.toString(),
  title: doc.title,
  description: doc.description,
  timeAgo: timeAgo(doc.createdAt),
  createdAt: toISO(doc.createdAt),
  type: doc.type,
  isUnread: doc.isUnread,
  action: doc.action?.label ? { label: doc.action.label, href: doc.action.href } : undefined,
});

const mapReview = (doc) => ({
  id: doc._id.toString(),
  visitId: doc.invoice ? doc.invoice.toString() : doc._id.toString(),
  visitDate: formatDateVN(doc.visitDate),
  doctorName: doc.doctorName,
  specialtyName: doc.specialtyName,
  facility: doc.facility,
  overallRating: doc.overallRating,
  doctorRating: doc.doctorRating,
  facilityRating: doc.facilityRating,
  comment: doc.comment,
  tags: doc.tags || [],
  submittedAt: toISO(doc.submittedAt),
  isAnonymous: doc.isAnonymous,
});

// ─── Specialties & Doctors ───────────────────────────────
const listSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find().sort({ order: 1 });
    const data = specialties.map((s) => ({
      id: s.slug,
      name: s.name,
      departmentLabel: s.departmentLabel,
      consultationFee: s.consultationFee,
      depositAmount: computeDeposit(s.consultationFee),
      doctorCount: s.doctorCount,
    }));
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const listDoctors = async (req, res) => {
  try {
    const { specialtyId } = req.query;
    const filter = {};
    if (specialtyId && specialtyId !== 'all') filter.specialtySlug = specialtyId;
    const doctors = await Doctor.find(filter).populate('specialty', 'departmentLabel');
    const dedupedDoctors = dedupeDoctorsByCoreName(doctors);
    const data = dedupedDoctors.map((doc) =>
      mapDoctor({
        ...doc.toObject(),
        _id: doc._id,
        departmentLabel: doc.specialty?.departmentLabel || '',
      }),
    );
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId, fromDate, daysCount } = req.query;

    if (!doctorId) {
      return res.status(400).json({ success: false, message: 'Thiếu doctorId.' });
    }

    const doctor = await Doctor.findById(doctorId).catch(() => null);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ.' });
    }

    const parsedStart = fromDate ? new Date(fromDate) : new Date();
    if (Number.isNaN(parsedStart.getTime())) {
      return res.status(400).json({ success: false, message: 'Ngày bắt đầu không hợp lệ.' });
    }

    const safeDaysCount = Math.min(Math.max(Number(daysCount) || 14, 1), 31);
    const rangeStart = startOfDay(parsedStart);
    const rangeEnd = endOfDay(new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + safeDaysCount - 1));

    const appointments = await Appointment.find({
      doctorRef: doctor._id,
      date: { $gte: rangeStart, $lte: rangeEnd },
      status: { $in: ACTIVE_BOOKED_STATUSES },
    }).select('date time status');

    const data = buildDoctorAvailabilityDays(appointments, rangeStart, safeDaysCount);
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Appointments / Booking ──────────────────────────────
const listAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientUser: req.user._id }).sort({
      date: -1,
      time: 1,
    });
    return res.json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createAppointment = async (req, res) => {
  try {
    const {
      specialtyId,
      doctorId,
      doctorName,
      date,
      time,
      symptoms,
      additionalNotes,
      depositPaymentMethod,
    } = req.body;

    if (!specialtyId || !date || !time || (!doctorId && !doctorName)) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đặt lịch.' });
    }

    const allowedMethods = ['vnpay', 'momo', 'banking'];
    if (!allowedMethods.includes(depositPaymentMethod)) {
      return res.status(400).json({ success: false, message: 'Phương thức thanh toán cọc không hợp lệ.' });
    }

    const specialty = await Specialty.findOne({ slug: specialtyId });
    if (!specialty) {
      return res.status(404).json({ success: false, message: 'Chuyên khoa không tồn tại.' });
    }

    let resolvedDoctorName = doctorName;
    let doctorRef = null;
    if (doctorId) {
      const doctor = await Doctor.findById(doctorId).catch(() => null);
      if (doctor) {
        doctorRef = doctor._id;
        resolvedDoctorName = doctor.name;
      }
    }
    if (!resolvedDoctorName) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bác sĩ.' });
    }

    if (!doctorRef) {
      return res.status(400).json({ success: false, message: 'Bác sĩ chưa được liên kết lịch làm việc hợp lệ.' });
    }

    const appointmentDate = new Date(date);
    if (Number.isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Ngày khám không hợp lệ.' });
    }

    const conflictingAppointment = await Appointment.findOne({
      doctorRef,
      date: { $gte: startOfDay(appointmentDate), $lte: endOfDay(appointmentDate) },
      time,
      status: { $in: ACTIVE_BOOKED_STATUSES },
    }).select('_id');

    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'Khung giờ này đã có người đặt. Vui lòng chọn giờ khác.',
      });
    }

    const consultationFee = specialty.consultationFee;
    const depositAmount = computeDeposit(consultationFee);
    const now = new Date();
    const patientRecord = await ensurePatientRecord(req.user);
    const code = await genAppointmentCode();

    const appointment = await Appointment.create({
      code,
      patient: patientRecord?._id || null,
      patientUser: req.user._id,
      patientName: req.user.fullName,
      patientCode: patientRecord?.code || '',
      phone: patientRecord?.phone || normalizePhone(req.user.phone),
      doctor: resolvedDoctorName,
      doctorRef,
      department: specialty.departmentLabel,
      specialty: specialty._id,
      date: appointmentDate,
      time,
      service: `Khám ${specialty.name}`,
      symptoms: symptoms?.trim() || '',
      additionalNotes: additionalNotes?.trim() || '',
      consultationFee,
      depositAmount,
      depositPaymentMethod,
      depositPaidAt: now,
      receptionDepositConfirmed: false,
      insured: Boolean(patientRecord?.insurance?.code),
      status: 'pending',
      source: 'patient',
    });

    const invoiceCode = await genInvoiceCode();
    await Invoice.create({
      code: invoiceCode,
      patientUser: req.user._id,
      appointment: appointment._id,
      bookingReferenceCode: code,
      doctorName: resolvedDoctorName,
      specialtyName: specialty.name,
      facility: FACILITY_NAME,
      visitDate: new Date(date),
      lineItems: [{ label: `Phí khám ${specialty.name}`, amount: consultationFee, type: 'charge' }],
      depositAmount,
      depositPaymentMethod,
      depositPaidAt: now,
      estimatedRemaining: Math.max(consultationFee - depositAmount, 0),
      status: 'awaiting_visit',
    });

    await Notification.create({
      user: req.user._id,
      title: 'Đặt cọc đang chờ xác nhận',
      description: `Lễ tân đang xác nhận cọc ${depositAmount.toLocaleString('vi-VN')} VND cho lịch ${formatDateVN(date)} lúc ${time} với ${resolvedDoctorName}.`,
      type: 'appointment',
      isUnread: true,
      action: { label: 'Xem lịch hẹn', href: '/patient/lich-hen' },
    });

    return res.status(201).json({
      success: true,
      data: {
        referenceCode: code,
        submittedAt: now.toISOString(),
        depositAmount,
        depositPaymentMethod,
        depositPaidAt: now.toISOString(),
        consultationFee,
        status: 'pending_reception_deposit',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Payments ────────────────────────────────────────────
const getPayments = async (req, res) => {
  try {
    const invoices = await Invoice.find({ patientUser: req.user._id }).sort({ createdAt: -1 });
    const mapped = invoices.map(mapInvoice);

    const pending = mapped.filter((i) => i.status === 'pending_payment');
    const awaiting = mapped.filter((i) => i.status === 'awaiting_visit');
    const paid = mapped.filter((i) => i.status === 'paid');
    const totalUnpaid = pending.reduce((sum, i) => sum + i.totalDue, 0);
    const totalDepositHeld = awaiting.reduce((sum, i) => sum + i.depositAmount, 0);

    const stats = [
      {
        id: 'unpaid',
        label: 'Chưa thanh toán',
        value: pending.length,
        filter: 'unpaid',
        icon: 'receipt',
        iconBg: 'bg-[rgba(255,218,214,0.3)]',
        trend: totalUnpaid > 0 ? formatCurrencyVnd(totalUnpaid) : undefined,
        trendType: 'negative',
      },
      {
        id: 'awaiting',
        label: 'Đã cọc · Chờ khám',
        value: awaiting.length,
        filter: 'awaiting_visit',
        icon: 'calendar',
        iconBg: 'bg-[rgba(0,82,204,0.1)]',
        trend: totalDepositHeld > 0 ? formatCurrencyVnd(totalDepositHeld) : undefined,
        trendType: 'neutral',
      },
      {
        id: 'paid',
        label: 'Đã thanh toán',
        value: paid.length,
        filter: 'paid',
        icon: 'clock',
        iconBg: 'bg-[rgba(130,249,190,0.2)]',
        trendType: 'positive',
      },
      {
        id: 'all',
        label: 'Tổng hóa đơn',
        value: mapped.length,
        filter: 'all',
        icon: 'receipt',
        iconBg: 'bg-[#edeef0]',
        trendType: 'neutral',
      },
    ];

    return res.json({
      success: true,
      data: { invoices: mapped, stats, totalUnpaid, totalDepositHeld },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const payInvoice = async (req, res) => {
  try {
    const { method } = req.body;
    const invoice = await Invoice.findOne({ _id: req.params.invoiceId, patientUser: req.user._id });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn.' });
    }
    if (invoice.status === 'awaiting_visit') {
      return res.status(400).json({ success: false, message: 'Hóa đơn chưa thể thanh toán (đang chờ khám).' });
    }
    if (invoice.status === 'paid') {
      return res.json({ success: true, data: mapInvoice(invoice) });
    }

    invoice.status = 'paid';
    invoice.paidAt = new Date();
    if (['vnpay', 'momo', 'banking'].includes(method)) invoice.paymentMethod = method;
    await invoice.save();

    return res.json({ success: true, data: mapInvoice(invoice) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Health Records ──────────────────────────────────────
const getHealthRecords = async (req, res) => {
  try {
    const user = req.user;
    const [visitDocs, labDocs, historyDocs] = await Promise.all([
      Visit.find({ patientUser: user._id }).sort({ date: -1 }),
      LabResult.find({ patientUser: user._id }).sort({ date: -1 }),
      MedicalHistory.find({ patientUser: user._id }).sort({ createdAt: 1 }),
    ]);

    const visits = visitDocs.map(mapVisit);
    const labResults = labDocs.map(mapLab);
    const medicalHistory = historyDocs.map(mapHistory);

    const prescriptions = [];
    visitDocs.forEach((visit) => {
      (visit.prescriptions || []).forEach((p, index) => {
        prescriptions.push({
          id: `${visit._id.toString()}-rx-${index}`,
          name: p.name,
          dosage: p.dosage,
          prescribedDate: formatDateVN(visit.date),
          doctorName: visit.doctorName,
          visitId: visit._id.toString(),
          status: p.status,
          duration: p.duration,
        });
      });
    });

    const activePrescriptionCount = prescriptions.filter((p) => p.status === 'active').length;
    const attentionLabCount = labResults.filter(
      (l) => l.status === 'pending' || l.status === 'abnormal',
    ).length;
    const allergyCount = medicalHistory.filter((h) => h.type === 'allergy').length;

    const recordRaw = (user.id || user._id?.toString() || user.email || 'guest').toString();
    const recordCode = `HS-${recordRaw.replace(/\W/g, '').slice(-6).toUpperCase().padStart(6, '0')}`;

    const data = {
      recordCode,
      updatedAt: visits[0]?.date ?? formatDateVN(new Date()),
      stats: [
        {
          id: 'visits',
          label: 'Lần khám',
          value: visits.length,
          trend: 'Trong 12 tháng',
          trendType: 'neutral',
          icon: 'clock',
          iconBg: 'bg-[rgba(0,82,204,0.1)]',
          tab: 'visits',
        },
        {
          id: 'prescriptions',
          label: 'Đơn thuốc',
          value: activePrescriptionCount,
          trend: 'Đang dùng',
          trendType: 'positive',
          icon: 'calendar',
          iconBg: 'bg-[rgba(130,249,190,0.2)]',
          tab: 'prescriptions',
        },
        {
          id: 'labs',
          label: 'Xét nghiệm',
          value: labResults.length,
          trend: attentionLabCount > 0 ? `${attentionLabCount} cần xem` : undefined,
          trendType: attentionLabCount > 0 ? 'negative' : 'neutral',
          icon: 'flask',
          iconBg: 'bg-[rgba(176,35,0,0.1)]',
          tab: 'labs',
        },
        {
          id: 'allergies',
          label: 'Dị ứng',
          value: allergyCount,
          trend: allergyCount > 0 ? 'Cần lưu ý' : undefined,
          trendType: allergyCount > 0 ? 'negative' : 'neutral',
          icon: 'receipt',
          iconBg: 'bg-[rgba(255,218,214,0.2)]',
          tab: 'history',
        },
      ],
      patientSummary: {
        bloodType: user.bloodType || 'O+',
        height: user.height ? `${user.height} cm` : undefined,
        weight: user.weight ? `${user.weight} kg` : undefined,
        lastCheckup: visits[0]?.date,
      },
      visits,
      prescriptions,
      labResults,
      medicalHistory,
    };

    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Notifications ───────────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const docs = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    const notifications = docs.map(mapNotification);
    const unreadCount = notifications.filter((n) => n.isUnread).length;
    const countByType = (type) => notifications.filter((n) => n.type === type).length;

    const stats = [
      {
        id: 'unread',
        label: 'Chưa đọc',
        value: unreadCount,
        filter: 'unread',
        icon: 'bell',
        iconBg: 'bg-[rgba(255,218,214,0.3)]',
      },
      {
        id: 'appointment',
        label: 'Lịch hẹn',
        value: countByType('appointment'),
        filter: 'appointment',
        icon: 'calendar',
        iconBg: 'bg-[rgba(0,82,204,0.1)]',
      },
      {
        id: 'lab',
        label: 'Xét nghiệm',
        value: countByType('lab'),
        filter: 'lab',
        icon: 'flask',
        iconBg: 'bg-[rgba(176,35,0,0.1)]',
      },
      {
        id: 'payment',
        label: 'Thanh toán',
        value: countByType('payment'),
        filter: 'payment',
        icon: 'receipt',
        iconBg: 'bg-[rgba(130,249,190,0.2)]',
      },
    ];

    return res.json({ success: true, data: { notifications, stats, unreadCount } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markNotificationsRead = async (req, res) => {
  try {
    const { id, ids } = req.body || {};
    const filter = { user: req.user._id };
    if (id) {
      filter._id = id;
    } else if (Array.isArray(ids) && ids.length > 0) {
      filter._id = { $in: ids };
    }
    await Notification.updateMany(filter, { isUnread: false });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Reviews ─────────────────────────────────────────────
const getReviews = async (req, res) => {
  try {
    const [completedAppointments, patientInvoices, reviewDocs] = await Promise.all([
      Appointment.find({ patientUser: req.user._id, status: 'done' })
        .select('_id date time doctor department')
        .sort({ date: -1, time: -1 }),
      Invoice.find({ patientUser: req.user._id }).sort({ visitDate: -1, createdAt: -1 }),
      Review.find({ patientUser: req.user._id }).sort({ submittedAt: -1 }),
    ]);

    const reviewedInvoiceIds = new Set(
      reviewDocs.filter((r) => r.invoice).map((r) => r.invoice.toString()),
    );

    const invoiceByAppointmentId = new Map(
      patientInvoices
        .filter((inv) => inv.appointment)
        .map((inv) => [inv.appointment.toString(), inv]),
    );

    const pendingVisits = completedAppointments
      .map((appointment) => {
        const linkedInvoice = invoiceByAppointmentId.get(appointment._id.toString()) || null;
        if (!linkedInvoice) return null;
        if (reviewedInvoiceIds.has(linkedInvoice._id.toString())) return null;

        return {
          id: linkedInvoice._id.toString(),
          visitDate: formatDateVN(linkedInvoice.visitDate || appointment.date),
          doctorName: linkedInvoice.doctorName || appointment.doctor || 'Bác sĩ phụ trách',
          specialtyName: linkedInvoice.specialtyName || appointment.department || 'Chuyên khoa',
          facility: linkedInvoice.facility || FACILITY_NAME,
          invoiceCode: linkedInvoice.code,
        };
      })
      .filter(Boolean);

    const reviews = reviewDocs.map(mapReview);
    const averageRating =
      reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length) * 10) /
          10
        : 0;

    const stats = [
      {
        id: 'pending',
        label: 'Chờ đánh giá',
        value: pendingVisits.length,
        filter: 'pending',
        icon: 'calendar',
        iconBg: 'bg-[rgba(255,218,214,0.3)]',
        trend: pendingVisits.length > 0 ? 'Sau khám & thanh toán' : undefined,
        trendType: pendingVisits.length > 0 ? 'negative' : 'positive',
      },
      {
        id: 'submitted',
        label: 'Đã đánh giá',
        value: reviews.length,
        filter: 'submitted',
        icon: 'receipt',
        iconBg: 'bg-[rgba(130,249,190,0.2)]',
        trendType: 'positive',
      },
      {
        id: 'average',
        label: 'Điểm trung bình',
        value: reviews.length > 0 ? averageRating : '—',
        filter: 'submitted',
        icon: 'bell',
        iconBg: 'bg-[rgba(0,82,204,0.1)]',
        trend: reviews.length > 0 ? '/ 5 sao' : undefined,
        trendType: 'neutral',
      },
      {
        id: 'all',
        label: 'Tổng lượt khám',
        value: pendingVisits.length + reviews.length,
        filter: 'all',
        icon: 'clock',
        iconBg: 'bg-[#edeef0]',
        trendType: 'neutral',
      },
    ];

    return res.json({
      success: true,
      data: { pendingVisits, reviews, stats, pendingCount: pendingVisits.length, averageRating },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const submitReview = async (req, res) => {
  try {
    const { visitId, overallRating, doctorRating, facilityRating, comment, tags, isAnonymous } =
      req.body || {};

    if (!visitId || !overallRating) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đánh giá.' });
    }

    const invoice = await Invoice.findOne({ _id: visitId, patientUser: req.user._id }).catch(
      () => null,
    );
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lượt khám.' });
    }

    const existing = await Review.findOne({ invoice: invoice._id, patientUser: req.user._id });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Bạn đã đánh giá lượt khám này.' });
    }

    const review = await Review.create({
      patientUser: req.user._id,
      invoice: invoice._id,
      doctorName: invoice.doctorName,
      specialtyName: invoice.specialtyName,
      facility: invoice.facility || FACILITY_NAME,
      visitDate: invoice.visitDate,
      overallRating,
      doctorRating: doctorRating || overallRating,
      facilityRating: facilityRating || overallRating,
      comment: comment?.trim() || '',
      tags: Array.isArray(tags) ? tags : [],
      isAnonymous: Boolean(isAnonymous),
      submittedAt: new Date(),
    });

    return res.status(201).json({ success: true, data: mapReview(review) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Dashboard ───────────────────────────────────────────
const mapApptStatus = (status) => {
  if (status === 'checked-in') return 'arrived';
  if (status === 'done') return 'completed';
  if (status === 'cancelled') return 'cancelled';
  return 'waiting';
};

const buildExaminationSteps = (appointment) => {
  if (!appointment) return [];
  if (appointment.status === 'arrived') {
    return [
      { id: '1', title: 'Bạn đã check-in', subtitle: `${appointment.time} · Quầy tiếp nhận`, status: 'completed' },
      { id: '2', title: 'Đang chờ khám', subtitle: appointment.doctorName, status: 'active' },
      { id: '3', title: 'Nhận kết quả', subtitle: 'Sau khi bác sĩ kết luận', status: 'pending' },
    ];
  }
  if (appointment.status === 'waiting') {
    return [
      { id: '1', title: 'Sắp đến giờ khám', subtitle: `${appointment.time} · ${appointment.description}`, status: 'active' },
      { id: '2', title: 'Check-in tại quầy', subtitle: 'Đến trước 15 phút', status: 'pending' },
      { id: '3', title: 'Khám với bác sĩ', subtitle: appointment.doctorName, status: 'pending' },
    ];
  }
  return [];
};

const calculateBmi = (heightCm, weightKg) => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = bmi.toFixed(1);
  let label = 'Bình thường';
  let progress = 65;
  if (bmi < 18.5) {
    label = 'Thiếu cân';
    progress = 35;
  } else if (bmi >= 25 && bmi < 30) {
    label = 'Thừa cân';
    progress = 78;
  } else if (bmi >= 30) {
    label = 'Béo phì';
    progress = 90;
  }
  return { value: `${rounded} (${label})`, progress };
};

const buildHealthMetrics = (user) => {
  const metrics = [];
  if (user.height && user.weight) {
    const bmi = calculateBmi(user.height, user.weight);
    metrics.push({ label: 'Chỉ số BMI của bạn', value: bmi.value, progress: bmi.progress });
  }
  if (user.healthScore != null) {
    metrics.push({ label: 'Điểm sức khỏe', value: `${user.healthScore}/100`, progress: user.healthScore });
  }
  if (metrics.length === 0) {
    metrics.push(
      { label: 'Chỉ số BMI của bạn', value: '22.5 (Bình thường)', progress: 65 },
      { label: 'Huyết áp tham chiếu', value: '120/80 mmHg', progress: 80 },
    );
  } else if (metrics.length === 1) {
    metrics.push({ label: 'Huyết áp tham chiếu', value: '120/80 mmHg', progress: 80 });
  }
  return metrics;
};

const getDashboard = async (req, res) => {
  try {
    const user = req.user;
    const name = firstName(user.fullName);

    const todayAppt = await Appointment.findOne({
      patientUser: user._id,
      date: { $gte: startOfToday(), $lte: endOfToday() },
      status: { $in: ['pending', 'confirmed', 'checked-in'] },
    }).sort({ time: 1 });

    const todayAppointment = todayAppt
      ? {
          id: todayAppt._id.toString(),
          doctorName: todayAppt.doctor,
          description: todayAppt.service || 'Khám bệnh',
          time: todayAppt.time,
          status: mapApptStatus(todayAppt.status),
        }
      : null;

    const [visitsThisYear, labTotal, labNew, invoices, notifDocs] = await Promise.all([
      Visit.countDocuments({ patientUser: user._id, date: { $gte: startOfYear() } }),
      LabResult.countDocuments({ patientUser: user._id }),
      LabResult.countDocuments({
        patientUser: user._id,
        date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      Invoice.find({ patientUser: user._id }),
      Notification.find({ user: user._id }).sort({ createdAt: -1 }).limit(3),
    ]);

    const pendingInvoices = invoices.map(mapInvoice).filter((i) => i.status === 'pending_payment');
    const totalUnpaid = pendingInvoices.reduce((sum, i) => sum + i.totalDue, 0);

    const hasAppointment = !!todayAppointment;
    const labPart = labNew > 0 ? ` Bạn cũng có ${labNew} kết quả xét nghiệm mới cần xem.` : '';
    const summaryMessage = hasAppointment
      ? `${name}, hôm nay bạn có lịch ${todayAppointment.description.toLowerCase()} lúc ${todayAppointment.time} với ${todayAppointment.doctorName}.${labPart}`
      : `${name}, hôm nay bạn chưa có lịch khám. Hãy đặt lịch khi cần gặp bác sĩ.`;

    const dashboardNotifications = notifDocs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      timeAgo: timeAgo(doc.createdAt),
      type: doc.type === 'prescription' || doc.type === 'payment' ? 'system' : doc.type,
      isUnread: doc.isUnread,
    }));

    const activePrescriptions = [];
    const recentVisits = await Visit.find({ patientUser: user._id }).sort({ date: -1 }).limit(5);
    recentVisits.forEach((visit) => {
      (visit.prescriptions || []).forEach((p, index) => {
        if (p.status === 'active' && activePrescriptions.length < 3) {
          activePrescriptions.push({
            id: `${visit._id.toString()}-rx-${index}`,
            name: p.name,
            dosage: p.dosage,
          });
        }
      });
    });

    const data = {
      summaryMessage,
      stats: [
        {
          id: 'upcoming',
          label: 'Lịch khám hôm nay',
          value: hasAppointment ? 1 : 0,
          trend: hasAppointment ? todayAppointment.time : 'Trống lịch',
          trendType: hasAppointment ? 'neutral' : 'positive',
          icon: 'calendar',
          iconBg: 'bg-[rgba(0,82,204,0.1)]',
        },
        {
          id: 'visits',
          label: 'Lần khám của bạn',
          value: visitsThisYear,
          trend: 'Trong năm nay',
          trendType: 'positive',
          icon: 'clock',
          iconBg: 'bg-[rgba(130,249,190,0.2)]',
        },
        {
          id: 'lab',
          label: 'Kết quả xét nghiệm',
          value: labTotal,
          trend: labNew > 0 ? `${labNew} mới` : undefined,
          trendType: labNew > 0 ? 'negative' : 'neutral',
          icon: 'flask',
          iconBg: 'bg-[rgba(176,35,0,0.1)]',
        },
        {
          id: 'bills',
          label: 'Hóa đơn chưa thanh toán',
          value: pendingInvoices.length,
          trend: totalUnpaid > 0 ? formatCurrencyVnd(totalUnpaid).replace('₫', 'VND') : undefined,
          trendType: pendingInvoices.length > 0 ? 'negative' : 'positive',
          icon: 'receipt',
          iconBg: 'bg-[rgba(255,218,214,0.2)]',
        },
      ],
      todayAppointment,
      notifications: dashboardNotifications,
      prescriptions: activePrescriptions,
      examinationSteps: buildExaminationSteps(todayAppointment),
      healthMetrics: buildHealthMetrics(user),
    };

    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  listSpecialties,
  listDoctors,
  getDoctorAvailability,
  listAppointments,
  createAppointment,
  getPayments,
  payInvoice,
  getHealthRecords,
  getNotifications,
  markNotificationsRead,
  getReviews,
  submitReview,
  getDashboard,
};
