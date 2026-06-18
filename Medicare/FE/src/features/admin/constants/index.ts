import {
  AlertTriangle,
  Boxes,
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarX,
  CircleCheck,
  CircleAlert,
  CircleX,
  ClipboardCheck,
  DoorOpen,
  MessageSquare,
  Network,
  Star,
  Stethoscope,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import {
  ActivityLog,
  AdminAppointment,
  AdminDashboardStat,
  AdminDepartment,
  AdminDoctor,
  AdminProfileForm,
  AdminReview,
  AdminRoom,
  AdminSectionStat,
  AdminSettingsForm,
  AdminUser,
  AdminUserRole,
  AdminUserStatus,
  AppointmentStatus,
  AppointmentTrendPoint,
  AuditLogEntry,
  AuditSummary,
  MonthlyPoint,
  NewAppointment,
  PatientTrendPoint,
  QuarterlyGoal,
  ReportMetric,
  ReportStat,
  RoleDistribution,
  SpecialtyPerformance,
  SpecialtyShare,
  SupplyItem,
  SystemNotice,
  TopDepartment,
} from '../types';

export const ROLE_LABELS: Record<AdminUserRole, string> = {
  patient: 'Bệnh nhân',
  doctor: 'Bác sĩ',
  receptionist: 'Lễ tân',
  admin: 'Quản trị viên',
};

export const STATUS_LABELS: Record<AdminUserStatus, string> = {
  active: 'Đang hoạt động',
  inactive: 'Ngưng hoạt động',
  suspended: 'Đã khóa',
};

export const ADMIN_DASHBOARD_STATS: AdminDashboardStat[] = [
  {
    id: 'total-patients',
    label: 'Tổng bệnh nhân',
    value: '12.842',
    delta: '+12%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40',
  },
  {
    id: 'total-doctors',
    label: 'Tổng bác sĩ',
    value: '156',
    delta: '+2',
    trend: 'up',
    icon: Stethoscope,
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    id: 'total-appointments',
    label: 'Tổng lịch hẹn',
    value: '3.420',
    delta: '+8%',
    trend: 'up',
    icon: CalendarCheck,
    color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40',
  },
  {
    id: 'total-departments',
    label: 'Tổng khoa',
    value: '24',
    delta: 'Ổn định',
    trend: 'flat',
    icon: Building2,
    color: 'text-slate-600 bg-slate-100 dark:bg-slate-800',
  },
  {
    id: 'total-rooms',
    label: 'Phòng khám',
    value: '86',
    delta: '+5',
    trend: 'up',
    icon: DoorOpen,
    color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40',
  },
  {
    id: 'revenue',
    label: 'Doanh thu',
    value: '2.45B',
    unit: 'VNĐ',
    delta: '+24%',
    trend: 'up',
    icon: Wallet,
    color: 'text-white bg-white/20',
    highlight: true,
  },
];

export const ADMIN_APPOINTMENT_TREND: AppointmentTrendPoint[] = [
  { month: 'Th1', patients: 2000, appointments: 1500 },
  { month: 'Th2', patients: 2800, appointments: 2200 },
  { month: 'Th3', patients: 3050, appointments: 2750 },
  { month: 'Th4', patients: 3500, appointments: 3000 },
  { month: 'Th5', patients: 2450, appointments: 1800 },
  { month: 'Th6', patients: 1550, appointments: 1100 },
];

export const ADMIN_NEW_APPOINTMENTS: NewAppointment[] = [
  {
    id: 'na-1',
    patientName: 'Nguyễn Thùy Linh',
    service: 'Nội soi dạ dày',
    time: '09:30 AM',
    status: 'confirmed',
  },
  {
    id: 'na-2',
    patientName: 'Trần Minh Quân',
    service: 'Khám răng',
    time: '10:15 AM',
    status: 'pending',
  },
];

export const ADMIN_SYSTEM_NOTICES: SystemNotice[] = [
  {
    id: 'sn-1',
    title: 'Cảnh báo tồn kho thuốc',
    detail: 'Kho Dược A sắp hết Vaccine cúm (còn 5 liều).',
    timeAgo: '15 phút trước',
    level: 'warning',
  },
  {
    id: 'sn-2',
    title: 'Bảo trì hệ thống định kỳ',
    detail: 'Hệ thống sẽ tạm ngưng vào 2:00 AM Chủ Nhật.',
    timeAgo: '2 giờ trước',
    level: 'info',
  },
];

export const ADMIN_TOP_DEPARTMENTS: TopDepartment[] = [
  { id: 'td-1', rank: 1, name: 'Khoa Nội Tổng Quát', revenueLabel: '820M', revenue: 820 },
  { id: 'td-2', rank: 2, name: 'Khoa Sản Nhi', revenueLabel: '540M', revenue: 540 },
];

export const ADMIN_QUARTERLY_GOAL: QuarterlyGoal = {
  title: 'Mục tiêu Quý 2',
  percent: 78.5,
  description:
    'Dự kiến đạt mốc 3.5B VNĐ vào cuối tháng 6 dựa trên tốc độ tăng trưởng hiện tại.',
};

export const ADMIN_NEW_USERS_TODAY = 15;

// ─── Quản lý bác sĩ ──────────────────────────────
export const DOCTOR_STATUS_LABELS: Record<AdminDoctor['status'], string> = {
  working: 'Đang làm việc',
  on_leave: 'Nghỉ phép',
};

export const ADMIN_DOCTOR_STATS: AdminSectionStat[] = [
  { id: 'total', label: 'Tổng bác sĩ', value: '128', note: '+12%', noteTone: 'up', icon: Users, color: 'text-blue-600 bg-blue-50' },
  { id: 'active', label: 'Hoạt động', value: '84', note: 'đang trực', noteTone: 'up', icon: CircleCheck, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'specialty', label: 'Chuyên khoa', value: '18', note: '12 Khoa', noteTone: 'muted', icon: Building2, color: 'text-rose-600 bg-rose-50' },
  { id: 'leave', label: 'Lịch vắng', value: '5', note: '4 Nghỉ', noteTone: 'danger', icon: CalendarX, color: 'text-red-600 bg-red-50' },
];

export const ADMIN_DOCTORS: AdminDoctor[] = [
  { id: 'DOC-2024-001', fullName: 'TS.BS. Nguyễn Văn An', specialty: 'Nội tổng quát', experienceYears: 15, status: 'working' },
  { id: 'DOC-2024-042', fullName: 'ThS.BS. Lê Thị Mai', specialty: 'Nhi khoa', experienceYears: 8, status: 'working' },
  { id: 'DOC-2024-015', fullName: 'BSCKII. Trần Hoàng Nam', specialty: 'Ngoại thần kinh', experienceYears: 20, status: 'on_leave' },
  { id: 'DOC-2024-007', fullName: 'TS.BS. Phạm Thu Hà', specialty: 'Tim mạch', experienceYears: 18, status: 'working' },
  { id: 'DOC-2024-023', fullName: 'ThS.BS. Đỗ Quang Huy', specialty: 'Da liễu', experienceYears: 10, status: 'working' },
  { id: 'DOC-2024-031', fullName: 'BSCKI. Vũ Khánh Linh', specialty: 'Tai mũi họng', experienceYears: 7, status: 'on_leave' },
  { id: 'DOC-2024-056', fullName: 'TS.BS. Hoàng Văn Tú', specialty: 'Nội tổng quát', experienceYears: 22, status: 'working' },
  { id: 'DOC-2024-061', fullName: 'ThS.BS. Bùi Phương Thảo', specialty: 'Nhi khoa', experienceYears: 6, status: 'working' },
  { id: 'DOC-2024-074', fullName: 'BSCKII. Ngô Đức Thắng', specialty: 'Tim mạch', experienceYears: 16, status: 'working' },
  { id: 'DOC-2024-088', fullName: 'BS. Trương Mỹ Duyên', specialty: 'Da liễu', experienceYears: 4, status: 'on_leave' },
];

export const ADMIN_TOTAL_DOCTORS = 128;

// ─── Quản lý phòng khám ──────────────────────────
export const ROOM_STATUS_LABELS: Record<AdminRoom['status'], string> = {
  available: 'Trống',
  in_use: 'Đang sử dụng',
  maintenance: 'Bảo trì',
};

export const ADMIN_ROOM_STATS: AdminSectionStat[] = [
  { id: 'total', label: 'Tổng số phòng', value: '124', icon: Building2, color: 'text-blue-600 bg-blue-50' },
  { id: 'available', label: 'Đang trống', value: '86', icon: CircleCheck, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'maintenance', label: 'Bảo trì', value: '12', icon: CircleAlert, color: 'text-red-600 bg-red-50' },
  { id: 'departments', label: 'Khoa phụ trách', value: '18', icon: Network, color: 'text-blue-600 bg-blue-50' },
];

export const ADMIN_ROOMS: AdminRoom[] = [
  { id: 'P-101', name: 'Phòng khám Nội 01', department: 'Khoa Nội', status: 'available' },
  { id: 'P-102', name: 'Phòng Xét nghiệm 01', department: 'Khoa Xét nghiệm', status: 'in_use' },
  { id: 'P-205', name: 'Phòng Chụp X-Quang 02', department: 'Khoa Chẩn đoán hình ảnh', status: 'maintenance' },
  { id: 'P-301', name: 'Phòng khám Nhi 01', department: 'Khoa Nhi', status: 'available' },
  { id: 'P-103', name: 'Phòng khám Nội 02', department: 'Khoa Nội', status: 'in_use' },
  { id: 'P-210', name: 'Phòng Siêu âm 01', department: 'Khoa Chẩn đoán hình ảnh', status: 'available' },
  { id: 'P-302', name: 'Phòng khám Nhi 02', department: 'Khoa Nhi', status: 'maintenance' },
  { id: 'P-401', name: 'Phòng Tiểu phẫu 01', department: 'Khoa Ngoại', status: 'available' },
];

export const ADMIN_TOTAL_ROOMS = 124;

// ─── Quản lý khoa khám ───────────────────────────
export const ADMIN_DEPARTMENT_STATS: AdminSectionStat[] = [
  { id: 'total', label: 'Tổng số khoa', value: '12', icon: Network, color: 'text-blue-600 bg-blue-50' },
  { id: 'doctors', label: 'Bác sĩ phụ trách', value: '48', icon: Stethoscope, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'patients', label: 'Bệnh nhân hôm nay', value: '245', icon: Users, color: 'text-rose-600 bg-rose-50' },
  { id: 'rooms', label: 'Phòng khám', value: '36', icon: Building2, color: 'text-slate-600 bg-slate-100' },
];

export const ADMIN_DEPARTMENTS: AdminDepartment[] = [
  {
    id: 'NO01',
    name: 'Khoa Nội',
    description: 'Điều trị các bệnh lý nội khoa, tim mạch, tiêu hóa và hô hấp cho người lớn.',
    doctorCount: 12,
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'NG02',
    name: 'Khoa Ngoại',
    description: 'Phẫu thuật tổng quát, chỉnh hình và các can thiệp ngoại khoa kỹ thuật cao.',
    doctorCount: 15,
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    id: 'SA03',
    name: 'Khoa Sản',
    description: 'Chăm sóc sức khỏe phụ nữ, thai sản và hỗ trợ sinh sản hiện đại.',
    doctorCount: 8,
    color: 'from-rose-500 to-rose-700',
  },
  {
    id: 'NH04',
    name: 'Khoa Nhi',
    description: 'Khám và điều trị chuyên sâu cho trẻ em từ sơ sinh đến vị thành niên.',
    doctorCount: 10,
    color: 'from-amber-500 to-amber-700',
  },
  {
    id: 'TM05',
    name: 'Khoa Tai Mũi Họng',
    description: 'Chẩn đoán và điều trị các bệnh lý tai mũi họng cho mọi lứa tuổi.',
    doctorCount: 5,
    color: 'from-violet-500 to-violet-700',
  },
];

// ─── Quản lý đánh giá ────────────────────────────
export const ADMIN_REVIEW_STATS: AdminSectionStat[] = [
  { id: 'total', label: 'Tổng đánh giá', value: '1.284', icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
  { id: 'avg', label: 'Điểm trung bình', value: '4.8', icon: Star, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'flagged', label: 'Đã ẩn / Vi phạm', value: '12', icon: CircleAlert, color: 'text-red-600 bg-red-50' },
  { id: 'month', label: 'Tháng này', value: '+15%', icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
];

export const ADMIN_REVIEW_TOTAL = 1284;

export const ADMIN_REVIEWS: AdminReview[] = [
  {
    id: 'rv-1',
    patientName: 'Nguyễn Hoàng Nam',
    patientCode: 'BN-2023-001',
    doctorName: 'BS. Trần Đức Anh',
    department: 'Khoa Tim mạch',
    rating: 5,
    content: 'Bác sĩ rất tận tâm và giải thích kỹ càng tình trạng bệnh. Cơ sở vật chất sạch sẽ, hiện đại.',
    date: '15/10/2023',
    status: 'visible',
  },
  {
    id: 'rv-2',
    patientName: 'Lê Thị Mai',
    patientCode: 'BN-2023-045',
    doctorName: 'BS. Phạm Minh Tuấn',
    department: 'Khoa Nội',
    rating: 4,
    content: 'Thời gian chờ đợi hơi lâu một chút, nhưng bác sĩ khám rất kỹ. Sẽ quay lại.',
    date: '14/10/2023',
    status: 'visible',
  },
  {
    id: 'rv-3',
    patientName: 'Ẩn danh',
    patientCode: 'IP: 192.168.1.xxx',
    anonymous: true,
    doctorName: 'BS. Nguyễn Thu Hà',
    department: 'Khoa Nhi',
    rating: 1,
    content: '[Cảnh báo: Chứa từ ngữ không phù hợp] ... thái độ nhân viên bảo vệ.',
    date: '12/10/2023',
    flagged: true,
    status: 'hidden',
  },
  {
    id: 'rv-4',
    patientName: 'Phan Thanh Tùng',
    patientCode: 'BN-2023-112',
    doctorName: 'BS. Lê Quang Vinh',
    department: 'Khoa Ngoại',
    rating: 5,
    content: 'Quy trình phẫu thuật nhanh gọn, hồi phục tốt. Cảm ơn đội ngũ y bác sĩ.',
    date: '10/10/2023',
    status: 'visible',
  },
];

// ─── Quản lý lịch hẹn ────────────────────────────
export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export const ADMIN_APPOINTMENT_STATS: AdminSectionStat[] = [
  { id: 'today', label: 'Tổng lịch hôm nay', value: '124', icon: CalendarCheck, color: 'text-blue-600 bg-blue-50' },
  { id: 'pending', label: 'Chờ xác nhận', value: '18', icon: CalendarClock, color: 'text-amber-600 bg-amber-50' },
  { id: 'completed', label: 'Đã hoàn thành', value: '86', icon: CircleCheck, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'cancelled', label: 'Lịch đã hủy', value: '5', icon: CircleX, color: 'text-red-600 bg-red-50' },
];

export const ADMIN_APPOINTMENTS: AdminAppointment[] = [
  {
    id: '#LH-10293',
    patientName: 'Nguyễn Văn Hùng',
    patientPhone: '0908 123 ***',
    patientInitials: 'NH',
    doctorName: 'BS. Lê Minh Tâm',
    doctorDept: 'Khoa Nội tổng quát',
    date: '24/10/2023',
    timeRange: '08:30 - 09:00',
    status: 'pending',
  },
  {
    id: '#LH-10294',
    patientName: 'Trần Tuyết Mai',
    patientPhone: '0345 678 ***',
    patientInitials: 'TM',
    doctorName: 'BS. Phạm Kim Liên',
    doctorDept: 'Khoa Nhi',
    date: '24/10/2023',
    timeRange: '09:15 - 09:45',
    status: 'confirmed',
  },
  {
    id: '#LH-10290',
    patientName: 'Lý Quốc Dũng',
    patientPhone: '0768 221 ***',
    patientInitials: 'LD',
    doctorName: 'BS. Võ Hoàng Nam',
    doctorDept: 'Khoa Ngoại',
    date: '23/10/2023',
    timeRange: '14:00 - 15:00',
    status: 'completed',
  },
  {
    id: '#LH-10288',
    patientName: 'An Vy',
    patientPhone: '0932 445 ***',
    patientInitials: 'AV',
    doctorName: 'BS. Lê Minh Tâm',
    doctorDept: 'Khoa Nội tổng quát',
    date: '23/10/2023',
    timeRange: '10:30 - 11:00',
    status: 'cancelled',
  },
  {
    id: '#LH-10285',
    patientName: 'Đặng Thu Trang',
    patientPhone: '0911 552 ***',
    patientInitials: 'ĐT',
    doctorName: 'BS. Phạm Kim Liên',
    doctorDept: 'Khoa Nhi',
    date: '23/10/2023',
    timeRange: '15:30 - 16:00',
    status: 'confirmed',
  },
  {
    id: '#LH-10280',
    patientName: 'Hoàng Minh Quân',
    patientPhone: '0987 114 ***',
    patientInitials: 'HQ',
    doctorName: 'BS. Võ Hoàng Nam',
    doctorDept: 'Khoa Ngoại',
    date: '22/10/2023',
    timeRange: '08:00 - 08:30',
    status: 'completed',
  },
];

export const ADMIN_APPOINTMENT_TOTAL = 124;

// ─── Nhật ký hệ thống (Audit Log) ────────────────
export const AUDIT_ACTION_LABELS: Record<AuditLogEntry['actionType'], string> = {
  create: 'Tạo tài khoản',
  update: 'Cập nhật',
  booking: 'Đặt lịch',
  payment: 'Thanh toán',
  backup: 'Sao lưu',
};

export const ADMIN_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'al-1',
    time: '14:32, 24/10/2023',
    timeAgo: 'vừa xong',
    actorName: 'Admin Chính',
    actorRole: 'Quản trị hệ thống',
    actorInitials: 'AD',
    actorColor: 'bg-emerald-500',
    action: 'TẠO TÀI KHOẢN',
    actionType: 'create',
    target: 'Bệnh nhân: Lê Văn Luyện',
    ip: '192.168.1.45',
  },
  {
    id: 'al-2',
    time: '14:15, 24/10/2023',
    timeAgo: '17 phút trước',
    actorName: 'BS. Nguyễn Khoa',
    actorRole: 'Khoa Nội',
    actorInitials: 'BS',
    actorColor: 'bg-blue-500',
    action: 'CẬP NHẬT THÔNG TIN',
    actionType: 'update',
    target: 'Hồ sơ bệnh án #BA9921',
    ip: '10.0.4.112',
  },
  {
    id: 'al-3',
    time: '13:50, 24/10/2023',
    timeAgo: '42 phút trước',
    actorName: 'Lễ tân - Mai Anh',
    actorRole: 'Quầy tiếp đón',
    actorInitials: 'NV',
    actorColor: 'bg-violet-500',
    action: 'ĐẶT LỊCH KHÁM',
    actionType: 'booking',
    target: 'Lịch hẹn: Trần Tuấn (15:00)',
    ip: '192.168.2.10',
  },
  {
    id: 'al-4',
    time: '13:20, 24/10/2023',
    timeAgo: '1 giờ trước',
    actorName: 'Kế toán - Hoàng',
    actorRole: 'Phòng Tài chính',
    actorInitials: 'KT',
    actorColor: 'bg-amber-500',
    action: 'THANH TOÁN',
    actionType: 'payment',
    target: 'Hóa đơn #HD-2023-0012',
    ip: '192.168.1.156',
  },
  {
    id: 'al-5',
    time: '12:45, 24/10/2023',
    timeAgo: '2 giờ trước',
    actorName: 'System Process',
    actorRole: 'Tự động',
    actorInitials: 'HT',
    actorColor: 'bg-slate-500',
    action: 'BACKUP ĐỊNH KỲ',
    actionType: 'backup',
    target: 'Cơ sở dữ liệu bệnh viện',
    ip: 'localhost',
  },
];

export const ADMIN_AUDIT_TOTAL = 1240;

export const ADMIN_AUDIT_SUMMARY: AuditSummary[] = [
  { id: 'new-acc', label: 'Tài khoản mới (24h)', value: '42', note: '+12%', noteTone: 'up', icon: UserPlus, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { id: 'new-appt', label: 'Lịch khám đặt mới', value: '156', note: '+5%', noteTone: 'up', icon: CalendarDays, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { id: 'abnormal', label: 'Truy cập bất thường', value: '02', note: 'Cảnh báo', noteTone: 'danger', icon: AlertTriangle, bg: 'bg-red-50', iconColor: 'text-red-600' },
];

// ─── Hồ sơ cá nhân admin ─────────────────────────
export const DEFAULT_ADMIN_PROFILE: AdminProfileForm = {
  fullName: 'Nguyễn Văn Admin',
  employeeId: 'NV-2024-001',
  email: 'admin.hospital@mediadmin.vn',
  phone: '0901234567',
  role: 'Quản trị viên cấp cao (System Administrator)',
};

export const ADMIN_USERS: AdminUser[] = [
  {
    id: 'u-1001',
    fullName: 'Nguyễn Thị Lan',
    email: 'lan.nguyen@medicare.vn',
    phone: '0901234567',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-12',
    lastActiveAt: '2026-06-18',
  },
  {
    id: 'u-1002',
    fullName: 'Trần Văn Minh',
    email: 'minh.tran@medicare.vn',
    phone: '0912345678',
    role: 'doctor',
    status: 'active',
    createdAt: '2024-02-03',
    lastActiveAt: '2026-06-18',
  },
  {
    id: 'u-1003',
    fullName: 'Lê Hồng Phúc',
    email: 'phuc.le@medicare.vn',
    phone: '0923456789',
    role: 'doctor',
    status: 'active',
    createdAt: '2024-03-21',
    lastActiveAt: '2026-06-17',
  },
  {
    id: 'u-1004',
    fullName: 'Phạm Thu Hà',
    email: 'ha.pham@medicare.vn',
    phone: '0934567890',
    role: 'receptionist',
    status: 'active',
    createdAt: '2024-04-05',
    lastActiveAt: '2026-06-18',
  },
  {
    id: 'u-1005',
    fullName: 'Đỗ Quang Huy',
    email: 'huy.do@gmail.com',
    phone: '0945678901',
    role: 'patient',
    status: 'active',
    createdAt: '2024-05-19',
    lastActiveAt: '2026-06-16',
  },
  {
    id: 'u-1006',
    fullName: 'Vũ Thị Mai',
    email: 'mai.vu@gmail.com',
    phone: '0956789012',
    role: 'patient',
    status: 'inactive',
    createdAt: '2024-06-28',
    lastActiveAt: '2026-04-02',
  },
  {
    id: 'u-1007',
    fullName: 'Hoàng Văn Tú',
    email: 'tu.hoang@gmail.com',
    phone: '0967890123',
    role: 'patient',
    status: 'active',
    createdAt: '2024-07-14',
    lastActiveAt: '2026-06-15',
  },
  {
    id: 'u-1008',
    fullName: 'Bùi Khánh Linh',
    email: 'linh.bui@medicare.vn',
    phone: '0978901234',
    role: 'receptionist',
    status: 'suspended',
    createdAt: '2024-08-09',
    lastActiveAt: '2026-03-11',
  },
  {
    id: 'u-1009',
    fullName: 'Ngô Đức Thắng',
    email: 'thang.ngo@medicare.vn',
    phone: '0989012345',
    role: 'doctor',
    status: 'inactive',
    createdAt: '2024-09-22',
    lastActiveAt: '2026-05-01',
  },
  {
    id: 'u-1010',
    fullName: 'Đặng Phương Thảo',
    email: 'thao.dang@gmail.com',
    phone: '0990123456',
    role: 'patient',
    status: 'active',
    createdAt: '2024-10-30',
    lastActiveAt: '2026-06-18',
  },
  {
    id: 'u-1011',
    fullName: 'Phan Tấn Lộc',
    email: 'loc.phan@gmail.com',
    phone: '0901112223',
    role: 'patient',
    status: 'suspended',
    createdAt: '2025-01-08',
    lastActiveAt: '2026-02-20',
  },
  {
    id: 'u-1012',
    fullName: 'Trương Mỹ Duyên',
    email: 'duyen.truong@medicare.vn',
    phone: '0902223334',
    role: 'doctor',
    status: 'active',
    createdAt: '2025-02-17',
    lastActiveAt: '2026-06-17',
  },
];

export const ADMIN_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'a-1',
    actor: 'Trương Mỹ Duyên',
    action: 'đã xác nhận 4 lịch hẹn mới',
    timestamp: '2026-06-18T08:42:00',
    type: 'appointment',
  },
  {
    id: 'a-2',
    actor: 'Hệ thống',
    action: 'sao lưu dữ liệu định kỳ hoàn tất',
    timestamp: '2026-06-18T07:00:00',
    type: 'system',
  },
  {
    id: 'a-3',
    actor: 'Đỗ Quang Huy',
    action: 'thanh toán hóa đơn khám 450.000đ',
    timestamp: '2026-06-17T16:20:00',
    type: 'payment',
  },
  {
    id: 'a-4',
    actor: 'Phạm Thu Hà',
    action: 'tạo tài khoản bệnh nhân mới',
    timestamp: '2026-06-17T14:05:00',
    type: 'user',
  },
  {
    id: 'a-5',
    actor: 'Nguyễn Thị Lan',
    action: 'cập nhật phân quyền cho tài khoản lễ tân',
    timestamp: '2026-06-17T10:30:00',
    type: 'user',
  },
  {
    id: 'a-6',
    actor: 'Trần Văn Minh',
    action: 'hoàn tất 12 lượt khám trong ngày',
    timestamp: '2026-06-16T18:10:00',
    type: 'appointment',
  },
];

export const ADMIN_MONTHLY_SERIES: MonthlyPoint[] = [
  { month: 'T1', appointments: 2840, revenue: 1280, newUsers: 142 },
  { month: 'T2', appointments: 3120, revenue: 1410, newUsers: 168 },
  { month: 'T3', appointments: 3015, revenue: 1365, newUsers: 151 },
  { month: 'T4', appointments: 3480, revenue: 1590, newUsers: 187 },
  { month: 'T5', appointments: 3705, revenue: 1702, newUsers: 203 },
  { month: 'T6', appointments: 3912, revenue: 1840, newUsers: 221 },
];

export const ADMIN_ROLE_DISTRIBUTION: RoleDistribution[] = [
  { role: 'patient', label: ROLE_LABELS.patient, count: 1098 },
  { role: 'doctor', label: ROLE_LABELS.doctor, count: 64 },
  { role: 'receptionist', label: ROLE_LABELS.receptionist, count: 18 },
  { role: 'admin', label: ROLE_LABELS.admin, count: 4 },
];

export const ADMIN_REPORT_METRICS: ReportMetric[] = [
  { id: 'revenue', label: 'Doanh thu tháng', value: '1,84 tỷ', delta: '+8,1%', trend: 'up' },
  { id: 'appointments', label: 'Lượt khám', value: '3.912', delta: '+5,6%', trend: 'up' },
  { id: 'new-users', label: 'Người dùng mới', value: '221', delta: '+8,9%', trend: 'up' },
  { id: 'cancel-rate', label: 'Tỉ lệ hủy lịch', value: '4,2%', delta: '-1,3%', trend: 'down' },
];

export const ADMIN_TOP_SPECIALTIES: SpecialtyPerformance[] = [
  { id: 's-1', name: 'Tim mạch', appointments: 612, revenue: 384 },
  { id: 's-2', name: 'Nội tổng quát', appointments: 845, revenue: 296 },
  { id: 's-3', name: 'Nhi khoa', appointments: 528, revenue: 211 },
  { id: 's-4', name: 'Da liễu', appointments: 472, revenue: 189 },
  { id: 's-5', name: 'Tai mũi họng', appointments: 401, revenue: 154 },
];

// ─── Báo cáo & Thống kê chuyên sâu ─────────────────
export const ADMIN_REPORT_STATS: ReportStat[] = [
  {
    id: 'new-patients',
    label: 'Tổng bệnh nhân mới',
    value: '1,284',
    delta: '+12.5%',
    trend: 'up',
    icon: UserPlus,
    color: 'text-blue-600 bg-blue-50',
    progress: 75,
    barColor: 'bg-blue-500',
  },
  {
    id: 'revenue',
    label: 'Doanh thu dịch vụ',
    value: '2.45B VND',
    delta: '+8.2%',
    trend: 'up',
    icon: Wallet,
    color: 'text-emerald-600 bg-emerald-50',
    progress: 65,
    barColor: 'bg-emerald-500',
  },
  {
    id: 'supplies-used',
    label: 'Vật tư đã tiêu hao',
    value: '8,540',
    delta: '-2.1%',
    trend: 'down',
    icon: Boxes,
    color: 'text-rose-600 bg-rose-50',
    progress: 45,
    barColor: 'bg-rose-500',
  },
  {
    id: 'completion-rate',
    label: 'Tỷ lệ hoàn thành khám',
    value: '96.5%',
    delta: '98%',
    trend: 'up',
    icon: ClipboardCheck,
    color: 'text-violet-600 bg-violet-50',
    progress: 96,
    barColor: 'bg-violet-500',
  },
];

export const ADMIN_PATIENT_TREND: PatientTrendPoint[] = [
  { month: 'Th1', value: 2400 },
  { month: 'Th2', value: 2100 },
  { month: 'Th3', value: 3200 },
  { month: 'Th4', value: 4200 },
  { month: 'Th5', value: 3600 },
  { month: 'Th6', value: 4100 },
  { month: 'Th7', value: 3300 },
  { month: 'Th8', value: 3900 },
  { month: 'Th9', value: 4600 },
];

export const ADMIN_SPECIALTY_SHARE: SpecialtyShare[] = [
  { id: 'ss-1', name: 'Nội khoa', percent: 42, color: '#1a56db' },
  { id: 'ss-2', name: 'Ngoại khoa', percent: 28, color: '#10b981' },
  { id: 'ss-3', name: 'Nhi khoa', percent: 15, color: '#f59e0b' },
  { id: 'ss-4', name: 'Khác', percent: 15, color: '#cbd5e1' },
];

export const ADMIN_SPECIALTY_TOTAL = '8.5k';

export const ADMIN_SUPPLIES: SupplyItem[] = [
  { id: 'sp-1', code: 'MED-4502', name: 'Paracetamol 500mg', unit: 'Viên', stock: 12499, used: 3250, status: 'safe', trend: 'up' },
  { id: 'sp-2', code: 'SUP-1029', name: 'Găng tay phẫu thuật tiệt trùng', unit: 'Đôi', stock: 850, used: 1120, status: 'low', trend: 'up' },
  { id: 'sp-3', code: 'MED-9921', name: 'Amoxicillin 250mg', unit: 'Lọ', stock: 4120, used: 980, status: 'safe', trend: 'flat' },
  { id: 'sp-4', code: 'SUP-8843', name: 'Kim tiêm 5ml', unit: 'Cái', stock: 25000, used: 5600, status: 'safe', trend: 'up' },
];

export const ADMIN_SUPPLIES_TOTAL = 1450;

export const SUPPLY_STATUS_LABELS: Record<SupplyItem['status'], { label: string; className: string }> = {
  safe: { label: 'AN TOÀN', className: 'bg-emerald-100 text-emerald-700' },
  low: { label: 'SẮP HẾT', className: 'bg-rose-100 text-rose-700' },
};

export const DEFAULT_ADMIN_SETTINGS: AdminSettingsForm = {
  clinicName: 'Phòng khám Medicare',
  hotline: '1900 1234',
  supportEmail: 'hotro@medicare.vn',
  address: '12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP.HCM',
  openingTime: '07:00',
  closingTime: '20:00',
  appointmentSlotMinutes: 30,
  emailNotifications: true,
  smsNotifications: false,
  autoConfirmAppointments: true,
  maintenanceMode: false,
};
