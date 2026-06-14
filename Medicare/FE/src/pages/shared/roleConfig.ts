import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Stethoscope,
  ClipboardList,
  Settings,
  BarChart3,
  UserCog,
  Bell,
  CreditCard,
  Star,
  LucideIcon,
} from 'lucide-react';
import { User } from '../../types';

export type AppRole = User['role'];

export const ROLE_PATHS: Record<AppRole, string> = {
  patient: '/patient',
  doctor: '/doctor',
  receptionist: '/receptionist',
  admin: '/admin',
};

export const ROLE_LABELS: Record<AppRole, string> = {
  patient: 'Bệnh nhân',
  doctor: 'Bác sĩ',
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
    { label: 'Lịch hẹn', path: '/patient/lich-hen', icon: Calendar },
    { label: 'Hồ sơ bệnh án', path: '/patient/ho-so', icon: FileText },
    { label: 'Thông báo', path: '/patient/thong-bao', icon: Bell },
    { label: 'Thanh toán', path: '/patient/thanh-toan', icon: CreditCard },
    { label: 'Đánh giá dịch vụ', path: '/patient/danh-gia', icon: Star },
  ],
  doctor: [
    { label: 'Tổng quan', path: '/doctor', icon: LayoutDashboard },
    { label: 'Lịch khám', path: '/doctor/lich-kham', icon: Calendar },
    { label: 'Bệnh nhân', path: '/doctor/benh-nhan', icon: Users },
    { label: 'Hồ sơ bệnh án', path: '/doctor/benh-an', icon: Stethoscope },
  ],
  receptionist: [
    { label: 'Tổng quan', path: '/receptionist', icon: LayoutDashboard },
    { label: 'Tiếp nhận', path: '/receptionist/tiep-nhan', icon: ClipboardList },
    { label: 'Lịch hẹn', path: '/receptionist/lich-hen', icon: Calendar },
    { label: 'Bệnh nhân', path: '/receptionist/benh-nhan', icon: Users },
  ],
  admin: [
    { label: 'Tổng quan', path: '/admin', icon: LayoutDashboard },
    { label: 'Người dùng', path: '/admin/nguoi-dung', icon: UserCog },
    { label: 'Báo cáo', path: '/admin/bao-cao', icon: BarChart3 },
    { label: 'Cài đặt', path: '/admin/cai-dat', icon: Settings },
  ],
};

export const getRoleDashboardPath = (role?: string | null): string => {
  if (role && role in ROLE_PATHS) {
    return ROLE_PATHS[role as AppRole];
  }
  return ROLE_PATHS.patient;
};
