import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react';
import { ScheduledAppointment } from '../../types';
import { DOCTOR_PATHS } from '../../utils/doctorPaths';
import { groupAppointmentsByDate } from '../../utils/buildScheduleCalendarData';
import {
  APPOINTMENT_STATUS_CONFIG,
  formatDayShortLabel,
  formatWeekRangeLabel,
  getWeekDays,
  getWeekdayShortLabel,
  isSameDay,
  isWeekend,
  parseTimeToMinutes,
  summarizeAppointments,
  toDateKey,
} from '../../utils/scheduleUtils';

interface ScheduleWeekViewProps {
  referenceDate: Date;
  appointments: ScheduledAppointment[];
  onWeekChange: (direction: -1 | 1) => void;
  onToday: () => void;
}

type WeekScope = 'day' | 'week';

const sortByTime = (items: ScheduledAppointment[]) =>
  [...items].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

const ScheduleWeekView: React.FC<ScheduleWeekViewProps> = ({
  referenceDate,
  appointments,
  onWeekChange,
  onToday,
}) => {
  const today = useMemo(() => new Date(), []);
  const weekDays = getWeekDays(referenceDate);
  const grouped = useMemo(() => groupAppointmentsByDate(appointments), [appointments]);
  const weekSummary = useMemo(() => summarizeAppointments(appointments), [appointments]);

  const defaultDayKey = useMemo(() => {
    const todayInWeek = weekDays.find((day) => isSameDay(day, today));
    if (todayInWeek) return toDateKey(todayInWeek);
    const firstWithAppointments = weekDays.find((day) => (grouped[toDateKey(day)]?.length ?? 0) > 0);
    return toDateKey(firstWithAppointments ?? weekDays[0]);
  }, [weekDays, grouped, today]);

  const [selectedDayKey, setSelectedDayKey] = useState(defaultDayKey);
  const [scope, setScope] = useState<WeekScope>('day');

  useEffect(() => {
    setSelectedDayKey(defaultDayKey);
  }, [defaultDayKey]);

  const visibleAppointments = useMemo(() => {
    if (scope === 'week') {
      return weekDays.flatMap((day) => sortByTime(grouped[toDateKey(day)] ?? []));
    }
    return sortByTime(grouped[selectedDayKey] ?? []);
  }, [scope, weekDays, grouped, selectedDayKey]);

  const selectedDay = weekDays.find((day) => toDateKey(day) === selectedDayKey) ?? weekDays[0];
  const selectedSummary = summarizeAppointments(grouped[selectedDayKey] ?? []);

  const renderAppointmentRow = (appt: ScheduledAppointment) => {
    const statusStyle = APPOINTMENT_STATUS_CONFIG[appt.status];
    const isCancelled = appt.status === 'cancelled';
    const recordHref = appt.patientId
      ? DOCTOR_PATHS.recordAppointment(appt.patientId, appt.id)
      : undefined;

    return (
      <div
        key={appt.id}
        className={`flex items-center gap-3 px-4 py-2.5 border-b border-[#c3c6d6]/20 last:border-0 hover:bg-[#f8f9fb]/70 transition-colors ${
          isCancelled ? 'opacity-60' : ''
        }`}
      >
        <span className="w-12 shrink-0 text-xs font-bold text-[#003d9b] tabular-nums">{appt.time}</span>
        <span className={`h-2 w-2 shrink-0 rounded-full ${statusStyle.dotClassName}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#191c1e] truncate">{appt.patientName}</p>
          <p className="text-[11px] text-[#737685] truncate">{appt.department}</p>
        </div>
        <span className={`hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusStyle.className}`}>
          {statusStyle.label}
        </span>
        {recordHref && !isCancelled ? (
          <Link
            to={recordHref}
            className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#003d9b] text-white text-[10px] font-bold uppercase hover:bg-[#002d75]"
          >
            <Stethoscope size={11} />
            Khám
          </Link>
        ) : (
          <span className="w-14 shrink-0 text-center text-[10px] text-[#737685]">—</span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
      <div className="px-4 sm:px-5 py-3.5 border-b border-[#c3c6d6]/40 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[#191c1e]">Lịch tuần</h2>
          <p className="text-[11px] text-[#737685]">{formatWeekRangeLabel(referenceDate)}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onWeekChange(-1)}
            className="p-1.5 rounded-lg border border-[#c3c6d6]/60 text-[#434654] hover:bg-[#f8f9fb]"
            aria-label="Tuần trước"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#003d9b] bg-[#e8f0fe]"
          >
            Hôm nay
          </button>
          <button
            type="button"
            onClick={() => onWeekChange(1)}
            className="p-1.5 rounded-lg border border-[#c3c6d6]/60 text-[#434654] hover:bg-[#f8f9fb]"
            aria-label="Tuần sau"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-2.5 bg-[#f8f9fb]/60 border-b border-[#c3c6d6]/30 flex flex-wrap gap-2 text-[11px]">
        <span className="font-semibold text-[#191c1e]">{weekSummary.total} ca/tuần</span>
        {weekSummary.waiting > 0 && (
          <span className="text-amber-700">· {weekSummary.waiting} chờ</span>
        )}
        {weekSummary.confirmed > 0 && (
          <span className="text-[#003d9b]">· {weekSummary.confirmed} xác nhận</span>
        )}
        {weekSummary.completed > 0 && (
          <span className="text-emerald-700">· {weekSummary.completed} hoàn thành</span>
        )}
        {weekSummary.cancelled > 0 && (
          <span className="text-[#737685]">· {weekSummary.cancelled} hủy</span>
        )}
      </div>

      <div className="px-4 sm:px-5 py-3 border-b border-[#c3c6d6]/30">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const dateKey = toDateKey(day);
            const dayCount = summarizeAppointments(grouped[dateKey] ?? []).total;
            const isToday = isSameDay(day, today);
            const isSelected = scope === 'day' && dateKey === selectedDayKey;
            const weekend = isWeekend(day);

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => {
                  setScope('day');
                  setSelectedDayKey(dateKey);
                }}
                className={`rounded-lg px-1 py-2 text-center transition-all ${
                  isSelected
                    ? 'bg-[#003d9b] text-white shadow-sm'
                    : isToday
                      ? 'bg-[#e8f0fe] text-[#003d9b] ring-1 ring-[#003d9b]/30'
                      : weekend
                        ? 'bg-gray-50 text-[#737685] hover:bg-gray-100'
                        : 'bg-white border border-[#c3c6d6]/40 text-[#434654] hover:border-[#003d9b]/30'
                }`}
              >
                <p className="text-[9px] font-bold uppercase">{getWeekdayShortLabel(day)}</p>
                <p className="text-sm font-bold leading-tight mt-0.5">{day.getDate()}</p>
                <p className={`text-[9px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#737685]'}`}>
                  {dayCount} ca
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={() => setScope('day')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
              scope === 'day'
                ? 'bg-[#003d9b] text-white'
                : 'bg-white border border-[#c3c6d6]/50 text-[#434654] hover:border-[#003d9b]/30'
            }`}
          >
            Theo ngày
          </button>
          <button
            type="button"
            onClick={() => setScope('week')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
              scope === 'week'
                ? 'bg-[#003d9b] text-white'
                : 'bg-white border border-[#c3c6d6]/50 text-[#434654] hover:border-[#003d9b]/30'
            }`}
          >
            Cả tuần
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-2 border-b border-[#c3c6d6]/25 bg-[#e8f0fe]/20">
        <p className="text-xs font-semibold text-[#003d9b]">
          {scope === 'day'
            ? `${formatDayShortLabel(selectedDay)} — ${selectedSummary.total} ca`
            : `Toàn tuần — ${weekSummary.total} ca (sắp xếp theo thời gian)`}
        </p>
      </div>

      {visibleAppointments.length === 0 ? (
        <p className="px-5 py-8 text-sm text-[#737685] text-center">
          {scope === 'day' ? 'Không có lịch hẹn trong ngày này.' : 'Không có lịch hẹn trong tuần.'}
        </p>
      ) : scope === 'week' ? (
        <div>
          {weekDays.map((day) => {
            const dateKey = toDateKey(day);
            const dayItems = sortByTime(grouped[dateKey] ?? []);
            if (dayItems.length === 0) return null;

            return (
              <div key={dateKey}>
                <div className="px-4 py-2 bg-[#f8f9fb]/80 border-y border-[#c3c6d6]/20 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#434654]">{formatDayShortLabel(day)}</span>
                  <span className="text-[10px] text-[#737685]">{dayItems.length} ca</span>
                </div>
                {dayItems.map(renderAppointmentRow)}
              </div>
            );
          })}
        </div>
      ) : (
        <div>{visibleAppointments.map(renderAppointmentRow)}</div>
      )}
    </div>
  );
};

export default ScheduleWeekView;
