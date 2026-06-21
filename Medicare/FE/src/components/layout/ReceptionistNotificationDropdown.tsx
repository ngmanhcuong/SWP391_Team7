import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CalendarPlus,
  CalendarX,
  CheckCircle2,
  LucideIcon,
  MapPin,
  Settings,
} from 'lucide-react';

interface ReceptionistNotification {
  id: number;
  icon: LucideIcon;
  bg: string;
  color: string;
  title: string;
  message: string;
  timeAgo: string;
  unread: boolean;
}

const NOTIFICATIONS: ReceptionistNotification[] = [
  {
    id: 1,
    icon: CalendarPlus,
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
    title: 'Lịch hẹn mới: BN Trần Văn Khải',
    message: 'Đặt lịch khám Tim mạch lúc 14:30 ngày 25/10. Vui lòng xác nhận phòng khám.',
    timeAgo: '5 phút trước',
    unread: true,
  },
  {
    id: 2,
    icon: MapPin,
    bg: 'bg-blue-50',
    color: 'text-[#2563eb]',
    title: 'BN Check-in: Lê Thị Mai',
    message: 'Bệnh nhân đã có mặt tại sảnh chờ. Số thứ tự: 104.',
    timeAgo: '20 phút trước',
    unread: true,
  },
  {
    id: 3,
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    color: 'text-emerald-600',
    title: 'Thanh toán thành công: HĐ #MD-9921',
    message: 'Giao dịch 2.450.000 VNĐ cho BN Phạm Minh Đức đã hoàn tất.',
    timeAgo: '1 giờ trước',
    unread: true,
  },
  {
    id: 4,
    icon: CalendarX,
    bg: 'bg-rose-50',
    color: 'text-rose-600',
    title: 'Lịch hẹn bị hủy: Nguyễn An',
    message: 'Bệnh nhân đã hủy lịch khám lúc 17:00 do bận việc đột xuất.',
    timeAgo: 'Hôm qua',
    unread: false,
  },
  {
    id: 5,
    icon: Settings,
    bg: 'bg-slate-100',
    color: 'text-slate-600',
    title: 'Bảo trì hệ thống định kỳ',
    message: 'Hệ thống tạm ngưng để cập nhật từ 02:00 đến 04:00 sáng mai.',
    timeAgo: 'Hôm qua',
    unread: false,
  },
];

const ReceptionistNotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = useMemo(
    () => NOTIFICATIONS.filter((notif) => notif.unread && !readIds.has(notif.id)).length,
    [readIds],
  );

  const markRead = (id: number) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const markAllRead = () => {
    setReadIds(new Set(NOTIFICATIONS.map((notif) => notif.id)));
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`relative p-2 rounded-lg transition-colors ${
          open ? 'bg-blue-50 text-[#2563eb]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }`}
        aria-label="Thông báo"
        aria-expanded={open}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(380px,calc(100vw-2rem))] bg-white border border-slate-200/70 rounded-2xl shadow-xl shadow-blue-500/10 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div>
              <p className="text-sm font-bold text-slate-900">Thông báo</p>
              <p className="text-[11px] text-slate-500">
                {unreadCount > 0 ? `${unreadCount} chưa đọc` : 'Đã xem hết'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-semibold text-[#2563eb] hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <ul className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
            {NOTIFICATIONS.map((notif) => {
              const Icon = notif.icon;
              const isUnread = notif.unread && !readIds.has(notif.id);
              return (
                <li key={notif.id}>
                  <button
                    type="button"
                    onClick={() => markRead(notif.id)}
                    className={`w-full text-left flex gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50 ${
                      isUnread ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${notif.bg}`}>
                      <Icon size={16} className={notif.color} />
                    </span>
                    <span className="min-w-0 flex-1 pr-2">
                      <span className="flex items-start gap-2">
                        <span className="text-sm font-semibold text-slate-900 leading-snug">{notif.title}</span>
                        {isUnread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2563eb]" />}
                      </span>
                      <span className="block text-xs text-slate-600 mt-1 line-clamp-2">{notif.message}</span>
                      <span className="block text-[11px] text-slate-400 mt-1">{notif.timeAgo}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <Link
              to="/receptionist/thong-bao"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-[#2563eb] hover:underline"
            >
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistNotificationDropdown;
