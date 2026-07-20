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
  momo: 'QR MoMo',
  banking: 'QR BIDV',
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
    <div className="rounded-2xl border border-[#c3c6d6] bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#006c47]/10">
        <CheckCircle2 size={36} className="text-[#006c47]" />
      </div>
      <h2 className="text-2xl font-semibold text-[#191c1e]">Đăng ký lịch hẹn thành công!</h2>
      <p className="mt-2 text-base text-[#434654]">
        Bệnh nhân đã gửi xác nhận thanh toán cọc. Lịch hẹn hiện đang chờ lễ tân xác nhận đúng số tiền
        đặt cọc, sau đó bác sĩ sẽ xác nhận lịch khám.
      </p>
      <p className="mt-4 text-sm text-[#434654]">Mã lịch hẹn</p>
      <p className="text-2xl font-bold tracking-wide text-[#003d9b]">{result.referenceCode}</p>
    </div>

    <AppointmentConfirmationTimeline status={result.status} />

    <div className="overflow-hidden rounded-lg border border-[#c3c6d6] bg-white shadow-sm">
      <div className="border-b border-[#c3c6d6] px-6 py-4">
        <h3 className="text-lg font-medium text-[#191c1e]">Thông tin lịch hẹn</h3>
      </div>
      <div className="space-y-5 p-6">
        {doctor && (
          <div className="flex items-center gap-4">
            <div
              className="shrink-0 rounded-lg border border-[#c3c6d6] p-0.5"
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
            <Calendar size={16} className="shrink-0 text-[#003d9b]" />
            {selectedDate ? formatScheduleDate(selectedDate) : '—'}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#434654]">
            <Clock size={16} className="shrink-0 text-[#003d9b]" />
            {selectedTime ?? '—'}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#434654] sm:col-span-2">
            <MapPin size={16} className="shrink-0 text-[#003d9b]" />
            123 Nguyễn Trãi, Quận 1, TP.HCM
          </div>
          <div className="flex items-center gap-2 text-sm text-[#434654] sm:col-span-2">
            <Wallet size={16} className="shrink-0 text-[#003d9b]" />
            Đã gửi xác nhận cọc {formatCurrencyVnd(result.depositAmount)} qua{' '}
            {PAYMENT_LABELS[result.depositPaymentMethod]}
          </div>
        </div>

        {selectedDate && selectedTime && (
          <div className="rounded-lg border border-[#c3c6d6] bg-[#f8f9fb] px-4 py-3 text-sm text-[#434654]">
            Sau khi lễ tân xác nhận cọc và bác sĩ duyệt lịch, vui lòng đến trước{' '}
            {formatScheduleDateShort(selectedDate)} · {selectedTime} ít nhất 15 phút để check-in.
          </div>
        )}
      </div>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Link
        to="/patient"
        className="inline-flex items-center justify-center rounded-lg bg-[#003d9b] px-8 py-3 text-base text-white transition-colors hover:bg-[#002d75]"
      >
        Về trang chủ
      </Link>
      <button
        type="button"
        onClick={onBookAnother}
        className="inline-flex items-center justify-center rounded-lg border border-[#c3c6d6] px-8 py-3 text-base text-[#191c1e] transition-colors hover:bg-[#f8f9fb]"
      >
        Đặt lịch mới
      </button>
    </div>
  </div>
);

export default AppointmentBookingSuccess;
