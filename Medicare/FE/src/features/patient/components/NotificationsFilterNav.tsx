import React from 'react';
import { NotificationFilter } from '../types';

interface NotificationsFilterNavProps {
  activeFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
  counts: Record<NotificationFilter, number>;
}

const FILTERS: { id: NotificationFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'unread', label: 'Chưa đọc' },
  { id: 'appointment', label: 'Lịch hẹn' },
  { id: 'lab', label: 'Xét nghiệm' },
  { id: 'prescription', label: 'Thuốc' },
  { id: 'payment', label: 'Thanh toán' },
  { id: 'system', label: 'Hệ thống' },
];

const NotificationsFilterNav: React.FC<NotificationsFilterNavProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => (
  <div className="flex flex-wrap gap-2 p-1 bg-[#f8f9fb] border border-[#c3c6d6] rounded-lg">
    {FILTERS.map((filter) => {
      const isActive = activeFilter === filter.id;
      const count = counts[filter.id] ?? 0;
      if (filter.id !== 'all' && filter.id !== 'unread' && count === 0) return null;

      return (
        <button
          key={filter.id}
          type="button"
          onClick={() => onFilterChange(filter.id)}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            isActive
              ? 'bg-white text-[#003d9b] shadow-sm border border-[#c3c6d6]'
              : 'text-[#434654] hover:text-[#003d9b]'
          }`}
        >
          {filter.label}
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              isActive ? 'bg-[#003d9b]/10 text-[#003d9b]' : 'bg-[#edeef0] text-[#434654]'
            }`}
          >
            {count}
          </span>
        </button>
      );
    })}
  </div>
);

export default NotificationsFilterNav;
