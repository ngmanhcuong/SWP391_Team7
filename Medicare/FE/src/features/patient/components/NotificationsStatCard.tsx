import React from 'react';
import { Bell, Calendar, FlaskConical, Receipt } from 'lucide-react';
import { NotificationStat, NotificationFilter } from '../types';

const ICON_MAP = {
  calendar: Calendar,
  bell: Bell,
  flask: FlaskConical,
  receipt: Receipt,
  clock: Bell,
};

interface NotificationsStatCardProps {
  stat: NotificationStat;
  isActive: boolean;
  onSelect: (filter: NotificationFilter) => void;
}

const NotificationsStatCard: React.FC<NotificationsStatCardProps> = ({
  stat,
  isActive,
  onSelect,
}) => {
  const Icon = ICON_MAP[stat.icon];

  return (
    <button
      type="button"
      onClick={() => onSelect(stat.filter)}
      className={`text-left bg-white border rounded-lg shadow-sm p-6 flex flex-col gap-2 transition-all w-full ${
        isActive
          ? 'border-[#003d9b] ring-2 ring-[#003d9b]/15'
          : 'border-[rgba(195,198,214,0.3)] hover:border-[#003d9b]/40'
      }`}
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.iconBg}`}>
        <Icon size={20} className="text-[#003d9b]" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-[#434654] leading-5">{stat.label}</p>
        <p className="text-[32px] font-semibold text-[#191c1e] leading-10 tracking-tight">
          {stat.value}
        </p>
      </div>
    </button>
  );
};

export default NotificationsStatCard;
