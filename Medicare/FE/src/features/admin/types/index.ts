import { LucideIcon } from 'lucide-react';

export type AdminUserRole = 'patient' | 'doctor' | 'receptionist' | 'admin';

export type AdminUserStatus = 'active' | 'inactive' | 'suspended';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  createdAt: string;
  lastActiveAt: string;
}

export type ActivityType = 'user' | 'appointment' | 'system' | 'payment';

export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  type: ActivityType;
}

export type TrendDirection = 'up' | 'down' | 'flat';

export interface AdminDashboardStat {
  id: string;
  label: string;
  value: string;
  unit?: string;
  delta: string;
  trend: TrendDirection;
  icon: LucideIcon;
  color: string;
  highlight?: boolean;
}

export interface AppointmentTrendPoint {
  month: string;
  patients: number;
  appointments: number;
}

export type NewAppointmentStatus = 'confirmed' | 'pending';

export interface NewAppointment {
  id: string;
  patientName: string;
  service: string;
  time: string;
  status: NewAppointmentStatus;
  avatar?: string;
}

export type SystemNoticeLevel = 'warning' | 'info';

export interface SystemNotice {
  id: string;
  title: string;
  detail: string;
  timeAgo: string;
  level: SystemNoticeLevel;
}

export interface TopDepartment {
  id: string;
  rank: number;
  name: string;
  revenueLabel: string;
  revenue: number;
}

export interface QuarterlyGoal {
  title: string;
  percent: number;
  description: string;
}

export interface AdminSectionStat {
  id: string;
  label: string;
  value: string;
  note?: string;
  noteTone?: 'up' | 'muted' | 'danger';
  icon: LucideIcon;
  color: string;
}

export type DoctorStatus = 'working' | 'on_leave';

export interface AdminDoctor {
  id: string;
  fullName: string;
  avatar?: string;
  email: string;
  phone: string;
  userId?: string;
  hasAccount: boolean;
  specialty: string;
  experienceYears: number;
  status: DoctorStatus;
}

export type RoomStatus = 'available' | 'in_use' | 'maintenance';

export interface AdminRoom {
  id: string;
  name: string;
  department: string;
  status: RoomStatus;
}

export interface AdminDepartment {
  id: string;
  name: string;
  description: string;
  doctorCount: number;
  color: string;
}

export type ReviewStatus = 'visible' | 'hidden';

export interface AdminReview {
  id: string;
  patientName: string;
  patientCode: string;
  anonymous?: boolean;
  doctorName: string;
  department: string;
  rating: number;
  content: string;
  date: string;
  flagged?: boolean;
  status: ReviewStatus;
}

export interface AdminProfileForm {
  fullName: string;
  employeeId: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
}

export type AuditActionType = 'create' | 'update' | 'booking' | 'payment' | 'backup';

export interface AuditLogEntry {
  id: string;
  time: string;
  timeAgo: string;
  createdAt?: string;
  actorName: string;
  actorRole: string;
  actorInitials: string;
  actorColor: string;
  action: string;
  actionType: AuditActionType;
  target: string;
  ip: string;
}

export interface AuditSummary {
  id: string;
  label: string;
  value: string;
  note: string;
  noteTone: 'up' | 'danger';
  icon: LucideIcon;
  bg: string;
  iconColor: string;
}

export interface ReportStat {
  id: string;
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  color: string;
  highlight?: boolean;
  /** Tỷ lệ thanh tiến độ dưới thẻ (0-100) */
  progress?: number;
  /** Màu thanh tiến độ */
  barColor?: string;
}

export interface PatientTrendPoint {
  month: string;
  value: number;
}

export interface SpecialtyShare {
  id: string;
  name: string;
  percent: number;
  color: string;
}

export type SupplyStatus = 'safe' | 'low';

export interface SupplyItem {
  id: string;
  code: string;
  name: string;
  unit: string;
  stock: number;
  used: number;
  status: SupplyStatus;
  trend: 'up' | 'down' | 'flat';
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface AdminAppointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientInitials: string;
  doctorName: string;
  doctorDept: string;
  date: string;
  timeRange: string;
  status: AppointmentStatus;
}

export interface ReportMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: TrendDirection;
}

export interface MonthlyPoint {
  month: string;
  appointments: number;
  revenue: number;
  newUsers: number;
}

export interface RoleDistribution {
  role: AdminUserRole;
  label: string;
  count: number;
}

export interface SpecialtyPerformance {
  id: string;
  name: string;
  appointments: number;
  revenue: number;
}

export interface AdminSettingsForm {
  clinicName: string;
  hotline: string;
  supportEmail: string;
  address: string;
  openingTime: string;
  closingTime: string;
  appointmentSlotMinutes: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoConfirmAppointments: boolean;
  maintenanceMode: boolean;
}
