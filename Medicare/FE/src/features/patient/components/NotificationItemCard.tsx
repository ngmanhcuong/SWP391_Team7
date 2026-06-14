import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Calendar,
  ChevronRight,
  FlaskConical,
  Pill,
  Receipt,
} from 'lucide-react';
import { NotificationType, PatientNotification } from '../types';

interface NotificationItemCardProps {
  notification: PatientNotification;
  onMarkRead: (id: string) => void;
}

const iconConfig: Record<
  NotificationType,
  { icon: React.ElementType; bg: string; color: string }
> = {
  lab: { icon: FlaskConical, bg: 'bg-[rgba(176,35,0,0.1)]', color: 'text-[#b02300]' },
  appointment: { icon: Calendar, bg: 'bg-[rgba(130,249,190,0.2)]', color: 'text-[#006c47]' },
  prescription: { icon: Pill, bg: 'bg-[rgba(0,82,204,0.1)]', color: 'text-[#003d9b]' },
  payment: { icon: Receipt, bg: 'bg-[rgba(255,218,214,0.3)]', color: 'text-[#ba1a1a]' },
  system: { icon: Bell, bg: 'bg-[#edeef0]', color: 'text-[#434654]' },
};

const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  notification,
  onMarkRead,
}) => {
  const { icon: Icon, bg, color } = iconConfig[notification.type];

  const handleClick = () => {
    if (notification.isUnread) {
      onMarkRead(notification.id);
    }
  };

  return (
    <article
      className={`relative rounded-lg border bg-white p-5 transition-colors ${
        notification.isUnread
          ? 'border-[#003d9b]/30 bg-[rgba(0,82,204,0.03)]'
          : 'border-[#c3c6d6]'
      }`}
    >
      {notification.isUnread && (
        <span className="absolute top-5 right-5 h-2.5 w-2.5 rounded-full bg-[#003d9b]" aria-hidden />
      )}

      <div className="flex gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}>
          <Icon size={20} className={color} />
        </div>

        <div className="min-w-0 flex-1 space-y-2 pr-6">
          <div>
            <h3 className="text-base font-medium text-[#191c1e]">{notification.title}</h3>
            <p className="text-sm text-[#434654] mt-1 leading-relaxed">{notification.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-[#737685]">{notification.timeAgo}</span>
            {notification.action && (
              <Link
                to={notification.action.href}
                onClick={handleClick}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#003d9b] hover:underline"
              >
                {notification.action.label}
                <ChevronRight size={14} />
              </Link>
            )}
            {notification.isUnread && !notification.action && (
              <button
                type="button"
                onClick={handleClick}
                className="text-sm font-medium text-[#003d9b] hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default NotificationItemCard;
