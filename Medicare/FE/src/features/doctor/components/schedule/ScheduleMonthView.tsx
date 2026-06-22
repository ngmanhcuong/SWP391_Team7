import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react';
import { ScheduledAppointment } from '../../types';
import { DOCTOR_PATHS } from '../../utils/doctorPaths';
import {
  getDayAppointmentSummary,
  groupAppointmentsByDate,
} from '../../utils/buildScheduleCalendarData';
import {
  APPOINTMENT_STATUS_CONFIG,
  APPOINTMENT_TYPE_CONFIG,
  buildMonthCalendarWeeks,
  formatMonthLabel,
  isSameDay,
  parseDateKey,
  toDateKey,
} from '../../utils/scheduleUtils';

interface ScheduleMonthViewProps {
  referenceDate: Date;
  appointments: ScheduledAppointment[];
  onMonthChange: (direction: -1 | 1) => void;
  onToday: () => void;
}

const WEEKDAY_HEADERS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const ScheduleMonthView: React.FC<ScheduleMonthViewProps> = ({
  referenceDate,
  appointments,
  onMonthChange,
  onToday,
}) => {
  const today = new Date();
  const grouped = useMemo(() => groupAppointmentsByDate(appointments), [appointments]);
  const weeks = useMemo(
    () => buildMonthCalendarWeeks(referenceDate.getFullYear(), referenceDate.getMonth()),
    [referenceDate],
  );

  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(today));
  const selectedAppointments = grouped[selectedDateKey] ?? [];
  const selectedSummary = getDayAppointmentSummary(selectedAppointments);
  const selectedDate = parseDateKey(selectedDateKey);

  return (
    <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 sm:px-6 py-4 border-b border-[#c3c6d6]/40">
            <div>
              <h2 className="text-base font-semibold text-[#191c1e]">Lịch tháng</h2>
              <p className="text-[11px] text-[#737685] mt-0.5">{formatMonthLabel(referenceDate)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onMonthChange(-1)}
                className="p-2 rounded-lg border border-[#c3c6d6]/60 text-[#434654] hover:bg-[#f8f9fb]"
                aria-label="Tháng trước"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={onToday}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#003d9b] bg-[#e8f0fe] hover:bg-[#d6e4fc]"
              >
                Hôm nay
              </button>
              <button
                type="button"
                onClick={() => onMonthChange(1)}
                className="p-2 rounded-lg border border-[#c3c6d6]/60 text-[#434654] hover:bg-[#f8f9fb]"
                aria-label="Tháng sau"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAY_HEADERS.map((label) => (
                <div key={label} className="text-center text-[10px] font-semibold text-[#737685] py-1">
                  {label}
                </div>
              ))}
            </div>

            <div className="space-y-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <span key={dayIndex} className="h-20 sm:h-24" />;
                    }

                    const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), day);
                    const dateKey = toDateKey(date);
                    const dayAppointments = grouped[dateKey] ?? [];
                    const summary = getDayAppointmentSummary(dayAppointments);
                    const isToday = isSameDay(date, today);
                    const isSelected = dateKey === selectedDateKey;

                    return (
                      <button
                        key={dayIndex}
                        type="button"
                        onClick={() => setSelectedDateKey(dateKey)}
                        className={`h-20 sm:h-24 rounded-xl border p-2 text-left transition-all ${
                          isSelected
                            ? 'border-[#003d9b] bg-[#e8f0fe]/40 shadow-sm'
                            : isToday
                              ? 'border-[#003d9b]/40 bg-[#e8f0fe]/15 hover:border-[#003d9b]/60'
                              : 'border-[#c3c6d6]/40 bg-white hover:border-[#003d9b]/30 hover:bg-[#f8f9fb]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold ${isToday ? 'text-[#003d9b]' : 'text-[#191c1e]'}`}>
                            {day}
                          </span>
                          {summary.total > 0 && (
                            <span className="text-[10px] font-bold text-white bg-[#003d9b] px-1.5 py-0.5 rounded-full">
                              {summary.total}
                            </span>
                          )}
                        </div>
                        {summary.total > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {summary.waiting > 0 && (
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            )}
                            {summary.confirmed > 0 && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#003d9b]" />
                            )}
                            {summary.completed > 0 && (
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[300px] shrink-0 border-t lg:border-t-0 lg:border-l border-[#c3c6d6]/40 bg-[#f8f9fb]/40">
          <div className="px-5 py-4 border-b border-[#c3c6d6]/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#003d9b]">Chi tiết ngày</p>
            <p className="text-sm font-semibold text-[#191c1e] mt-1">
              {selectedDate.getDate().toString().padStart(2, '0')}/
              {(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/
              {selectedDate.getFullYear()}
            </p>
            <p className="text-[11px] text-[#737685] mt-1">
              {selectedSummary.total} ca hoạt động
              {selectedSummary.cancelled > 0 ? ` · ${selectedSummary.cancelled} đã hủy` : ''}
            </p>
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-[#c3c6d6]/25">
            {selectedAppointments.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[#737685] text-center">Không có lịch hẹn.</p>
            ) : (
              selectedAppointments.map((appt) => {
                const statusStyle = APPOINTMENT_STATUS_CONFIG[appt.status];
                const typeStyle = APPOINTMENT_TYPE_CONFIG[appt.type];
                const recordHref = appt.patientId
                  ? DOCTOR_PATHS.recordAppointment(appt.patientId, appt.id)
                  : undefined;

                return (
                  <div key={appt.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#003d9b]">{appt.time}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle.className}`}>
                        {statusStyle.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#191c1e] mt-1">{appt.patientName}</p>
                    <p className="text-xs text-[#737685] mt-0.5">{appt.department}</p>
                    <span className={`inline-flex mt-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${typeStyle.className}`}>
                      {typeStyle.label}
                    </span>
                    {recordHref && appt.status !== 'cancelled' && (
                      <Link
                        to={recordHref}
                        className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#003d9b] hover:underline"
                      >
                        <Stethoscope size={12} />
                        Mở hồ sơ
                      </Link>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMonthView;
