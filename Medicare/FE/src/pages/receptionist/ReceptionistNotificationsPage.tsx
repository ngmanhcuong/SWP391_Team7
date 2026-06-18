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
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Left filters */}
        <div className="space-y-4">
          <Card padding="sm">
            <h2 className="text-sm font-semibold mb-3">Phân loại</h2>
            <div className="space-y-1">
              {CATEGORIES.map(({ key, label, count, icon: Icon }) => {
                const active = category === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-blue-50 text-[#1a56db] dark:bg-blue-950/40'
                        : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/40'
                    }`}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                    <span
                      className={`min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-xs font-semibold ${
                        active ? 'bg-[#1a56db] text-white' : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card padding="sm">
            <h2 className="text-sm font-semibold mb-3">Ưu tiên</h2>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-950/40">
                Khẩn cấp
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-slate-700 dark:text-slate-300">
                Bình thường
              </span>
            </div>
          </Card>
        </div>

        {/* Feed */}
        <div className="space-y-5">
          {days.map((day) => {
            const items = filtered.filter((n) => n.day === day);
            if (items.length === 0) return null;
            return (
              <div key={day} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {DAY_LABELS[day]}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-[#1a56db]/40 to-transparent" />
                </div>
                {items.map((item) => (
                  <NotificationRow key={item.id} item={item} read={allRead} />
                ))}
              </div>
            );
          })}

          <div className="flex flex-col items-center gap-2 py-4 text-gray-400">
            <Spinner size="sm" />
            <span className="text-sm">Đang tải thêm thông báo...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistNotificationsPage;
