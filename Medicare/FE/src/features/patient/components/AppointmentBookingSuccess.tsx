import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, MapPin, Wallet } from 'lucide-react';
import { Avatar } from '../../../components/ui';
import { formatCurrencyVnd } from '../constants/consultationFees';
import { AppointmentBookingResult, BookingDoctor } from '../types';
import { formatScheduleDate, formatScheduleDateShort } from '../utils/buildDoctorSchedule';
import AppointmentConfirmationTimeline from './AppointmentConfirmationTimeline';

interface AppointmentBookingSuccessProps {
  result: AppointmentBookingResult;
  doctor: BookingDoctor | null;
  specialtyName?: string;
  selectedDate: string | null;
  selectedTime: string | null;
  onBookAnother: () => void;
}

const PAYMENT_LABELS: Record<AppointmentBookingResult['depositPaymentMethod'], string> = {
  vnpay: 'VNPay',
  momo: 'MoMo',
  banking: 'Chuyển khoản ngân hàng',
};

const AppointmentBookingSuccess: React.FC<AppointmentBookingSuccessProps> = ({
  result,
  doctor,
  specialtyName,
  selectedDate,
  selectedTime,
  onBookAnother,
}) => (
  <div className="mx-auto max-w-2xl space-y-6">
    <div className="bg-white border border-[#c3c6d6] rounded-2xl shadow-sm p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#006c47]/10">
        <CheckCircle2 size={36} className="text-[#006c47]" />
      </div>
      <h2 className="text-2xl font-semibold text-[#191c1e]">Đăng ký lịch hẹn thành công!</h2>
      <p className="mt-2 text-base text-[#434654]">
        Tiền cọc đã được ghi nhận. Lịch hẹn đang chờ lễ tân xác nhận cọc, sau đó bác sĩ sẽ xác
        nhận lịch khám.
      </p>
      <p className="mt-4 text-sm text-[#434654]">Mã lịch hẹn</p>
      <p className="text-2xl font-bold tracking-wide text-[#003d9b]">{result.referenceCode}</p>
    </div>

    <AppointmentConfirmationTimeline status={result.status} />

    <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-[#c3c6d6] px-6 py-4">
        <h3 className="text-lg font-medium text-[#191c1e]">Thông tin lịch hẹn</h3>
      </div>
      <div className="p-6 space-y-5">
        {doctor && (
          <div className="flex items-center gap-4">
            <div
              className="rounded-lg border border-[#c3c6d6] p-0.5 shrink-0"
              style={{ background: doctor.avatarBg }}
            >
              <Avatar name={doctor.name} size="lg" className="rounded-lg" />
            </div>
            <div>
              <p className="text-base font-medium text-[#191c1e]">{doctor.name}</p>
              <p className="text-sm text-[#434654]">{specialtyName ?? doctor.departmentLabel}</p>
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-[#434654]">
            <Calendar size={16} className="text-[#003d9b] shrink-0" />
            {selectedDate ? formatScheduleDate(selectedDate) : '—'}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#434654]">
            <Clock size={16} className="text-[#003d9b] shrink-0" />
            {selectedTime ?? '—'}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#434654] sm:col-span-2">
            <MapPin size={16} className="text-[#003d9b] shrink-0" />
            123 Nguyễn Trãi, Quận 1, TP.HCM
          </div>
          <div className="flex items-center gap-2 text-sm text-[#434654] sm:col-span-2">
            <Wallet size={16} className="text-[#003d9b] shrink-0" />
            Đã cọc {formatCurrencyVnd(result.depositAmount)} qua{' '}
            {PAYMENT_LABELS[result.depositPaymentMethod]}
          </div>
        </div>

        {selectedDate && selectedTime && (
          <div className="rounded-lg bg-[#f8f9fb] border border-[#c3c6d6] px-4 py-3 text-sm text-[#434654]">
            Sau khi lễ tân xác nhận cọc và bác sĩ duyệt lịch, vui lòng đến trước{' '}
            {formatScheduleDateShort(selectedDate)} · {selectedTime} ít nhất 15 phút để check-in.
          </div>
        )}
      </div>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Link
        to="/patient"
        className="inline-flex items-center justify-center rounded-lg bg-[#003d9b] px-8 py-3 text-base text-white hover:bg-[#002d75] transition-colors"
      >
        Về trang chủ
      </Link>
      <button
        type="button"
        onClick={onBookAnother}
        className="inline-flex items-center justify-center rounded-lg border border-[#c3c6d6] px-8 py-3 text-base text-[#191c1e] hover:bg-[#f8f9fb] transition-colors"
      >
        Đặt lịch mới
      </button>
    </div>
  </div>
);

export default AppointmentBookingSuccess;
