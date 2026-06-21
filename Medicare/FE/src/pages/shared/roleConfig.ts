import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Settings,
  BarChart3,
  Bell,
  CreditCard,
  Star,
  UserCircle,
  Receipt,
  ListOrdered,
  Stethoscope,
  Building2,
  DoorOpen,
  History,
  LucideIcon,
} from 'lucide-react';
import { User } from '../../types';

export type AppRole = User['role'];

/** Shared personal profile page for all roles */
export const PROFILE_PATH = '/ho-so';

export const ROLE_PATHS: Record<AppRole, string> = {
  patient: '/patient',
  doctor: '/doctor',
  receptionist: '/receptionist',
  admin: '/admin',
};

export const ROLE_LABELS: Record<AppRole, string> = {
  patient: 'Bệnh nhân',
  doctor: 'Quản lý bệnh viện',
  receptionist: 'Lễ tân',
  admin: 'Quản trị viên',
};

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const ROLE_NAV_ITEMS: Record<AppRole, NavItem[]> = {
  patient: [
    { label: 'Tổng quan', path: '/patient', icon: LayoutDashboard },
    { label: 'Đặt lịch khám', path: '/patient/lich-hen', icon: Calendar },
    { label: 'Hồ sơ bệnh án', path: '/patient/ho-so', icon: FileText },
    { label: 'Thông báo', path: '/patient/thong-bao', icon: Bell },
    { label: 'Thanh toán', path: '/patient/thanh-toan', icon: CreditCard },
    { label: 'Đánh giá dịch vụ', path: '/patient/danh-gia', icon: Star },
  ],
  doctor: [
    { label: 'Tổng quan', path: '/doctor', icon: LayoutDashboard },
    { label: 'Lịch hẹn hôm nay', path: '/doctor/lich-kham', icon: Calendar },
    { label: 'Danh sách bệnh nhân', path: '/doctor/benh-nhan', icon: Users },
    { label: 'Hồ sơ bệnh án', path: '/doctor/benh-an', icon: FileText },
    { label: 'Cài đặt', path: '/doctor/cai-dat', icon: Settings },
  ],
  receptionist: [
    { label: 'Tổng quan', path: '/receptionist', icon: LayoutDashboard },
    { label: 'Lịch hẹn', path: '/receptionist/lich-hen', icon: Calendar },
    { label: 'Bệnh nhân', path: '/receptionist/benh-nhan', icon: Users },
    { label: 'Hàng chờ', path: '/receptionist/hang-cho', icon: ListOrdered },
    { label: 'Thanh toán', path: '/receptionist/thanh-toan', icon: CreditCard },
    { label: 'Hóa đơn', path: '/receptionist/hoa-don', icon: Receipt },
    { label: 'Thông báo', path: '/receptionist/thong-bao', icon: Bell },
    { label: 'Hồ sơ cá nhân', path: '/receptionist/ho-so', icon: UserCircle },
  ],
  admin: [
    { label: 'Trang chủ', path: '/admin', icon: LayoutDashboard },
    { label: 'Quản lý người dùng', path: '/admin/nguoi-dung', icon: Users },
    { label: 'Quản lý bác sĩ', path: '/admin/bac-si', icon: Stethoscope },
    { label: 'Quản lý khoa', path: '/admin/khoa', icon: Building2 },
    { label: 'Quản lý phòng', path: '/admin/phong', icon: DoorOpen },
    { label: 'Quản lý lịch hẹn', path: '/admin/lich-hen', icon: Calendar },
    { label: 'Quản lý đánh giá', path: '/admin/danh-gia', icon: Star },
    { label: 'Báo cáo thống kê', path: '/admin/bao-cao', icon: BarChart3 },
    { label: 'Nhật ký hệ thống', path: '/admin/nhat-ky', icon: History },
  ],
};

export const getRoleDashboardPath = (role?: string | null): string => {
  if (role && role in ROLE_PATHS) {
    return ROLE_PATHS[role as AppRole];
  }
  return ROLE_PATHS.patient;
};

export const getRoleSettingsPath = (role?: string | null): string => {
  if (role === 'doctor') return '/doctor/cai-dat';
  if (role === 'admin') return '/admin/cai-dat';
  if (role === 'receptionist') return '/receptionist/ho-so';
  return '/cai-dat';
};

export const getRoleProfilePath = (): string => PROFILE_PATH;
