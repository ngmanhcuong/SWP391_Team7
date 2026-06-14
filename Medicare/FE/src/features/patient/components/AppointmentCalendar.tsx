import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AppointmentScheduleDay } from '../types';
import { getMonthLabel } from '../utils/buildDoctorSchedule';

interface AppointmentCalendarProps {
  days: AppointmentScheduleDay[];
  selectedDate: string | null;
  weekOffset: number;
  onWeekOffsetChange: (offset: number) => void;
  onSelectDate: (date: string) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  days,
  selectedDate,
  weekOffset,
  onWeekOffsetChange,
  onSelectDate,
}) => (
  <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-[#191c1e] capitalize">{getMonthLabel(days)}</h3>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onWeekOffsetChange(weekOffset - 1)}
          disabled={weekOffset <= 0}
          className="flex items-center justify-center w-8 h-8 rounded border border-[#c3c6d6] text-[#434654] disabled:opacity-40 hover:bg-[#f8f9fb]"
          aria-label="Tuần trước"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => onWeekOffsetChange(weekOffset + 1)}
          className="flex items-center justify-center w-8 h-8 rounded border border-[#c3c6d6] text-[#434654] hover:bg-[#f8f9fb]"
          aria-label="Tuần sau"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-7 gap-2 mb-3">
      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label) => (
        <div key={label} className="text-center text-sm text-[#434654] py-2">
          {label}
        </div>
      ))}
    </div>

    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const isSelected = selectedDate === day.date;
        const isDisabled = day.isPast || !day.hasAvailableSlots;

        return (
          <button
            key={day.date}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelectDate(day.date)}
            className={`min-h-[64px] rounded-lg border px-2 py-3 flex flex-col items-center justify-center transition-colors ${
              isSelected
                ? 'border-[#003d9b] bg-[#003d9b] text-white shadow-md'
                : isDisabled
                  ? 'border-transparent bg-[#f3f4f6] text-[#c3c6d6] cursor-not-allowed'
                  : 'border-[#c3c6d6] bg-white text-[#191c1e] hover:border-[#003d9b]/40 hover:bg-[#f8f9fb]'
            }`}
          >
            <span className="text-base font-medium">{day.dayNumber}</span>
            <span className={`text-xs mt-1 ${isSelected ? 'text-white/90' : 'text-[#434654]'}`}>
              {day.weekdayLabel}
            </span>
            {!isDisabled && !isSelected && (
              <span className="text-[10px] text-[#006c47] mt-0.5">Còn lịch</span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export default AppointmentCalendar;
