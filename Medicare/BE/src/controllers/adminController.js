const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
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
  listDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  syncDoctorAccounts,
  listSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
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
