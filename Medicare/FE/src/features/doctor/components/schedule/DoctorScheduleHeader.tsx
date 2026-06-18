import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CalendarRange, LayoutList, Plus } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import { DOCTOR_PATHS } from '../../utils/doctorPaths';
import { ScheduleViewMode } from '../../types';
import ScheduleProgressBar from './ScheduleProgressBar';

interface DoctorScheduleHeaderProps {
  dateLabel: string;
  viewMode: ScheduleViewMode;
  completed: number;
  total: number;
  pending: number;
  cancelledCount?: number;
  onViewModeChange: (mode: ScheduleViewMode) => void;
}

const VIEW_OPTIONS: { id: ScheduleViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'list', label: 'Danh sách', icon: <LayoutList size={16} /> },
  { id: 'week', label: 'Lịch tuần', icon: <CalendarRange size={16} /> },
  { id: 'month', label: 'Lịch tháng', icon: <CalendarDays size={16} /> },
];

const VIEW_TITLES: Record<ScheduleViewMode, string> = {
  list: 'Lịch khám hôm nay',
  week: 'Lịch khám tuần',
  month: 'Lịch khám tháng',
};

const DoctorScheduleHeader: React.FC<DoctorScheduleHeaderProps> = ({
  dateLabel,
  viewMode,
  completed,
  total,
  pending,
  cancelledCount = 0,
  onViewModeChange,
}) => (
  <section className="rounded-2xl border border-[#c3c6d6]/50 bg-gradient-to-br from-white via-white to-[#e8f0fe]/25 shadow-sm shadow-[#003d9b]/5 overflow-hidden">
    <div className="p-5 sm:p-6 space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#003d9b]">
            Thời khóa biểu
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1e] tracking-tight mt-1">
            {VIEW_TITLES[viewMode]}
          </h1>
          <p className="text-sm text-[#737685] mt-1">{dateLabel}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="inline-flex flex-wrap rounded-xl border border-[#c3c6d6]/60 bg-white p-1 self-start gap-1">
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onViewModeChange(option.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === option.id
                    ? 'bg-[#003d9b] text-white'
                    : 'text-[#434654] hover:bg-[#f8f9fb]'
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>

          <Link to={DOCTOR_PATHS.patients}>
            <Button
              leftIcon={<Plus size={16} />}
              className="bg-[#003d9b] border-[#003d9b] hover:bg-[#002d75] shrink-0 w-full sm:w-auto"
            >
              Thêm lịch mới
            </Button>
          </Link>
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="space-y-2">
          <ScheduleProgressBar completed={completed} total={total} pending={pending} />
          {cancelledCount > 0 && (
            <p className="text-xs text-[#737685]">
              Ngoài ra có{' '}
              <span className="font-semibold text-gray-600">{cancelledCount} ca đã hủy</span> không
              tính vào tiến độ.
            </p>
          )}
        </div>
      )}
    </div>
  </section>
);

export default DoctorScheduleHeader;
