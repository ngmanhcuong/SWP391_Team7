import {
  LayoutDashboard,
  Calendar,
  FileText,
  Bell,
  CreditCard,
  Star,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { ROUTES } from './routes';

/** Menu chính — sắp xếp theo luồng sử dụng của bệnh nhân */
export const SIDEBAR_MAIN_GROUPS = [
  {
    id: 'main',
    items: [{ label: 'Tổng quan', path: ROUTES.HOME, icon: LayoutDashboard, end: true }],
  },
  {
    id: 'care',
    title: 'Khám chữa bệnh',
    items: [
      { label: 'Lịch hẹn', path: ROUTES.APPOINTMENTS, icon: Calendar },
      { label: 'Hồ sơ bệnh án', path: ROUTES.RECORDS, icon: FileText },
    ],
  },
  {
    id: 'account',
    title: 'Tài khoản & hỗ trợ',
    items: [
      { label: 'Thanh toán', path: ROUTES.PAYMENTS, icon: CreditCard },
      { label: 'Thông báo', path: ROUTES.NOTIFICATIONS, icon: Bell },
      { label: 'Đánh giá dịch vụ', path: ROUTES.REVIEWS, icon: Star },
    ],
  },
];

export const SIDEBAR_FOOTER_ITEMS = [
  { label: 'Cài đặt', path: ROUTES.SETTINGS, icon: Settings },
  { label: 'Trợ giúp', path: ROUTES.HELP, icon: HelpCircle },
];
