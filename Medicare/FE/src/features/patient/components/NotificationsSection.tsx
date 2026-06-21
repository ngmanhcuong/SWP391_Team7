import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, ChevronRight, FlaskConical } from 'lucide-react';
import { DashboardNotification } from '../types';

interface NotificationsSectionProps {
  notifications: DashboardNotification[];
  onMarkAllRead?: () => void;
}

const iconConfig: Record<DashboardNotification['type'], { icon: React.ElementType; bg: string; color: string }> = {
  lab: { icon: FlaskConical, bg: 'bg-violet-50 ring-1 ring-violet-100', color: 'text-violet-600' },
  appointment: { icon: Calendar, bg: 'bg-emerald-50 ring-1 ring-emerald-100', color: 'text-emerald-600' },
  system: { icon: Bell, bg: 'bg-blue-50 ring-1 ring-blue-100', color: 'text-[#2563eb]' },
};

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ notifications, onMarkAllRead }) => (
  <div className="bg-white border border-slate-200/70 rounded-[24px] shadow-soft overflow-hidden">
    <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100">
          <Bell size={18} className="text-amber-500" />
        </span>
        <div>
          <h2 className="text-base font-bold text-slate-900">Hoạt động gần đây</h2>
          <p className="text-xs text-slate-500 mt-0.5">Cập nhật lịch khám và sức khỏe</p>
        </div>
      </div>
      <Link
        to="/patient/thong-bao"
        className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#2563eb] hover:underline shrink-0"
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
            className={`relative flex gap-3 p-3.5 rounded-xl transition-all hover:bg-slate-50 hover:shadow-sm ${
              notif.isUnread ? 'bg-[#2563eb]/[0.04] ring-1 ring-[#2563eb]/10' : 'bg-transparent'
            }`}
          >
            {notif.isUnread && (
              <span className="absolute top-3.5 right-3.5 h-2 w-2 rounded-full bg-[#2563eb]" />
            )}
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div className="min-w-0 pr-4">
              <p className="text-sm font-medium text-slate-900 leading-snug line-clamp-2">{notif.title}</p>
              <p className="text-xs text-slate-400 mt-1">{notif.timeAgo}</p>
            </div>
          </Link>
        );
      })}
    </div>

    <div className="px-4 pb-4">
      <button
        type="button"
        onClick={onMarkAllRead}
        className="w-full py-2.5 rounded-xl bg-slate-50 text-sm font-medium text-[#2563eb] hover:bg-slate-100 transition-colors ring-1 ring-slate-200/70"
      >
        Đánh dấu tất cả đã đọc
      </button>
    </div>
  </div>
);

export default NotificationsSection;
