const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
const Visit = require('../models/Visit');
const LabResult = require('../models/LabResult');
const MedicalHistory = require('../models/MedicalHistory');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

const FACILITY = 'MedCare Clinic - Quận 1';

const daysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(9, 0, 0, 0);
  return d;
};

const daysFromNow = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d;
};

const todayAt = (time) => {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60_000);

// Ghi đè createdAt (timestamps tự động) để timeAgo của thông báo trông thực tế.
const setCreatedAt = (Model, id, createdAt) =>
  Model.updateOne({ _id: id }, { createdAt }, { timestamps: false });

// Xóa toàn bộ dữ liệu seed cũ (giữ lại dữ liệu thật do người dùng tạo).
// Lưu ý: seedDevUsers tạo lại user (đổi _id) mỗi lần khởi động, nên ta xóa theo
// cờ isSeed thay vì theo patientUser để tránh dữ liệu seed mồ côi gây trùng khóa.
const clearSeed = async () => {
  await Promise.all([
    Visit.deleteMany({ isSeed: true }),
    LabResult.deleteMany({ isSeed: true }),
    MedicalHistory.deleteMany({ isSeed: true }),
    Invoice.deleteMany({ isSeed: true }),
    Review.deleteMany({ isSeed: true }),
    Notification.deleteMany({ isSeed: true }),
    Appointment.deleteMany({ source: 'patient', isSeed: true }),
  ]);
};

const seedPatientData = async () => {
  if (process.env.NODE_ENV === 'production' || process.env.SEED_PATIENT === 'false') {
    return;
  }

  const user = await User.findOne({ email: 'patient@test.com' });
  if (!user) return;

  await clearSeed();

  // ── Visits + đơn thuốc ──
  const [visitA, visitB, visitC] = await Visit.create([
    {
      patientUser: user._id,
      doctorName: 'BS. Nguyễn Văn An',
      specialty: 'Tim mạch',
      facility: FACILITY,
      date: daysAgo(24),
      diagnosis: 'Tăng huyết áp độ I — theo dõi điều trị',
      symptoms: 'Đau đầu vùng thái dương, hồi hộp khi gắng sức',
      treatment: 'Điều chỉnh chế độ ăn mặn, tái khám sau 4 tuần',
      status: 'completed',
      prescriptions: [
        { name: 'Amlodipine 5mg', dosage: '1 viên/sáng — uống sau ăn', duration: '30 ngày', status: 'active' },
        { name: 'Aspirin 81mg', dosage: '1 viên/tối', duration: '30 ngày', status: 'active' },
      ],
      isSeed: true,
    },
    {
      patientUser: user._id,
      doctorName: 'BS. Nguyễn Thị Giang',
      specialty: 'Sản & Nhi',
      facility: FACILITY,
      date: daysAgo(67),
      diagnosis: 'Viêm họng cấp — đã khỏi',
      symptoms: 'Đau họng, sốt nhẹ 37.8°C',
      treatment: 'Nghỉ ngơi, uống đủ nước, hoàn tất liệu trình kháng sinh',
      status: 'completed',
      prescriptions: [
        { name: 'Amoxicillin 250mg', dosage: '3 viên/ngày — 7 ngày', duration: '7 ngày', status: 'completed' },
        { name: 'Paracetamol 500mg', dosage: 'Khi sốt > 38°C', duration: '5 ngày', status: 'completed' },
      ],
      isSeed: true,
    },
    {
      patientUser: user._id,
      doctorName: 'BS. Hoàng Văn Đức',
      specialty: 'Cơ xương khớp',
      facility: FACILITY,
      date: daysAgo(110),
      diagnosis: 'Đau vai gáy do làm việc văn phòng',
      symptoms: 'Đau mỏi vai phải, hạn chế vận động',
      treatment: 'Vật lý trị liệu 5 buổi, tránh ngồi lâu',
      status: 'completed',
      prescriptions: [
        { name: 'Etoricoxib 60mg', dosage: '1 viên/ngày — sau ăn', duration: '14 ngày', status: 'active' },
      ],
      isSeed: true,
    },
  ]);

  // ── Lab results (2 cái có date gần đây để hiện "mới") ──
  await LabResult.create([
    { patientUser: user._id, visit: visitA._id, name: 'Xét nghiệm máu tổng quát', date: daysAgo(3), doctorName: 'BS. Nguyễn Văn An', status: 'normal', summary: 'Hồng cầu, bạch cầu, tiểu cầu trong giới hạn bình thường', isSeed: true },
    { patientUser: user._id, visit: visitA._id, name: 'Đo lipid máu', date: daysAgo(3), doctorName: 'BS. Nguyễn Văn An', status: 'abnormal', summary: 'Cholesterol LDL hơi cao — cần điều chỉnh chế độ ăn', isSeed: true },
    { patientUser: user._id, visit: visitB._id, name: 'Xét nghiệm đường huyết', date: daysAgo(67), doctorName: 'BS. Nguyễn Thị Giang', status: 'normal', summary: 'Glucose lúc đói: 5.2 mmol/L — bình thường', isSeed: true },
    { patientUser: user._id, name: 'Siêu âm tim', date: daysAgo(120), doctorName: 'BS. Nguyễn Văn An', status: 'normal', summary: 'Chức năng tim bình thường, không phát hiện bất thường', isSeed: true },
    { patientUser: user._id, name: 'Xét nghiệm chức năng gan', date: daysAgo(120), doctorName: 'BS. Nguyễn Thị Giang', status: 'pending', summary: 'Đang chờ kết quả từ phòng xét nghiệm', isSeed: true },
  ]);

  // ── Medical history ──
  await MedicalHistory.create([
    { patientUser: user._id, type: 'allergy', label: 'Penicillin', detail: 'Phát ban, ngứa da', since: '2018', isSeed: true },
    { patientUser: user._id, type: 'allergy', label: 'Hải sản', detail: 'Khó thở nhẹ, sưng môi', since: '2020', isSeed: true },
    { patientUser: user._id, type: 'chronic', label: 'Tăng huyết áp', detail: 'Đang điều trị và theo dõi định kỳ', since: '2024', isSeed: true },
    { patientUser: user._id, type: 'surgery', label: 'Cắt ruột thừa', detail: 'Phẫu thuật nội soi — Bệnh viện Chợ Rẫy', since: '2015', isSeed: true },
    { patientUser: user._id, type: 'family', label: 'Tiền sử gia đình', detail: 'Bố mắc tiểu đường type 2, mẹ tăng huyết áp', isSeed: true },
  ]);

  // ── Invoices (upsert theo code để tránh trùng khóa khi nodemon restart chồng nhau) ──
  const seedInvoices = [
    {
      code: 'HD-250605',
      patientUser: user._id,
      doctorName: 'BS. Nguyễn Văn An',
      specialtyName: 'Tim mạch',
      facility: FACILITY,
      visitDate: daysAgo(16),
      lineItems: [
        { label: 'Phí khám Tim mạch', amount: 350_000, type: 'charge' },
        { label: 'Xét nghiệm máu tổng quát', amount: 450_000, type: 'charge' },
        { label: 'Thuốc theo đơn (Paracetamol, Amoxicillin)', amount: 150_000, type: 'charge' },
        { label: 'Tiền cọc đã thanh toán khi đặt lịch', amount: 100_000, type: 'credit' },
      ],
      depositAmount: 100_000,
      depositPaymentMethod: 'vnpay',
      depositPaidAt: daysAgo(20),
      status: 'pending_payment',
      dueDate: daysFromNow(3),
      isSeed: true,
    },
    {
      code: 'HD-250420',
      patientUser: user._id,
      doctorName: 'BS. Nguyễn Thị Giang',
      specialtyName: 'Sản & Nhi',
      facility: FACILITY,
      visitDate: daysAgo(62),
      lineItems: [
        { label: 'Phí khám Sản & Nhi', amount: 300_000, type: 'charge' },
        { label: 'Thuốc theo đơn', amount: 80_000, type: 'charge' },
        { label: 'Tiền cọc đã thanh toán khi đặt lịch', amount: 100_000, type: 'credit' },
      ],
      depositAmount: 100_000,
      depositPaymentMethod: 'momo',
      depositPaidAt: daysAgo(64),
      status: 'paid',
      paidAt: daysAgo(62),
      isSeed: true,
    },
  ];
  for (const inv of seedInvoices) {
    await Invoice.findOneAndUpdate({ code: inv.code }, inv, { upsert: true });
  }

  // ── Lịch khám hôm nay + hóa đơn cọc đang chờ (upsert theo code) ──
  const todayAppt = await Appointment.findOneAndUpdate(
    { code: '#LH-P001' },
    {
      code: '#LH-P001',
      patientUser: user._id,
      patientName: user.fullName,
      phone: user.phone || '',
      doctor: 'BS. Nguyễn Văn An',
      department: 'Khoa Tim mạch',
      date: todayAt('10:15'),
      time: '10:15',
      service: 'Kiểm tra tim mạch',
      consultationFee: 350_000,
      depositAmount: 105_000,
      status: 'confirmed',
      source: 'patient',
      isSeed: true,
    },
    { upsert: true, new: true },
  );

  await Invoice.findOneAndUpdate(
    { code: 'HD-250621' },
    {
      code: 'HD-250621',
      patientUser: user._id,
      appointment: todayAppt._id,
      bookingReferenceCode: todayAppt.code,
      doctorName: 'BS. Nguyễn Văn An',
      specialtyName: 'Tim mạch',
      facility: FACILITY,
      visitDate: todayAt('10:15'),
      lineItems: [{ label: 'Phí khám Tim mạch', amount: 350_000, type: 'charge' }],
      depositAmount: 105_000,
      depositPaymentMethod: 'vnpay',
      depositPaidAt: daysAgo(1),
      estimatedRemaining: 245_000,
      status: 'awaiting_visit',
      isSeed: true,
    },
    { upsert: true },
  );

  // ── Review đã gửi (lịch sử) ──
  await Review.create({
    patientUser: user._id,
    doctorName: 'BS. Phạm Hoàng Long',
    specialtyName: 'Mắt',
    facility: FACILITY,
    visitDate: daysAgo(98),
    overallRating: 5,
    doctorRating: 5,
    facilityRating: 4,
    comment: 'Bác sĩ giải thích kỹ quy trình điều trị, nhân viên hướng dẫn rất nhiệt tình.',
    tags: ['Giải thích rõ ràng', 'Thái độ tận tâm'],
    isAnonymous: false,
    submittedAt: daysAgo(98),
    isSeed: true,
  });

  // ── Notifications (ghi đè createdAt để timeAgo thực tế) ──
  const notifications = [
    { title: 'Kết quả xét nghiệm máu đã có', description: 'Kết quả xét nghiệm máu tổng quát của bạn đã được cập nhật. Một số chỉ số cần theo dõi thêm.', type: 'lab', isUnread: true, action: { label: 'Xem kết quả', href: '/patient/ho-so?tab=labs' }, createdAt: minutesAgo(10) },
    { title: 'Nhắc lịch khám hôm nay', description: 'Bạn có lịch kiểm tra tim mạch lúc 10:15 với BS. Nguyễn Văn An. Vui lòng đến trước 15 phút để check-in.', type: 'appointment', isUnread: true, action: { label: 'Xem lịch hẹn', href: '/patient/lich-hen' }, createdAt: minutesAgo(60) },
    { title: 'Nhắc uống thuốc tối nay', description: 'Amlodipine 5mg — 1 viên sau ăn tối. Aspirin 81mg — 1 viên buổi tối.', type: 'prescription', isUnread: false, action: { label: 'Xem đơn thuốc', href: '/patient/ho-so?tab=prescriptions' }, createdAt: minutesAgo(180) },
    { title: 'Hóa đơn khám chưa thanh toán', description: 'Bạn còn 850.000 VND cần thanh toán sau khám (đã trừ tiền cọc).', type: 'payment', isUnread: true, action: { label: 'Thanh toán ngay', href: '/patient/thanh-toan?filter=unpaid' }, createdAt: minutesAgo(60 * 26) },
    { title: 'Xét nghiệm đang chờ kết quả', description: 'Kết quả xét nghiệm chức năng gan sẽ được cập nhật trong 1–2 ngày làm việc.', type: 'lab', isUnread: false, action: { label: 'Theo dõi xét nghiệm', href: '/patient/ho-so?tab=labs' }, createdAt: minutesAgo(60 * 48) },
    { title: 'Cập nhật hồ sơ sức khỏe', description: 'Hãy kiểm tra thông tin chiều cao, cân nặng và tiền sử dị ứng để bác sĩ có dữ liệu chính xác khi khám.', type: 'system', isUnread: false, action: { label: 'Cập nhật hồ sơ', href: '/ho-so' }, createdAt: minutesAgo(60 * 72) },
  ];

  for (const notif of notifications) {
    const { createdAt, ...rest } = notif;
    const doc = await Notification.create({ ...rest, user: user._id, isSeed: true });
    await setCreatedAt(Notification, doc._id, createdAt);
  }

  console.log(`🌱 Seeded patient data for ${user.email}`);
};

module.exports = seedPatientData;
