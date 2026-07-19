const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
const Review = require('../models/Review');
const Counter = require('../models/Counter');

// ─── Helpers ─────────────────────────────────────────────
const ok = (res, data) => res.json({ success: true, data });
const fail = (res, status, message) => res.status(status).json({ success: false, message });

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const formatDateVN = (date) =>
  date
    ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
        new Date(date),
      )
    : '';

const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(-2)
    .join('')
    .toUpperCase();

const compactCurrency = (value) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  return value.toLocaleString('vi-VN');
};

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

const genAppointmentCode = async () => {
  const seq = await Counter.next('appointment');
  return `#LH-${String(seq).padStart(4, '0')}`;
};

// Map trạng thái Appointment (DB) ↔ trạng thái Admin UI
const DB_TO_ADMIN_STATUS = {
  pending: 'pending',
  confirmed: 'confirmed',
  'checked-in': 'confirmed',
  done: 'completed',
  cancelled: 'cancelled',
};
const ADMIN_TO_DB_STATUS = {
  pending: 'pending',
  confirmed: 'confirmed',
  completed: 'done',
  cancelled: 'cancelled',
};

// Đếm lại số bác sĩ cho 1 chuyên khoa và lưu vào doctorCount
const recountSpecialty = async (specialtyId) => {
  if (!specialtyId) return;
  const count = await Doctor.countDocuments({ specialty: specialtyId });
  await Specialty.findByIdAndUpdate(specialtyId, { doctorCount: count });
};

// Tìm chuyên khoa theo tên (name hoặc departmentLabel)
const resolveSpecialty = async (label) => {
  if (!label) return null;
  const trimmed = String(label).trim();
  return Specialty.findOne({
    $or: [{ name: trimmed }, { departmentLabel: trimmed }],
  });
};

const buildDoctorAccountEmail = (name = '') => {
  const base = String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/(^\.|\.$)/g, '')
    .replace(/\.{2,}/g, '.');
  return `${base || 'doctor'}@medicare.local`;
};

const mapDoctor = (doc) => {
  const specialty = doc.specialty && doc.specialty.name ? doc.specialty : null;
  return {
    id: String(doc._id),
    fullName: doc.name,
    avatar: doc.user && doc.user.avatar ? doc.user.avatar : undefined,
    email: doc.user && doc.user.email ? doc.user.email : buildDoctorAccountEmail(doc.name),
    phone: doc.user && doc.user.phone ? doc.user.phone : '',
    userId: doc.user ? String(doc.user._id) : undefined,
    hasAccount: Boolean(doc.user),
    specialty: specialty ? specialty.name : '',
    experienceYears: doc.experienceYears || 0,
    status: doc.isAvailable ? 'working' : 'on_leave',
  };
};

const mapSpecialty = (doc, doctorCount) => ({
  id: String(doc._id),
  name: doc.departmentLabel || doc.name,
  description: doc.description || '',
  doctorCount: typeof doctorCount === 'number' ? doctorCount : doc.doctorCount || 0,
  color: doc.color || 'from-blue-500 to-blue-700',
});

const mapAppointment = (doc) => ({
  id: doc.code,
  patientName: doc.patientName,
  patientPhone: doc.phone || '',
  patientInitials: initialsOf(doc.patientName),
  doctorName: doc.doctor,
  doctorDept: doc.department,
  date: formatDateVN(doc.date),
  timeRange: doc.time,
  status: DB_TO_ADMIN_STATUS[doc.status] || 'pending',
});

const mapUser = (doc) => ({
  id: String(doc._id),
  fullName: doc.fullName,
  email: doc.email,
  phone: doc.phone || '',
  avatar: doc.avatar || undefined,
  role: doc.role,
  status: doc.isActive ? 'active' : 'suspended',
  createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
  lastActiveAt: (doc.lastLogin || doc.updatedAt || doc.createdAt || new Date()),
});

const actorColorByRole = (role) => {
  if (role === 'admin') return 'bg-emerald-500';
  if (role === 'doctor') return 'bg-blue-500';
  if (role === 'receptionist') return 'bg-violet-500';
  return 'bg-slate-500';
};

const actorRoleLabel = (role) => {
  if (role === 'admin') return 'Quản trị hệ thống';
  if (role === 'doctor') return 'Bác sĩ';
  if (role === 'receptionist') return 'Lễ tân';
  return 'Hệ thống';
};

const timeAgo = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
};

const formatAuditTime = (date) =>
  new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));

const startOfDay = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const startOfWeek = (date) => {
  const next = startOfDay(date);
  const day = next.getDay();
  const diff = day === 0 ? 6 : day - 1;
  next.setDate(next.getDate() - diff);
  return next;
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const withinTimeframe = (date, timeframe) => {
  const createdAt = new Date(date);
  const now = new Date();
  if (timeframe === 'today') return createdAt >= startOfDay(now);
  if (timeframe === 'week') return createdAt >= startOfWeek(now);
  if (timeframe === 'month') return createdAt >= startOfMonth(now);
  return true;
};

const buildAuditEntry = ({
  id,
  createdAt,
  actorName,
  actorRole,
  action,
  actionType,
  target,
  ip = 'localhost',
}) => ({
  id,
  time: formatAuditTime(createdAt),
  timeAgo: timeAgo(createdAt),
  actorName,
  actorRole,
  actorInitials: initialsOf(actorName || 'HT'),
  actorColor: actorColorByRole(
    actorRole === 'Quản trị hệ thống'
      ? 'admin'
      : actorRole === 'Bác sĩ'
        ? 'doctor'
        : actorRole === 'Lễ tân'
          ? 'receptionist'
          : 'system',
  ),
  action,
  actionType,
  target,
  ip,
  createdAt: new Date(createdAt).toISOString(),
});

const formatReviewDate = (date) =>
  date
    ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
        new Date(date),
      )
    : '';

const buildPatientCode = (userId) => {
  const raw = String(userId || '').replace(/[^a-fA-F0-9]/g, '').slice(-6).toUpperCase();
  return raw ? `BN-${raw}` : 'BN-UNKNOWN';
};

const containsModerationWarning = (comment = '') => /\[cảnh báo|vi phạm|không phù hợp/i.test(comment);

const mapReviewAdmin = (doc) => ({
  id: String(doc._id),
  patientName: doc.isAnonymous ? 'Ẩn danh' : (doc.patientUser?.fullName || 'Bệnh nhân'),
  patientCode: buildPatientCode(doc.patientUser?._id || doc.patientUser),
  anonymous: Boolean(doc.isAnonymous),
  doctorName: doc.doctorName || 'Chưa cập nhật',
  department: doc.specialtyName || 'Chưa cập nhật',
  rating: doc.overallRating || 0,
  content: doc.comment || 'Không có nội dung đánh giá.',
  date: formatReviewDate(doc.submittedAt || doc.visitDate || doc.createdAt),
  flagged: containsModerationWarning(doc.comment || ''),
  status: doc.status === 'hidden' ? 'hidden' : 'visible',
});

// ─── Dashboard ───────────────────────────────────────────
const getDashboard = async (req, res, next) => {
  try {
    const [patients, doctors, appointments, specialties] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      Specialty.countDocuments(),
    ]);

    const newUsersToday = await User.countDocuments({
      role: 'patient',
      createdAt: { $gte: startOfToday(), $lte: endOfToday() },
    });

    // Doanh thu: cọc đã thanh toán + phần còn lại của hóa đơn đã tất toán
    const invoices = await Invoice.find().select('depositAmount depositPaidAt estimatedRemaining status');
    const revenue = invoices.reduce((sum, inv) => {
      let total = 0;
      if (inv.depositPaidAt) total += inv.depositAmount || 0;
      if (inv.status === 'paid') total += inv.estimatedRemaining || 0;
      return sum + total;
    }, 0);

    // Phòng khám: số phòng khác nhau xuất hiện trong lịch hẹn
    const roomValues = await Appointment.distinct('room', { room: { $nin: ['', null] } });

    // Xu hướng 6 tháng gần nhất
    const monthsBack = 6;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);
    const trendAgg = await Appointment.aggregate([
      { $match: { date: { $gte: start } } },
      {
        $group: {
          _id: { y: { $year: '$date' }, m: { $month: '$date' } },
          appointments: { $sum: 1 },
          patients: { $addToSet: '$patientName' },
        },
      },
    ]);
    const trendMap = new Map();
    trendAgg.forEach((row) => {
      trendMap.set(`${row._id.y}-${row._id.m}`, {
        appointments: row.appointments,
        patients: row.patients.length,
      });
    });
    const monthlyTrend = [];
    for (let i = monthsBack - 1; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const entry = trendMap.get(key) || { appointments: 0, patients: 0 };
      monthlyTrend.push({ month: `Th${d.getMonth() + 1}`, ...entry });
    }

    // Top khoa theo doanh thu (consultationFee tích lũy)
    const topAgg = await Appointment.aggregate([
      { $group: { _id: '$department', revenue: { $sum: '$consultationFee' }, count: { $sum: 1 } } },
      { $sort: { revenue: -1, count: -1 } },
      { $limit: 5 },
    ]);
    const topDepartments = topAgg.map((row, index) => ({
      id: `dept-${index}`,
      rank: index + 1,
      name: row._id || 'Khác',
      revenue: row.revenue || 0,
      revenueLabel:
        row.revenue > 0 ? `${compactCurrency(row.revenue)}đ` : `${row.count} lịch`,
    }));

    // Lịch hẹn mới nhất
    const recent = await Appointment.find().sort({ createdAt: -1 }).limit(5);
    const newAppointments = recent.map((doc) => ({
      id: doc.code,
      patientName: doc.patientName,
      service: doc.service || doc.department,
      time: doc.time,
      status: ['confirmed', 'checked-in', 'done'].includes(doc.status) ? 'confirmed' : 'pending',
    }));

    return ok(res, {
      stats: {
        patients,
        doctors,
        appointments,
        specialties,
        rooms: roomValues.length,
        revenue,
        revenueLabel: compactCurrency(revenue),
      },
      newUsersToday,
      monthlyTrend,
      topDepartments,
      newAppointments,
    });
  } catch (error) {
    return next(error);
  }
};

// ─── Doctors CRUD ────────────────────────────────────────
const listDoctors = async (req, res, next) => {
  try {
    const docs = await Doctor.find()
      .populate('specialty', 'name departmentLabel')
      .populate('user', 'avatar email phone')
      .sort({ createdAt: -1 });
    return ok(res, docs.map(mapDoctor));
  } catch (error) {
    return next(error);
  }
};

const createDoctor = async (req, res, next) => {
  try {
    const { fullName, specialty, experienceYears, status, email, phone } = req.body;
    if (!fullName || !fullName.trim()) return fail(res, 400, 'Vui lòng nhập họ tên bác sĩ.');
    const spec = await resolveSpecialty(specialty);
    if (!spec) return fail(res, 400, 'Chuyên khoa không tồn tại.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(res, 400, 'Vui lòng nhập email hợp lệ cho tài khoản bác sĩ.');
    }
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return fail(res, 400, 'Email tài khoản bác sĩ đã tồn tại.');

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone || '',
      role: 'doctor',
      occupation: spec.departmentLabel || spec.name,
      isActive: status !== 'on_leave',
      password: 'Medicare@123',
      isEmailVerified: true,
    });

    const doc = await Doctor.create({
      name: fullName.trim(),
      specialty: spec._id,
      specialtySlug: spec.slug,
      experienceYears: Number(experienceYears) || 0,
      isAvailable: status !== 'on_leave',
      user: user._id,
    });
    await recountSpecialty(spec._id);
    const populated = await Doctor.findById(doc._id)
      .populate('specialty', 'name departmentLabel')
      .populate('user', 'avatar email phone');
    return ok(res, mapDoctor(populated));
  } catch (error) {
    return next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return fail(res, 400, 'ID bác sĩ không hợp lệ.');
    const doc = await Doctor.findById(id);
    if (!doc) return fail(res, 404, 'Không tìm thấy bác sĩ.');

    const { fullName, specialty, experienceYears, status, email, phone } = req.body;
    const prevSpecialty = doc.specialty;

    if (fullName && fullName.trim()) doc.name = fullName.trim();
    if (typeof experienceYears !== 'undefined') doc.experienceYears = Number(experienceYears) || 0;
    if (typeof status !== 'undefined') doc.isAvailable = status !== 'on_leave';
    if (specialty) {
      const spec = await resolveSpecialty(specialty);
      if (!spec) return fail(res, 400, 'Chuyên khoa không tồn tại.');
      doc.specialty = spec._id;
      doc.specialtySlug = spec.slug;
    }
    await doc.save();

    if (doc.user) {
      const linkedUser = await User.findById(doc.user);
      if (linkedUser) {
        if (fullName && fullName.trim()) linkedUser.fullName = fullName.trim();
        if (typeof phone !== 'undefined') linkedUser.phone = phone || '';
        if (typeof email !== 'undefined' && email.trim()) {
          const normalizedEmail = email.toLowerCase().trim();
          const existingUser = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: linkedUser._id },
          });
          if (existingUser) return fail(res, 400, 'Email tài khoản bác sĩ đã tồn tại.');
          linkedUser.email = normalizedEmail;
        }
        if (typeof status !== 'undefined') linkedUser.isActive = status !== 'on_leave';
        if (specialty) {
          const nextSpec = await Specialty.findById(doc.specialty).select('name departmentLabel');
          linkedUser.occupation = nextSpec ? (nextSpec.departmentLabel || nextSpec.name) : linkedUser.occupation;
        }
        await linkedUser.save();
      }
    } else if ((typeof email !== 'undefined' && email.trim()) || (typeof phone !== 'undefined' && phone.trim())) {
      const normalizedEmail = (email && email.trim())
        ? email.toLowerCase().trim()
        : buildDoctorAccountEmail(fullName || doc.name);
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) return fail(res, 400, 'Email tài khoản bác sĩ đã tồn tại.');
      const nextSpec = await Specialty.findById(doc.specialty).select('name departmentLabel');
      const linkedUser = await User.create({
        fullName: (fullName && fullName.trim()) || doc.name,
        email: normalizedEmail,
        phone: phone || '',
        role: 'doctor',
        occupation: nextSpec ? (nextSpec.departmentLabel || nextSpec.name) : '',
        isActive: status !== 'on_leave',
        password: 'Medicare@123',
        isEmailVerified: true,
      });
      doc.user = linkedUser._id;
      await doc.save();
    }

    if (specialty && String(prevSpecialty) !== String(doc.specialty)) {
      await recountSpecialty(prevSpecialty);
      await recountSpecialty(doc.specialty);
    }
    const populated = await Doctor.findById(doc._id)
      .populate('specialty', 'name departmentLabel')
      .populate('user', 'avatar email phone');
    return ok(res, mapDoctor(populated));
  } catch (error) {
    return next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return fail(res, 400, 'ID bác sĩ không hợp lệ.');
    const doc = await Doctor.findByIdAndDelete(id);
    if (!doc) return fail(res, 404, 'Không tìm thấy bác sĩ.');
    await recountSpecialty(doc.specialty);
    return ok(res, { id });
  } catch (error) {
    return next(error);
  }
};

const syncDoctorAccounts = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate('specialty', 'name departmentLabel');
    const items = [];

    for (const doc of doctors) {
      const targetEmail = buildDoctorAccountEmail(doc.name);
      let linkedUser = doc.user ? await User.findById(doc.user) : null;

      if (!linkedUser) {
        linkedUser = await User.findOne({ email: targetEmail });
      }

      if (!linkedUser) {
        linkedUser = await User.create({
          fullName: doc.name,
          email: targetEmail,
          phone: '',
          role: 'doctor',
          occupation: doc.specialty ? (doc.specialty.departmentLabel || doc.specialty.name) : '',
          isActive: doc.isAvailable !== false,
          password: 'Medicare@123',
          isEmailVerified: true,
        });
      } else {
        linkedUser.fullName = doc.name;
        linkedUser.role = 'doctor';
        linkedUser.occupation = doc.specialty ? (doc.specialty.departmentLabel || doc.specialty.name) : linkedUser.occupation;
        linkedUser.isActive = doc.isAvailable !== false;
        if (linkedUser.email !== targetEmail) {
          const conflict = await User.findOne({ email: targetEmail, _id: { $ne: linkedUser._id } });
          if (!conflict) linkedUser.email = targetEmail;
        }
        await linkedUser.save();
      }

      if (!doc.user || String(doc.user) !== String(linkedUser._id)) {
        doc.user = linkedUser._id;
        await doc.save();
      }

      items.push({
        doctorId: String(doc._id),
        doctorName: doc.name,
        userId: String(linkedUser._id),
        email: linkedUser.email,
      });
    }

    return ok(res, { total: items.length, items });
  } catch (error) {
    return next(error);
  }
};

// ─── Specialties CRUD ────────────────────────────────────
const listSpecialties = async (req, res, next) => {
  try {
    const specs = await Specialty.find().sort({ order: 1, createdAt: 1 });
    const counts = await Doctor.aggregate([
      { $group: { _id: '$specialty', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
    return ok(res, specs.map((doc) => mapSpecialty(doc, countMap.get(String(doc._id)) || 0)));
  } catch (error) {
    return next(error);
  }
};

const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const createSpecialty = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;
    if (!name || !name.trim()) return fail(res, 400, 'Vui lòng nhập tên khoa.');
    const baseSlug = slugify(name) || 'khoa';
    let slug = baseSlug;
    let i = 1;
    // eslint-disable-next-line no-await-in-loop
    while (await Specialty.findOne({ slug })) {
      slug = `${baseSlug}-${i}`;
      i += 1;
    }
    const last = await Specialty.findOne().sort({ order: -1 });
    const doc = await Specialty.create({
      slug,
      name: name.trim(),
      departmentLabel: name.trim(),
      description: description || '',
      color: color || 'from-blue-500 to-blue-700',
      consultationFee: 300_000,
      order: (last?.order || 0) + 1,
    });
    return ok(res, mapSpecialty(doc, 0));
  } catch (error) {
    return next(error);
  }
};

const updateSpecialty = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return fail(res, 400, 'ID khoa không hợp lệ.');
    const doc = await Specialty.findById(id);
    if (!doc) return fail(res, 404, 'Không tìm thấy khoa.');

    const { name, description, color } = req.body;
    if (name && name.trim()) {
      doc.departmentLabel = name.trim();
      doc.name = name.trim();
    }
    if (typeof description !== 'undefined') doc.description = description;
    if (typeof color !== 'undefined') doc.color = color;
    await doc.save();

    const count = await Doctor.countDocuments({ specialty: doc._id });
    return ok(res, mapSpecialty(doc, count));
  } catch (error) {
    return next(error);
  }
};

const deleteSpecialty = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return fail(res, 400, 'ID khoa không hợp lệ.');
    const count = await Doctor.countDocuments({ specialty: id });
    if (count > 0) {
      return fail(res, 400, `Không thể xóa: còn ${count} bác sĩ thuộc khoa này.`);
    }
    const doc = await Specialty.findByIdAndDelete(id);
    if (!doc) return fail(res, 404, 'Không tìm thấy khoa.');
    return ok(res, { id });
  } catch (error) {
    return next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const [patients, appointments, invoices] = await Promise.all([
      User.find({ role: 'patient' }).select('createdAt').lean(),
      Appointment.find().select('date department status').lean(),
      Invoice.find().select('depositAmount depositPaidAt estimatedRemaining status').lean(),
    ]);

    const revenue = invoices.reduce((sum, inv) => {
      let total = 0;
      if (inv.depositPaidAt) total += inv.depositAmount || 0;
      if (inv.status === 'paid') total += inv.estimatedRemaining || 0;
      return sum + total;
    }, 0);

    const activeAppointments = appointments.filter((item) => item.status !== 'cancelled');
    const completedAppointments = appointments.filter((item) => item.status === 'done').length;
    const completionRate = activeAppointments.length
      ? Math.round((completedAppointments / activeAppointments.length) * 1000) / 10
      : 0;

    const now = new Date();
    const patientTrend = [];
    for (let offset = 5; offset >= 0; offset -= 1) {
      const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 1);
      const count = patients.filter((patient) => {
        const createdAt = new Date(patient.createdAt);
        return createdAt >= start && createdAt < end;
      }).length;
      patientTrend.push({
        month: `Th${start.getMonth() + 1}`,
        value: count,
      });
    }

    const departmentCounts = appointments.reduce((acc, appointment) => {
      const key = appointment.department || 'Khác';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const totalDepartmentAppointments = Object.values(departmentCounts).reduce((sum, count) => sum + count, 0) || 1;
    const palette = ['#1a56db', '#10b981', '#f59e0b', '#cbd5e1', '#8b5cf6', '#ef4444'];
    const specialtyShare = Object.entries(departmentCounts).map(([name, count], index) => ({
      id: `dept-${index + 1}`,
      name,
      percent: Math.round((count / totalDepartmentAppointments) * 100),
      color: palette[index % palette.length],
    }));

    return ok(res, {
      stats: {
        patients: patients.length,
        revenue,
        suppliesUsed: 0,
        completionRate,
      },
      patientTrend,
      specialtyShare,
      specialtyTotal: appointments.length,
      supplies: [],
      suppliesTotal: 0,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const [users, appointments, invoices, reviews] = await Promise.all([
      User.find().select('fullName role createdAt updatedAt').lean(),
      Appointment.find().select('code patientName doctor department source createdAt updatedAt').lean(),
      Invoice.find().select('code patientUser doctorName specialtyName status createdAt updatedAt').populate('patientUser', 'fullName role').lean(),
      Review.find().select('doctorName specialtyName patientUser createdAt updatedAt').populate('patientUser', 'fullName role').lean(),
    ]);

    const logs = [
      ...users.map((user) =>
        buildAuditEntry({
          id: `user-${user._id}`,
          createdAt: user.createdAt,
          actorName: user.fullName,
          actorRole: actorRoleLabel(user.role),
          action: 'TẠO TÀI KHOẢN',
          actionType: 'create',
          target: `${actorRoleLabel(user.role)}: ${user.fullName}`,
        }),
      ),
      ...appointments.map((appointment) =>
        buildAuditEntry({
          id: `appointment-${appointment._id}`,
          createdAt: appointment.createdAt,
          actorName: appointment.source === 'patient' ? appointment.patientName : 'Lễ tân hệ thống',
          actorRole: appointment.source === 'patient' ? 'Bệnh nhân' : 'Lễ tân',
          action: 'ĐẶT LỊCH KHÁM',
          actionType: 'booking',
          target: `${appointment.code} - ${appointment.patientName} / ${appointment.department}`,
        }),
      ),
      ...invoices.map((invoice) =>
        buildAuditEntry({
          id: `invoice-${invoice._id}`,
          createdAt: invoice.createdAt,
          actorName: invoice.patientUser?.fullName || 'Hệ thống thanh toán',
          actorRole: invoice.patientUser?.role ? actorRoleLabel(invoice.patientUser.role) : 'Hệ thống',
          action: 'THANH TOÁN',
          actionType: 'payment',
          target: `${invoice.code} - ${invoice.specialtyName}`,
        }),
      ),
      ...reviews.map((review) =>
        buildAuditEntry({
          id: `review-${review._id}`,
          createdAt: review.createdAt,
          actorName: review.patientUser?.fullName || 'Bệnh nhân',
          actorRole: review.patientUser?.role ? actorRoleLabel(review.patientUser.role) : 'Bệnh nhân',
          action: 'CẬP NHẬT THÔNG TIN',
          actionType: 'update',
          target: `Đánh giá cho ${review.doctorName} / ${review.specialtyName}`,
        }),
      ),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const summary = {
      newAccounts: logs.filter((log) => log.actionType === 'create').length,
      bookings: logs.filter((log) => log.actionType === 'booking').length,
      payments: logs.filter((log) => log.actionType === 'payment').length,
      updates: logs.filter((log) => log.actionType === 'update').length,
    };

    return ok(res, {
      items: logs,
      total: logs.length,
      actors: Array.from(new Set(logs.map((log) => log.actorName))),
      summary,
    });
  } catch (error) {
    return next(error);
  }
};

// ───────────────── Reviews ─────────────────
const listReviews = async (req, res, next) => {
  try {
    const docs = await Review.find()
      .populate('patientUser', 'fullName')
      .sort({ submittedAt: -1, createdAt: -1 });

    const items = docs.map(mapReviewAdmin);
    const total = items.length;
    const averageRating =
      total > 0
        ? Math.round((items.reduce((sum, item) => sum + item.rating, 0) / total) * 10) / 10
        : 0;
    const hiddenCount = items.filter((item) => item.status === 'hidden' || item.flagged).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthCount = docs.filter((doc) => {
      const date = new Date(doc.submittedAt || doc.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    const previousMonthDate = new Date();
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    const previousMonth = previousMonthDate.getMonth();
    const previousMonthYear = previousMonthDate.getFullYear();
    const previousMonthCount = docs.filter((doc) => {
      const date = new Date(doc.submittedAt || doc.createdAt);
      return date.getMonth() === previousMonth && date.getFullYear() === previousMonthYear;
    }).length;

    const monthlyDelta =
      previousMonthCount === 0
        ? (thisMonthCount > 0 ? '+100%' : '0%')
        : `${thisMonthCount >= previousMonthCount ? '+' : ''}${Math.round(
            ((thisMonthCount - previousMonthCount) / previousMonthCount) * 100,
          )}%`;

    return ok(res, {
      items,
      total,
      departments: Array.from(new Set(items.map((item) => item.department).filter(Boolean))),
      stats: {
        total,
        averageRating,
        hiddenCount,
        monthlyDelta,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!isValidId(id)) return fail(res, 400, 'ID đánh giá không hợp lệ.');
    if (!['visible', 'hidden'].includes(status)) return fail(res, 400, 'Trạng thái đánh giá không hợp lệ.');

    const doc = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).populate('patientUser', 'fullName');

    if (!doc) return fail(res, 404, 'Không tìm thấy đánh giá.');
    return ok(res, mapReviewAdmin(doc));
  } catch (error) {
    return next(error);
  }
};

// ─── Appointments ────────────────────────────────────────
const listAppointments = async (req, res, next) => {
  try {
    const docs = await Appointment.find().sort({ date: -1, createdAt: -1 });
    const items = docs.map(mapAppointment);

    const todayStart = startOfToday();
    const todayEnd = endOfToday();
    const stats = {
      today: docs.filter((d) => d.date >= todayStart && d.date <= todayEnd).length,
      pending: items.filter((i) => i.status === 'pending').length,
      confirmed: items.filter((i) => i.status === 'confirmed').length,
      completed: items.filter((i) => i.status === 'completed').length,
      cancelled: items.filter((i) => i.status === 'cancelled').length,
    };
    return ok(res, { items, stats, total: items.length });
  } catch (error) {
    return next(error);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { status } = req.body;
    const dbStatus = ADMIN_TO_DB_STATUS[status];
    if (!dbStatus) return fail(res, 400, 'Trạng thái không hợp lệ.');
    const doc = await Appointment.findOneAndUpdate(
      { code },
      { status: dbStatus },
      { new: true },
    );
    if (!doc) return fail(res, 404, 'Không tìm thấy lịch hẹn.');
    return ok(res, mapAppointment(doc));
  } catch (error) {
    return next(error);
  }
};

const createAppointment = async (req, res, next) => {
  try {
    const { patientName, patientPhone, doctorName, doctorDept, date, timeRange, status } = req.body;
    if (!patientName || !patientName.trim()) return fail(res, 400, 'Vui lòng nhập tên bệnh nhân.');
    if (!doctorName || !doctorName.trim()) return fail(res, 400, 'Vui lòng nhập tên bác sĩ.');
    if (!date || !timeRange) return fail(res, 400, 'Vui lòng nhập ngày và khung giờ.');

    const code = await genAppointmentCode();
    const doc = await Appointment.create({
      code,
      patientName: patientName.trim(),
      phone: patientPhone || '',
      doctor: doctorName.trim(),
      department: doctorDept || 'Khám tổng quát',
      date: new Date(date),
      time: timeRange,
      status: ADMIN_TO_DB_STATUS[status] || 'pending',
      source: 'reception',
    });
    return ok(res, mapAppointment(doc));
  } catch (error) {
    return next(error);
  }
};

// ─── Users ───────────────────────────────────────────────
const listUsers = async (req, res, next) => {
  try {
    const docs = await User.find().sort({ createdAt: -1 });
    return ok(res, docs.map(mapUser));
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { fullName, email, phone, role, status } = req.body;
    if (!fullName || !fullName.trim()) return fail(res, 400, 'Vui lòng nhập họ tên.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(res, 400, 'Email không hợp lệ.');
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return fail(res, 400, 'Email đã tồn tại.');

    const doc = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      phone: phone || '',
      role: ['patient', 'doctor', 'receptionist', 'admin'].includes(role) ? role : 'patient',
      isActive: status !== 'suspended',
      password: 'Medicare@123',
      isEmailVerified: true,
    });
    return ok(res, mapUser(doc));
  } catch (error) {
    return next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return fail(res, 400, 'ID người dùng không hợp lệ.');
    const { status } = req.body;
    const doc = await User.findByIdAndUpdate(
      id,
      { isActive: status === 'active' },
      { new: true },
    );
    if (!doc) return fail(res, 404, 'Không tìm thấy người dùng.');
    return ok(res, mapUser(doc));
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return fail(res, 400, 'ID người dùng không hợp lệ.');
    if (String(req.user._id) === String(id)) {
      return fail(res, 400, 'Không thể xóa chính tài khoản đang đăng nhập.');
    }
    const doc = await User.findByIdAndDelete(id);
    if (!doc) return fail(res, 404, 'Không tìm thấy người dùng.');
    return ok(res, { id });
  } catch (error) {
    return next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return fail(res, 400, 'ID người dùng không hợp lệ.');
    const { role } = req.body;
    const allowed = ['patient', 'doctor', 'receptionist'];
    if (!allowed.includes(role)) return fail(res, 400, 'Vai trò không hợp lệ.');
    if (String(req.user._id) === String(id)) {
      return fail(res, 400, 'Không thể thay đổi vai trò của chính mình.');
    }
    const doc = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!doc) return fail(res, 404, 'Không tìm thấy người dùng.');
    return ok(res, mapUser(doc));
  } catch (error) {
    return next(error);
  }
};

const syncAllAccounts = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate('specialty', 'name departmentLabel');
    let doctorAccountsSynced = 0;

    for (const doc of doctors) {
      const targetEmail = buildDoctorAccountEmail(doc.name);
      let linkedUser = doc.user ? await User.findById(doc.user) : null;

      if (!linkedUser) linkedUser = await User.findOne({ email: targetEmail });

      if (!linkedUser) {
        linkedUser = await User.create({
          fullName: doc.name,
          email: targetEmail,
          phone: '',
          role: 'doctor',
          occupation: doc.specialty ? (doc.specialty.departmentLabel || doc.specialty.name) : '',
          isActive: doc.isAvailable !== false,
          password: 'Medicare@123',
          isEmailVerified: true,
        });
      } else {
        linkedUser.fullName = String(linkedUser.fullName || doc.name).trim();
        linkedUser.email = String(linkedUser.email || targetEmail).trim().toLowerCase();
        linkedUser.phone = String(linkedUser.phone || '').trim();
        linkedUser.role = 'doctor';
        linkedUser.occupation = doc.specialty ? (doc.specialty.departmentLabel || doc.specialty.name) : linkedUser.occupation;
        linkedUser.isActive = doc.isAvailable !== false;
        await linkedUser.save();
      }

      if (!doc.user || String(doc.user) !== String(linkedUser._id)) {
        doc.user = linkedUser._id;
        await doc.save();
      }

      doctorAccountsSynced += 1;
    }

    const users = await User.find();
    for (const user of users) {
      user.fullName = String(user.fullName || '').trim();
      user.email = String(user.email || '').trim().toLowerCase();
      user.phone = String(user.phone || '').trim();
      if (!['patient', 'doctor', 'receptionist', 'admin'].includes(user.role)) {
        user.role = 'patient';
      }
      await user.save();
    }

    const refreshed = await User.find().select('role');
    const counts = refreshed.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    return ok(res, {
      usersSynced: refreshed.length,
      doctorAccountsSynced,
      counts,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDashboard,
  getReports,
  getAuditLogs,
  listDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  syncDoctorAccounts,
  listSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
  listReviews,
  updateReviewStatus,
  listAppointments,
  updateAppointmentStatus,
  createAppointment,
  listUsers,
  createUser,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  syncAllAccounts,
};
