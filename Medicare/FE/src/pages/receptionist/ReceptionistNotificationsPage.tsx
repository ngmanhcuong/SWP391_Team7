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
    category: 'system',
    day: 'yesterday',
    icon: Settings,
    tone: 'gray',
    title: 'Bảo trì hệ thống định kỳ',
    time: '23:00 PM',
    body: 'Hệ thống sẽ tạm ngưng để cập nhật dữ liệu từ 02:00 đến 04:00 sáng mai. Vui lòng lưu các thay đổi trước khi kết thúc ca làm việc.',
  },
  {
    id: 5,
    category: 'appointment',
    day: 'yesterday',
    icon: CalendarX,
    tone: 'red',
    title: 'Lịch hẹn bị hủy: Nguyễn An',
    time: '16:40 PM',
    body: 'Bệnh nhân đã hủy lịch khám lúc 17:00 do bận việc đột xuất. Hệ thống đã tự động cập nhật trạng thái giường trống.',
  },
];

const DAY_LABELS: Record<Day, string> = { today: 'Hôm nay', yesterday: 'Hôm qua' };

const NotificationRow: React.FC<{ item: NotificationItem; read: boolean }> = ({ item, read }) => {
  const Icon = item.icon;
  const isUnread = item.unread && !read;
  return (
    <div
      className={`flex gap-3 rounded-xl border p-4 transition-colors ${
        isUnread
          ? 'border-l-4 border-l-[#1a56db] border-y-gray-100 border-r-gray-100 dark:border-y-slate-700 dark:border-r-slate-700 bg-white dark:bg-slate-800'
          : 'border-gray-100 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-800/40'
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TONE_STYLES[item.tone]}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className={`font-semibold ${isUnread ? 'text-[#1a56db]' : 'text-gray-700 dark:text-slate-200'}`}>
            {item.title}
          </p>
          <span className="shrink-0 text-xs text-gray-400">{item.time}</span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{item.body}</p>
        {item.actions && !read && (
          <div className="mt-3 flex gap-2">
            <Button size="sm">Xác nhận ngay</Button>
            <Button size="sm" variant="ghost" className="bg-gray-100 dark:bg-slate-700">
              Chi tiết
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const ReceptionistNotificationsPage: React.FC = () => {
  const [category, setCategory] = useState<Category>('all');
  const [allRead, setAllRead] = useState(false);

  const filtered = useMemo(
    () => (category === 'all' ? NOTIFICATIONS : NOTIFICATIONS.filter((n) => n.category === category)),
    [category],
  );

  const days: Day[] = ['today', 'yesterday'];

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
            Thông báo hệ thống
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Quản lý và cập nhật các thông tin vận hành bệnh viện thời gian thực.
          </p>
        </div>
        <Button leftIcon={<CheckCheck size={16} />} onClick={() => setAllRead(true)}>
          Đánh dấu tất cả đã đọc
