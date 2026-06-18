import React, { useMemo, useState } from 'react';
import {
  CalendarPlus,
  CalendarX,
  CheckCheck,
  CheckCircle2,
  CreditCard,
  Inbox,
  LogIn,
  LucideIcon,
  MapPin,
  Settings,
} from 'lucide-react';
import { Card, Spinner } from '../../components/ui';
import Button from '../../components/ui/Button';

type Category = 'all' | 'appointment' | 'checkin' | 'payment';
type Day = 'today' | 'yesterday';

interface NotificationItem {
  id: number;
  category: Exclude<Category, 'all'> | 'system';
  day: Day;
  icon: LucideIcon;
  tone: 'green' | 'blue' | 'gray' | 'red';
  title: string;
  time: string;
  body: string;
  unread?: boolean;
  actions?: boolean;
}

const CATEGORIES: { key: Category; label: string; count: number; icon: LucideIcon }[] = [
  { key: 'all', label: 'Tất cả', count: 12, icon: Inbox },
  { key: 'appointment', label: 'Lịch hẹn mới', count: 5, icon: CalendarPlus },
  { key: 'checkin', label: 'BN Check-in', count: 3, icon: LogIn },
  { key: 'payment', label: 'Thanh toán', count: 4, icon: CreditCard },
];

const TONE_STYLES: Record<NotificationItem['tone'], string> = {
  green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40',
  gray: 'bg-gray-100 text-gray-500 dark:bg-slate-700',
  red: 'bg-red-100 text-red-600 dark:bg-red-950/40',
};

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    category: 'appointment',
    day: 'today',
    icon: CalendarPlus,
    tone: 'green',
    title: 'Lịch hẹn mới: BN Trần Văn Khải',
    time: '10:45 AM',
    body: 'Bệnh nhân đã đặt lịch khám chuyên khoa Tim mạch vào lúc 14:30 ngày 25/10. Vui lòng xác nhận phòng khám.',
    unread: true,
    actions: true,
  },
  {
    id: 2,
    category: 'checkin',
    day: 'today',
    icon: MapPin,
    tone: 'blue',
    title: 'BN Check-in: Lê Thị Mai',
    time: '09:15 AM',
    body: 'Bệnh nhân đã có mặt tại sảnh chờ. Số thứ tự: 104. Phân loại: Khám định kỳ.',
    unread: true,
  },
  {
    id: 3,
    category: 'payment',
    day: 'today',
    icon: CheckCircle2,
    tone: 'green',
    title: 'Thanh toán thành công: HĐ #MD-9921',
    time: '08:30 AM',
    body: 'Giao dịch 2.450.000 VNĐ cho bệnh nhân Phạm Minh Đức đã được hệ thống xử lý hoàn tất.',
  },
  {
    id: 4,
