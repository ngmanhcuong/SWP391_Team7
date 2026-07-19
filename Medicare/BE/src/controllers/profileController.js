const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Appointment = require('../models/Appointment');
const QueueTicket = require('../models/QueueTicket');
const Invoice = require('../models/Invoice');
const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');

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

const toISO = (value) => {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

const timeAgo = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Vừa xong';
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return new Intl.DateTimeFormat('vi-VN').format(date);
};

const mapNotification = (doc) => ({
  id: doc._id.toString(),
  title: doc.title,
  description: doc.description || '',
  timeAgo: timeAgo(doc.createdAt),
  createdAt: toISO(doc.createdAt),
  type: doc.type,
  isUnread: Boolean(doc.isUnread),
  action: doc.action?.label ? { label: doc.action.label, href: doc.action.href } : undefined,
});

const buildDoctorNotifications = async (userId) => {
  const doctor = await Doctor.findOne({ user: userId }).lean();
  if (!doctor) return [];

  const todayFilter = { date: { $gte: startOfToday(), $lte: endOfToday() }, doctorRef: doctor._id };
  const appointments = await Appointment.find(todayFilter)
    .sort({ date: 1, time: 1 })
    .select('patient patientName department time status createdAt');

  const actionable = appointments.filter((appt) => ['pending', 'confirmed', 'checked-in'].includes(appt.status));
  const completed = appointments.filter((appt) => appt.status === 'done').length;
  const notifications = [];

  if (actionable[0]) {
    const nextAppointment = actionable[0];
    const appointmentHref = nextAppointment.patient
      ? `/doctor/benh-an/${nextAppointment.patient.toString()}?appointmentId=${nextAppointment._id.toString()}`
      : '/doctor/lich-kham';
    notifications.push({
      sourceKey: `doctor-next-${nextAppointment._id.toString()}`,
      title: 'Bệnh nhân chờ khám tiếp theo',
      description: `${nextAppointment.patientName} - ${nextAppointment.time} - ${nextAppointment.department}`,
      type: 'appointment',
      action: { label: 'Mở hồ sơ', href: appointmentHref },
      createdAt: nextAppointment.createdAt || new Date(),
    });
  }

  if (actionable.length > 1) {
    notifications.push({
      sourceKey: `doctor-queue-${doctor._id.toString()}-${startOfToday().toISOString().slice(0, 10)}`,
      title: `${actionable.length} ca khám cần xử lý hôm nay`,
      description: 'Ưu tiên hoàn tất ca hiện tại trước khi chuyển sang bệnh nhân tiếp theo.',
      type: 'queue',
      action: { label: 'Xem lịch khám', href: '/doctor/lich-kham' },
      createdAt: actionable[0].createdAt || new Date(),
    });
  }

  if (completed > 0) {
    notifications.push({
      sourceKey: `doctor-completed-${doctor._id.toString()}-${startOfToday().toISOString().slice(0, 10)}`,
      title: `${completed} ca đã hoàn tất hôm nay`,
      description: `Lịch khám của bác sĩ ${doctor.name} đang được đồng bộ đúng với hồ sơ bệnh án.`,
      type: 'system',
      action: { label: 'Xem danh sách', href: '/doctor/benh-nhan' },
      createdAt: new Date(),
    });
  }

  return notifications;
};

const buildReceptionistNotifications = async () => {
  const today = { $gte: startOfToday(), $lte: endOfToday() };
  const [appointments, waitingQueue, unpaidInvoices] = await Promise.all([
    Appointment.find({ date: today })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('patientName department time status createdAt code'),
    QueueTicket.countDocuments({ status: { $in: ['waiting', 'skipped', 'in-progress'] } }),
    Invoice.countDocuments({ status: { $in: ['awaiting_visit', 'pending_payment'] } }),
  ]);

  const confirmedCount = appointments.filter((appt) => ['pending', 'confirmed', 'checked-in'].includes(appt.status)).length;
  const latestAppointment = appointments.find((appt) => ['pending', 'confirmed', 'checked-in'].includes(appt.status));
  const notifications = [];

  if (latestAppointment) {
    notifications.push({
      sourceKey: `reception-appointment-${latestAppointment._id.toString()}`,
      title: 'Lịch hẹn cần tiếp nhận',
      description: `${latestAppointment.patientName} - ${latestAppointment.time} - ${latestAppointment.department}`,
      type: 'appointment',
      action: { label: 'Xem lịch hẹn', href: '/receptionist/lich-hen' },
      createdAt: latestAppointment.createdAt || new Date(),
    });
  }

  if (waitingQueue > 0) {
    notifications.push({
      sourceKey: `reception-queue-${startOfToday().toISOString().slice(0, 10)}`,
      title: `${waitingQueue} bệnh nhân đang trong hàng chờ`,
      description: 'Kiểm tra thứ tự gọi số và xác nhận check-in trước khi chuyển vào phòng khám.',
      type: 'queue',
      action: { label: 'Mở hàng chờ', href: '/receptionist/hang-cho' },
      createdAt: new Date(),
    });
  }

  if (confirmedCount > 0) {
    notifications.push({
      sourceKey: `reception-confirmed-${startOfToday().toISOString().slice(0, 10)}`,
      title: `${confirmedCount} lịch khám đang chờ xử lý`,
      description: 'Các lịch hẹn hôm nay đã được đồng bộ để lễ tân có thể xác nhận và check-in.',
      type: 'patient',
      action: { label: 'Quản lý lịch hẹn', href: '/receptionist/lich-hen' },
      createdAt: new Date(),
    });
  }

  if (unpaidInvoices > 0) {
    notifications.push({
      sourceKey: `reception-payment-${startOfToday().toISOString().slice(0, 10)}`,
      title: `${unpaidInvoices} hóa đơn cần theo dõi`,
      description: 'Theo dõi các hóa đơn chờ khám hoặc chờ thanh toán để tránh bỏ sót bệnh nhân.',
      type: 'payment',
      action: { label: 'Xem thanh toán', href: '/receptionist/thanh-toan' },
      createdAt: new Date(),
    });
  }

  return notifications;
};

const buildAdminNotifications = async () => {
  const today = { $gte: startOfToday(), $lte: endOfToday() };
  const [appointmentsToday, pendingPayments, activeDoctors, newPatients, specialties] = await Promise.all([
    Appointment.countDocuments({ date: today }),
    Invoice.countDocuments({ status: 'pending_payment' }),
    Doctor.countDocuments({ isAvailable: true }),
    User.countDocuments({ role: 'patient', createdAt: today }),
    Specialty.countDocuments(),
  ]);

  const notifications = [];

  notifications.push({
    sourceKey: `admin-appointments-${startOfToday().toISOString().slice(0, 10)}`,
    title: `${appointmentsToday} lịch khám trong hôm nay`,
    description: 'Dashboard đã lấy dữ liệu thật từ hệ thống lịch hẹn và sẵn sàng để theo dõi vận hành.',
    type: 'appointment',
    action: { label: 'Mở dashboard', href: '/admin' },
    createdAt: new Date(),
  });

  if (pendingPayments > 0) {
    notifications.push({
      sourceKey: `admin-payments-${startOfToday().toISOString().slice(0, 10)}`,
      title: `${pendingPayments} hóa đơn chờ thanh toán`,
      description: 'Cần kiểm tra các giao dịch còn treo để đảm bảo số liệu doanh thu chính xác.',
      type: 'payment',
      action: { label: 'Xem lịch hẹn', href: '/admin/appointments' },
      createdAt: new Date(),
    });
  }

  notifications.push({
    sourceKey: `admin-staff-${startOfToday().toISOString().slice(0, 10)}`,
    title: `${activeDoctors} bác sĩ đang hoạt động`,
    description: `${specialties} chuyên khoa hiện có đã được liên kết với dữ liệu bác sĩ trong hệ thống.`,
    type: 'system',
      action: { label: 'Quản lý bác sĩ', href: '/admin/bac-si' },
    createdAt: new Date(),
  });

  if (newPatients > 0) {
    notifications.push({
      sourceKey: `admin-patients-${startOfToday().toISOString().slice(0, 10)}`,
      title: `${newPatients} bệnh nhân mới trong ngày`,
      description: 'Tài khoản bệnh nhân mới đã được ghi nhận và có thể dùng cho các luồng demo/test.',
      type: 'patient',
      action: { label: 'Quản lý người dùng', href: '/admin/nguoi-dung' },
      createdAt: new Date(),
    });
  }

  return notifications;
};

const syncGeneratedNotifications = async (user) => {
  let items = [];
  if (user.role === 'doctor') {
    items = await buildDoctorNotifications(user._id);
  } else if (user.role === 'receptionist') {
    items = await buildReceptionistNotifications();
  } else if (user.role === 'admin') {
    items = await buildAdminNotifications();
  } else {
    return;
  }

  const sourceKeys = items.map((item) => item.sourceKey);
  const existing = await Notification.find({ user: user._id, sourceKey: { $in: sourceKeys } }).lean();
  const existingByKey = new Map(existing.map((item) => [item.sourceKey, item]));

  const operations = items.map((item) => {
    const previous = existingByKey.get(item.sourceKey);
    return {
      updateOne: {
        filter: { user: user._id, sourceKey: item.sourceKey },
        update: {
          $set: {
            title: item.title,
            description: item.description,
            type: item.type,
            action: item.action,
            createdAt: item.createdAt,
          },
          $setOnInsert: {
            user: user._id,
            sourceKey: item.sourceKey,
            isUnread: true,
          },
          ...(previous ? {} : { $currentDate: { updatedAt: true } }),
        },
        upsert: true,
      },
    };
  });

  if (operations.length > 0) {
    await Notification.bulkWrite(operations);
  }

  await Notification.deleteMany({
    user: user._id,
    sourceKey: { $exists: true, $ne: '', $nin: sourceKeys },
  });
};

const getNotifications = async (req, res) => {
  try {
    await syncGeneratedNotifications(req.user);
    const docs = await Notification.find({ user: req.user._id }).sort({ isUnread: -1, createdAt: -1 }).limit(20);
    const notifications = docs.map(mapNotification);
    const unreadCount = notifications.filter((item) => item.isUnread).length;
    return res.status(200).json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Lỗi tải thông báo' });
  }
};

const markNotificationsRead = async (req, res) => {
  try {
    const { id, ids } = req.body || {};
    const filter = { user: req.user._id };
    if (id) filter._id = id;
    if (Array.isArray(ids) && ids.length > 0) filter._id = { $in: ids };
    await Notification.updateMany(filter, { isUnread: false });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Lỗi cập nhật thông báo' });
  }
};

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({ success: true, data: { user: user.toSafeObject() } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const isPatient = req.user?.role === 'patient';
    const requiredFullName = String(req.body.fullName ?? '').trim();
    const requiredPhone = String(req.body.phone ?? '').trim();
    const requiredDateOfBirth = String(req.body.dateOfBirth ?? '').trim();
    const requiredNationalId = String(req.body.nationalId ?? '').trim();
    const requiredHeight = req.body.height;

    if (!requiredFullName) {
      return res.status(400).json({ success: false, message: 'Họ tên không được để trống' });
    }
    if (isPatient && !requiredPhone) {
      return res.status(400).json({ success: false, message: 'Số điện thoại là bắt buộc' });
    }
    if (requiredPhone && !/^(0|\+84)[0-9]{9}$/.test(requiredPhone)) {
      return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ' });
    }
    if (isPatient && !requiredDateOfBirth) {
      return res.status(400).json({ success: false, message: 'Ngày sinh là bắt buộc' });
    }
    if (isPatient && !requiredNationalId) {
      return res.status(400).json({ success: false, message: 'Mã bảo hiểm là bắt buộc' });
    }
    if (
      isPatient
      && (requiredHeight === undefined || requiredHeight === null || String(requiredHeight).trim() === '')
    ) {
      return res.status(400).json({ success: false, message: 'Chiều cao là bắt buộc' });
    }
    if (
      requiredHeight !== undefined
      && requiredHeight !== null
      && String(requiredHeight).trim() !== ''
      && (Number.isNaN(Number(requiredHeight)) || Number(requiredHeight) <= 0)
    ) {
      return res.status(400).json({ success: false, message: 'Chiều cao phải lớn hơn 0' });
    }

    const allowed = [
      'fullName',
      'phone',
      'dateOfBirth',
      'gender',
      'address',
      'nationalId',
      'emergencyPhone',
      'occupation',
      'bio',
      'height',
      'weight',
    ];
    const set = {};
    const unset = {};

    allowed.forEach((field) => {
      if (req.body[field] === undefined) return;
      const value = req.body[field];

      if (value === '' || value === null) {
        if (field === 'fullName') {
          set.fullName = '';
        } else {
          unset[field] = '';
        }
        return;
      }

      if (field === 'height' || field === 'weight') {
        const num = Number(value);
        if (Number.isNaN(num)) return;
        set[field] = num;
        return;
      }

      set[field] = value;
    });

    if (set.dateOfBirth) {
      const parsed = new Date(set.dateOfBirth);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({ success: false, message: 'Ngày sinh không hợp lệ' });
      }
      set.dateOfBirth = parsed;
    }

    if (set.fullName !== undefined && !String(set.fullName).trim()) {
      return res.status(400).json({ success: false, message: 'Họ tên không được để trống' });
    }

    const updateOp = {};
    if (Object.keys(set).length) updateOp.$set = set;
    if (Object.keys(unset).length) updateOp.$unset = unset;

    if (!Object.keys(updateOp).length) {
      return res.status(400).json({ success: false, message: 'Không có thông tin để cập nhật' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateOp, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: { user: user.toSafeObject() },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// POST /api/profile/avatar - upload/change avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn file ảnh' });
    }

    // Delete old avatar if exists (not Google avatar)
    const currentUser = await User.findById(req.user._id);
    if (currentUser.avatar && !currentUser.avatar.startsWith('http')) {
      const oldPath = path.join(process.cwd(), 'uploads', 'avatars', currentUser.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.file.filename }, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Cập nhật ảnh đại diện thành công',
      data: {
        avatar: req.file.filename,
        avatarUrl: `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`,
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi upload ảnh' });
  }
};

// DELETE /api/profile/avatar
const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.avatar && !user.avatar.startsWith('http')) {
      const filePath = path.join(process.cwd(), 'uploads', 'avatars', user.avatar);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    user.avatar = null;
    await user.save();

    return res.status(200).json({ success: true, message: 'Đã xóa ảnh đại diện' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// PUT /api/profile/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || String(newPassword).length < 8) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới ít nhất 8 ký tự' });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu hiện tại' });
      }
      const isValid = await user.comparePassword(currentPassword);
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác' });
      }
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  changePassword,
  getNotifications,
  markNotificationsRead,
};
