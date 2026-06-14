import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Spinner } from '../../../components/ui';
import { APPOINTMENT_BOOKING_STEPS } from '../constants/appointmentBookingSteps';
import { AppointmentBookingStep } from '../types';
import { formatScheduleDateShort } from '../utils/buildDoctorSchedule';

interface AppointmentBookingFooterProps {
  currentStep: AppointmentBookingStep;
  canContinue: boolean;
  isSubmitting?: boolean;
  depositPaid?: boolean;
  onContinue: () => void;
  onBack?: () => void;
  selectedDoctorName?: string | null;
  selectedDate?: string | null;
  selectedTime?: string | null;
}

const getNextLabel = (currentStep: AppointmentBookingStep): string => {
  const nextStep = APPOINTMENT_BOOKING_STEPS.find((item) => item.step === currentStep + 1);
  if (!nextStep) return 'Hoàn tất đặt lịch';
  if (currentStep === 2) return 'Tiếp theo: Chọn bác sĩ';
  if (currentStep === 3) return 'Tiếp theo: Chọn thời gian';
  if (currentStep === 4) return 'Tiếp theo: Xác nhận';
  return `Tiếp tục: ${nextStep.label}`;
};

const getBackLabel = (currentStep: AppointmentBookingStep): string => {
  if (currentStep === 3) return 'Quay lại Bước 2';
  if (currentStep === 4) return 'Quay lại Bước 3';
  if (currentStep === 5) return 'Quay lại Bước 4';
  return 'Quay lại';
};

const AppointmentBookingFooter: React.FC<AppointmentBookingFooterProps> = ({
  currentStep,
  canContinue,
  isSubmitting = false,
  depositPaid = false,
  onContinue,
  onBack,
  selectedDoctorName,
  selectedDate,
  selectedTime,
}) => {
  if (currentStep === 3) {
    return (
      <div className="flex flex-col gap-4 border-t border-[#c3c6d6] pt-6 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 text-base text-[#434654] hover:text-[#003d9b] transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={16} />
          {getBackLabel(currentStep)}
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          {selectedDoctorName && (
            <p className="text-base text-[#434654] text-center sm:text-right">
              Bạn đang chọn:{' '}
              <span className="font-bold text-[#191c1e]">{selectedDoctorName}</span>
            </p>
          )}
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue || isSubmitting}
            className={`inline-flex items-center justify-center gap-2 rounded px-10 py-3 text-base shadow-sm transition-colors ${
              canContinue && !isSubmitting
                ? 'bg-[#003d9b] text-white hover:bg-[#002d75]'
                : 'bg-[#003d9b]/50 text-white cursor-not-allowed'
            }`}
          >
            {getNextLabel(currentStep)}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 4) {
    return (
      <div className="flex flex-col gap-4 border-t border-[#c3c6d6] pt-6 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 text-base text-[#434654] hover:text-[#003d9b] transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={16} />
          {getBackLabel(currentStep)}
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          {selectedDate && selectedTime && (
            <p className="text-base text-[#434654] text-center sm:text-right">
              Lịch đã chọn:{' '}
              <span className="font-bold text-[#191c1e]">
                {formatScheduleDateShort(selectedDate)} · {selectedTime}
              </span>
            </p>
          )}
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue || isSubmitting}
            className={`inline-flex items-center justify-center gap-2 rounded px-10 py-3 text-base shadow-sm transition-colors ${
              canContinue && !isSubmitting
                ? 'bg-[#003d9b] text-white hover:bg-[#002d75]'
                : 'bg-[#003d9b]/50 text-white cursor-not-allowed'
            }`}
          >
            {getNextLabel(currentStep)}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 5) {
    return (
      <div className="flex flex-col gap-4 border-t border-[#c3c6d6] pt-6 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 text-base text-[#434654] hover:text-[#003d9b] transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={16} />
          {getBackLabel(currentStep)}
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          {!depositPaid && (
            <p className="text-sm text-[#851800] text-center sm:text-right">
              Vui lòng đặt cọc trước khi đăng ký lịch hẹn
            </p>
          )}
          {depositPaid && !canContinue && (
            <p className="text-sm text-[#434654] text-center sm:text-right">
              Vui lòng đồng ý điều khoản để hoàn tất
            </p>
          )}
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue || isSubmitting}
            className={`inline-flex items-center justify-center gap-2 rounded px-10 py-3 text-base shadow-sm transition-colors min-w-[220px] ${
              canContinue && !isSubmitting
                ? 'bg-[#003d9b] text-white hover:bg-[#002d75]'
                : 'bg-[#003d9b]/50 text-white cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" color="#ffffff" />
                Đang đăng ký...
              </>
            ) : (
              <>
                {getNextLabel(currentStep)}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (currentStep >= 2) {
    return (
      <div className="flex flex-col gap-4 border-t border-[#c3c6d6] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-[#737685] px-6 py-3 text-base text-[#191c1e] hover:bg-[#f8f9fb] transition-colors"
        >
          <ArrowLeft size={16} />
          {getBackLabel(currentStep)}
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-base shadow-sm transition-colors ${
            canContinue
              ? 'bg-[#003d9b] text-white hover:bg-[#002d75]'
              : 'bg-[#003d9b]/50 text-white cursor-not-allowed'
          }`}
        >
          {getNextLabel(currentStep)}
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#c3c6d6] rounded-2xl shadow-sm px-4 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Link
        to="/patient"
        className="inline-flex items-center gap-2 px-6 py-3 text-base text-[#434654] hover:text-[#003d9b] transition-colors"
      >
        <ArrowLeft size={16} />
        Quay lại trang chủ
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          className="rounded-lg border border-[#c3c6d6] px-6 py-3 text-base text-[#191c1e] hover:bg-[#f8f9fb] transition-colors"
        >
          Lưu nháp
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3 text-base transition-colors ${
            canContinue
              ? 'bg-[#003d9b] text-white hover:bg-[#002d75]'
              : 'bg-[#e7e8ea] text-[#434654] cursor-not-allowed'
          }`}
        >
          {getNextLabel(currentStep)}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default AppointmentBookingFooter;
