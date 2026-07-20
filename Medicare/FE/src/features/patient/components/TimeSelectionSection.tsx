import React, { useMemo } from 'react';
import { AppointmentScheduleDay, BookingDoctor } from '../types';
import AppointmentCalendar from './AppointmentCalendar';
import AppointmentSummaryPanel from './AppointmentSummaryPanel';
import TimeSlotPicker from './TimeSlotPicker';

interface TimeSelectionSectionProps {
  doctor: BookingDoctor | null;
  specialtyName?: string;
  scheduleDays: AppointmentScheduleDay[];
  weekOffset: number;
  selectedDate: string | null;
  selectedSlotId: string | null;
  onWeekOffsetChange: (offset: number) => void;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slotId: string) => void;
}

const TimeSelectionSection: React.FC<TimeSelectionSectionProps> = ({
  doctor,
  specialtyName,
  scheduleDays,
  weekOffset,
  selectedDate,
  selectedSlotId,
  onWeekOffsetChange,
  onSelectDate,
  onSelectSlot,
}) => {
  const selectedDaySlots = useMemo(() => {
    if (!selectedDate) return [];
    return scheduleDays.find((day) => day.date === selectedDate)?.slots ?? [];
  }, [scheduleDays, selectedDate]);

  const selectedTime = useMemo(() => {
    const slot = selectedDaySlots.find((item) => item.id === selectedSlotId);
    return slot?.time ?? null;
  }, [selectedDaySlots, selectedSlotId]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="space-y-6">
        <header className="space-y-1">
          <h2 className="text-2xl font-semibold text-[#191c1e]">Chọn thời gian khám</h2>
          <p className="text-base text-[#434654]">
            Chọn ngày và khung giờ phù hợp với lịch của{' '}
            <span className="font-medium text-[#003d9b]">{doctor?.name ?? 'bác sĩ'}</span>.
          </p>
        </header>

        <AppointmentCalendar
          days={scheduleDays}
          selectedDate={selectedDate}
          weekOffset={weekOffset}
          onWeekOffsetChange={onWeekOffsetChange}
          onSelectDate={onSelectDate}
        />

        <TimeSlotPicker
          selectedDate={selectedDate}
          slots={selectedDaySlots}
          selectedSlotId={selectedSlotId}
          onSelectSlot={onSelectSlot}
        />
      </div>

      <AppointmentSummaryPanel
        doctor={doctor}
        specialtyName={specialtyName}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </div>
  );
};

export default TimeSelectionSection;
