import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';
import { AppointmentTimeSlot } from '../types';
import { formatScheduleDateShort } from '../utils/buildDoctorSchedule';

interface TimeSlotPickerProps {
  selectedDate: string | null;
  slots: AppointmentTimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  slots,
  selectedSlotId,
  onSelectSlot,
}) => {
  const morningSlots = useMemo(
    () => slots.filter((slot) => slot.period === 'morning'),
    [slots],
  );
  const afternoonSlots = useMemo(
    () => slots.filter((slot) => slot.period === 'afternoon'),
    [slots],
  );

  if (!selectedDate) {
    return (
      <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm p-8 text-center">
        <Clock size={32} className="mx-auto text-[#003d9b] mb-3" />
        <p className="text-base text-[#434654]">
          Vui lòng chọn ngày khám trước, sau đó hệ thống sẽ hiển thị các khung giờ còn trống.
        </p>
      </div>
    );
  }

  const renderGroup = (title: string, items: AppointmentTimeSlot[], dotColor: string) => (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 text-base text-[#191c1e]">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        {title}
      </h4>
      <div className="flex flex-wrap gap-3">
        {items.map((slot) => (
          <button
            key={slot.id}
            type="button"
            disabled={!slot.available}
            onClick={() => onSelectSlot(slot.id)}
            className={`min-w-[82px] rounded-lg border px-4 py-3 text-sm transition-colors ${
              selectedSlotId === slot.id
                ? 'border-[#003d9b] bg-[#003d9b] text-white shadow-md'
                : slot.available
                  ? 'border-[#c3c6d6] bg-white text-[#191c1e] hover:border-[#003d9b]/40'
                  : 'border-[#e7e8ea] bg-[#f3f4f6] text-[#c3c6d6] cursor-not-allowed line-through'
            }`}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Clock size={20} className="text-[#003d9b]" />
        <h3 className="text-lg font-medium text-[#191c1e]">
          Giờ khám ngày {formatScheduleDateShort(selectedDate)}
        </h3>
      </div>

      {renderGroup('Buổi sáng (08:00 - 11:30)', morningSlots, 'bg-amber-400')}
      {renderGroup('Buổi chiều (13:30 - 16:30)', afternoonSlots, 'bg-[#003d9b]')}
    </div>
  );
};

export default TimeSlotPicker;
