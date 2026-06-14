import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, ChevronRight, FlaskConical } from 'lucide-react';
import { DashboardNotification } from '../types';

interface NotificationsSectionProps {
  notifications: DashboardNotification[];
  onMarkAllRead?: () => void;
}

const iconConfig: Record<DashboardNotification['type'], { icon: React.ElementType; bg: string; color: string }> = {
  lab: { icon: FlaskConical, bg: 'bg-orange-50 ring-1 ring-orange-100', color: 'text-[#b02300]' },
  appointment: { icon: Calendar, bg: 'bg-emerald-50 ring-1 ring-emerald-100', color: 'text-[#006c47]' },
  system: { icon: Bell, bg: 'bg-blue-50 ring-1 ring-blue-100', color: 'text-[#003d9b]' },
};

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ notifications, onMarkAllRead }) => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
    <div className="px-6 py-5 border-b border-[#c3c6d6]/40 bg-gradient-to-r from-[#f8f9fb] to-white flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-[#191c1e]">Thông báo của bạn</h2>
        <p className="text-xs text-[#737685] mt-0.5">Cập nhật lịch khám và sức khỏe</p>
      </div>
      <Link
        to="/patient/thong-bao"
        className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#003d9b] hover:underline shrink-0"
      >
        Xem tất cả
        <ChevronRight size={14} />
      </Link>
    </div>

    <div className="p-4 flex flex-col gap-2">
      {notifications.map((notif) => {
        const { icon: Icon, bg, color } = iconConfig[notif.type];
        return (
          <Link
            key={notif.id}
            to="/patient/thong-bao"
            className={`relative flex gap-3 p-3.5 rounded-xl transition-all hover:bg-[#f8f9fb] hover:shadow-sm ${
              notif.isUnread ? 'bg-[#003d9b]/[0.04] ring-1 ring-[#003d9b]/10' : 'bg-transparent'
            }`}
          >
            {notif.isUnread && (
              <span className="absolute top-3.5 right-3.5 h-2 w-2 rounded-full bg-[#003d9b]" />
            )}
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div className="min-w-0 pr-4">
              <p className="text-sm font-medium text-[#191c1e] leading-snug line-clamp-2">{notif.title}</p>
              <p className="text-xs text-[#737685] mt-1">{notif.timeAgo}</p>
            </div>
          </Link>
        );
      })}
    </div>

    <div className="px-4 pb-4">
      <button
        type="button"
        onClick={onMarkAllRead}
        className="w-full py-2.5 rounded-xl bg-[#f8f9fb] text-sm font-medium text-[#003d9b] hover:bg-[#edeef0] transition-colors ring-1 ring-[#c3c6d6]/60"
      >
        Đánh dấu tất cả đã đọc
      </button>
    </div>
  </div>
);

export default NotificationsSection;
