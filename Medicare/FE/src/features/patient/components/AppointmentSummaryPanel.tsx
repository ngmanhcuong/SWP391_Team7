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
}

const AppointmentSummaryPanel: React.FC<AppointmentSummaryPanelProps> = ({
  doctor,
  specialtyName,
  selectedDate,
  selectedTime,
}) => {
  const hasSelectedDate = Boolean(selectedDate);
  const hasSelectedTime = Boolean(selectedTime);

  let helperTitle = 'Hãy chọn ngày khám';
  let helperDescription =
    'Bạn đã chọn bác sĩ. Tiếp theo, vui lòng chọn ngày khám để xem các khung giờ còn trống.';

  if (hasSelectedDate && !hasSelectedTime) {
    helperTitle = 'Hãy chọn giờ khám';
    helperDescription = `Bạn đã chọn ngày ${formatScheduleDateShort(
      selectedDate!,
    )}. Tiếp theo, vui lòng chọn khung giờ phù hợp để hoàn tất bước này.`;
  }

  if (hasSelectedDate && hasSelectedTime) {
    helperTitle = 'Đã chọn lịch khám';
    helperDescription = `Bạn đã chọn lịch ${formatScheduleDateShort(
      selectedDate!,
    )} lúc ${selectedTime}. Có thể tiếp tục sang bước xác nhận thông tin.`;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-[#c3c6d6] bg-white shadow-sm">
        <div className="border-b border-[#c3c6d6] px-6 py-5">
          <h3 className="text-lg font-medium text-[#191c1e]">Thông tin đặt lịch</h3>
        </div>

        <div className="space-y-6 p-6">
          {doctor ? (
            <div className="flex gap-4">
              <div
                className="shrink-0 rounded-lg border border-[#c3c6d6] p-0.5"
                style={{ background: doctor.avatarBg }}
              >
                <Avatar name={doctor.name} size="lg" className="rounded-lg" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-[#434654]">Bác sĩ phụ trách</p>
                <p className="mt-1 text-base font-medium text-[#191c1e]">{doctor.name}</p>
                <p className="text-sm text-[#434654]">{specialtyName ?? doctor.departmentLabel}</p>
                <div className="mt-2 flex items-center gap-1 text-sm text-[#851800]">
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
              <Building2 size={16} className="mt-0.5 shrink-0 text-[#003d9b]" />
              <span>{doctor?.roomName ?? doctor?.roomCode ?? 'Chưa phân phòng khám'}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#003d9b]" />
              <span>123 Nguyễn Trãi, Quận 1, TP.HCM</span>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-[#c3c6d6] bg-[#f8f9fb] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#434654]">Ngày khám</span>
              <span className="text-base font-medium text-[#191c1e]">
                {selectedDate ? formatScheduleDateShort(selectedDate) : 'Chưa chọn ngày'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#434654]">Giờ khám</span>
              <span className="text-base font-medium text-[#191c1e]">
                {selectedTime ?? 'Chưa chọn giờ'}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-[#dbe7ff] bg-[#f5f9ff] p-4">
            <p className="text-sm font-medium text-[#003d9b]">{helperTitle}</p>
            <p className="mt-1 text-sm leading-5 text-[#434654]">{helperDescription}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 rounded-lg border border-[#c3c6d6] bg-[#f8f9fb] p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-[#003d9b]" />
        <p className="text-sm leading-5 text-[#434654]">
          Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục check-in. Lịch hẹn có thể thay đổi tùy
          tình trạng khám của bác sĩ.
        </p>
      </div>

      {selectedDate && (
        <p className="flex items-center gap-1.5 text-xs text-[#434654]">
          <Clock size={14} />
          {formatScheduleDate(selectedDate)}
        </p>
      )}
    </div>
  );
};

export default AppointmentSummaryPanel;
