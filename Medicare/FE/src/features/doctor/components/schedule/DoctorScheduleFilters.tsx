import React from 'react';
import { RefreshCw } from 'lucide-react';
import { ScheduleTimeFilter, TodayAppointmentStatus } from '../../types';

interface DoctorScheduleFiltersProps {
  activeStatus: TodayAppointmentStatus | 'all';
  activeTimeSlot: ScheduleTimeFilter;
  statusCounts: Record<TodayAppointmentStatus | 'all', number>;
  onStatusChange: (status: TodayAppointmentStatus | 'all') => void;
  onTimeSlotChange: (slot: ScheduleTimeFilter) => void;
  onRefresh: () => void;
}

const STATUS_FILTERS: { id: TodayAppointmentStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Hoạt động' },
  { id: 'waiting', label: 'Chờ khám' },
  { id: 'confirmed', label: 'Đã xác nhận' },
  { id: 'completed', label: 'Hoàn thành' },
  { id: 'cancelled', label: 'Đã hủy' },
];

const TIME_OPTIONS: { value: ScheduleTimeFilter; label: string }[] = [
  { value: 'all', label: 'Cả ngày' },
  { value: 'morning', label: 'Buổi sáng (08:00 - 12:00)' },
  { value: 'afternoon', label: 'Buổi chiều (13:30 - 17:30)' },
  { value: 'evening', label: 'Buổi tối (18:00 - 21:00)' },
];

const DoctorScheduleFilters: React.FC<DoctorScheduleFiltersProps> = ({
  activeStatus,
  activeTimeSlot,
  statusCounts,
  onStatusChange,
  onTimeSlotChange,
  onRefresh,
}) => (
  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex flex-wrap gap-2">
      {STATUS_FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onStatusChange(filter.id)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors ${
            activeStatus === filter.id
              ? 'bg-[#003d9b] text-white border-[#003d9b]'
              : 'bg-white text-[#434654] border-[#c3c6d6]/60 hover:border-[#003d9b]/40'
          }`}
        >
          {filter.label}
          <span
            className={`text-xs ${
              activeStatus === filter.id ? 'text-white/80' : 'text-[#737685]'
            }`}
          >
            ({statusCounts[filter.id]})
          </span>
        </button>
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <select
        value={activeTimeSlot}
        onChange={(e) => onTimeSlotChange(e.target.value as ScheduleTimeFilter)}
        className="px-3.5 py-2 text-sm border border-[#c3c6d6]/60 rounded-xl bg-white text-[#191c1e] outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
      >
        {TIME_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onRefresh}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#003d9b] hover:underline"
      >
        <RefreshCw size={15} />
        Làm mới
      </button>
    </div>
  </div>
);

export default DoctorScheduleFilters;
