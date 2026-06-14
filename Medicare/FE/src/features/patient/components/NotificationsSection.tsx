import React from 'react';
import { Bell, Calendar, FlaskConical } from 'lucide-react';
import { DashboardNotification } from '../types';

interface NotificationsSectionProps {
  notifications: DashboardNotification[];
  onMarkAllRead?: () => void;
}

const iconConfig: Record<DashboardNotification['type'], { icon: React.ElementType; bg: string; color: string }> = {
  lab: { icon: FlaskConical, bg: 'bg-[rgba(0,82,204,0.2)]', color: 'text-[#003d9b]' },
  appointment: { icon: Calendar, bg: 'bg-[rgba(130,249,190,0.2)]', color: 'text-[#006c47]' },
  system: { icon: Bell, bg: 'bg-[rgba(176,35,0,0.1)]', color: 'text-[#ba1a1a]' },
};

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ notifications, onMarkAllRead }) => (
  <div className="bg-white border border-[rgba(195,198,214,0.3)] rounded-lg shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-[rgba(195,198,214,0.3)]">
      <h2 className="text-base font-semibold text-[#191c1e]">Thông báo của bạn</h2>
      <p className="text-xs text-[#737685] mt-0.5">Cập nhật liên quan đến lịch khám và sức khỏe</p>
    </div>
    <div className="p-6 flex flex-col gap-4">
      {notifications.map((notif) => {
        const { icon: Icon, bg, color } = iconConfig[notif.type];
        return (
          <div
            key={notif.id}
            className={`flex gap-4 p-4 rounded-lg ${notif.isUnread ? 'bg-[rgba(0,82,204,0.05)]' : ''}`}
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div className="min-w-0">
              <p className="text-base text-[#191c1e] leading-5">{notif.title}</p>
              <p className="text-base text-[#737685] mt-1">{notif.timeAgo}</p>
            </div>
          </div>
        );
      })}
    </div>
    <div className="px-6 pb-6">
      <button
        type="button"
        onClick={onMarkAllRead}
        className="w-full py-2 bg-[#edeef0] text-[#1a56db] rounded text-base hover:bg-[#e0e2e6] transition-colors"
      >
        Đánh dấu tất cả đã đọc
      </button>
    </div>
  </div>
);

export default NotificationsSection;
