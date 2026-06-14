import React from 'react';
import { Building2, Clock, Info, MapPin, Star } from 'lucide-react';
import { Avatar } from '../../../components/ui';
import { BookingDoctor } from '../types';
import { formatScheduleDate, formatScheduleDateShort } from '../utils/buildDoctorSchedule';

interface AppointmentSummaryPanelProps {
  doctor: BookingDoctor | null;
  specialtyName?: string;
  selectedDate: string | null;
  selectedTime: string | null;
  onClearSelection: () => void;
}

const AppointmentSummaryPanel: React.FC<AppointmentSummaryPanelProps> = ({
  doctor,
  specialtyName,
  selectedDate,
  selectedTime,
  onClearSelection,
}) => (
  <div className="space-y-4">
    <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-[#c3c6d6] px-6 py-5">
        <h3 className="text-lg font-medium text-[#191c1e]">Thông tin đặt lịch</h3>
      </div>

      <div className="p-6 space-y-6">
        {doctor ? (
          <div className="flex gap-4">
            <div
              className="rounded-lg border border-[#c3c6d6] p-0.5 shrink-0"
              style={{ background: doctor.avatarBg }}
            >
              <Avatar name={doctor.name} size="lg" className="rounded-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-[#434654]">Bác sĩ phụ trách</p>
              <p className="text-base font-medium text-[#191c1e] mt-1">{doctor.name}</p>
              <p className="text-sm text-[#434654]">{specialtyName ?? doctor.departmentLabel}</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-[#851800]">
                <Star size={14} className="fill-current" />
                <span>{doctor.rating.toFixed(1)}</span>
                <span className="text-[#434654]">({doctor.reviewCount} đánh giá)</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#434654]">Chưa chọn bác sĩ.</p>
        )}

        <div className="space-y-2 text-sm text-[#434654]">
          <div className="flex items-start gap-2">
            <Building2 size={16} className="mt-0.5 shrink-0 text-[#003d9b]" />
            <span>MedCare Clinic - Phòng khám đa khoa</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-[#003d9b]" />
            <span>123 Nguyễn Trãi, Quận 1, TP.HCM</span>
          </div>
        </div>

        <div className="rounded-lg bg-[#f8f9fb] border border-[#c3c6d6] p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#434654]">Ngày khám</span>
            <span className="text-base font-medium text-[#191c1e]">
              {selectedDate ? formatScheduleDateShort(selectedDate) : 'Chưa chọn'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#434654]">Giờ khám</span>
            <span className="text-base font-medium text-[#191c1e]">
              {selectedTime ?? 'Chưa chọn'}
            </span>
          </div>
        </div>

        {selectedDate && selectedTime && (
          <div className="space-y-3">
            <button
              type="button"
              className="w-full rounded bg-[#003d9b] px-4 py-3 text-base text-white hover:bg-[#002d75] transition-colors"
            >
              Xác nhận chọn {formatScheduleDateShort(selectedDate)} · {selectedTime}
            </button>
            <button
              type="button"
              onClick={onClearSelection}
              className="w-full rounded border border-[#c3c6d6] px-4 py-3 text-base text-[#434654] hover:bg-[#f8f9fb] transition-colors"
            >
              Hủy chọn
            </button>
          </div>
        )}
      </div>
    </div>

    <div className="flex gap-3 rounded-lg border border-[#c3c6d6] bg-[#f8f9fb] p-4">
      <Info size={20} className="text-[#003d9b] shrink-0 mt-0.5" />
      <p className="text-sm text-[#434654] leading-5">
        Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục check-in. Lịch hẹn có thể thay đổi tùy
        tình trạng khám của bác sĩ.
      </p>
    </div>

    {selectedDate && (
      <p className="text-xs text-[#434654] flex items-center gap-1.5">
        <Clock size={14} />
        {formatScheduleDate(selectedDate)}
      </p>
    )}
  </div>
);

export default AppointmentSummaryPanel;
