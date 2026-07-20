import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarCheck, Save } from 'lucide-react';
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

const BackButton: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  label: string;
}> = ({ onClick, disabled, label }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
  >
    <ArrowLeft size={16} />
    {label}
  </button>
);

const ContinueButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  label: string;
  isSubmitting?: boolean;
}> = ({ onClick, disabled, label, isSubmitting }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2.5 rounded-xl px-8 py-3 text-sm font-semibold shadow-md transition-all ${
      !disabled
        ? 'bg-gradient-to-r from-[#003d9b] to-[#2563eb] text-white shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 active:scale-[0.98]'
        : 'cursor-not-allowed bg-gray-200 text-gray-400 shadow-none'
    }`}
  >
    {isSubmitting ? (
      <>
        <Spinner size="sm" color="#ffffff" />
        Đang đăng ký...
      </>
    ) : (
      <>
        {label}
        <ArrowRight size={16} />
      </>
    )}
  </button>
);

const InfoChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-600 text-center">
    {children}
  </p>
);

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
  // Step 1 — Home + Save + Continue
  if (currentStep === 1) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/patient"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Quay lại trang chủ
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
          >
            <Save size={15} />
            Lưu nháp
          </button>
          <ContinueButton
            onClick={onContinue}
            disabled={!canContinue}
            label={getNextLabel(currentStep)}
          />
        </div>
      </div>
    );
  }

  // Step 3 — Doctor selection
  if (currentStep === 3) {
    return (
      <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 lg:flex-row lg:items-center lg:justify-between">
        <BackButton onClick={onBack} disabled={isSubmitting} label={getBackLabel(currentStep)} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {selectedDoctorName && (
            <InfoChip>
              Bạn đang chọn:{' '}
              <span className="font-semibold text-gray-900">{selectedDoctorName}</span>
            </InfoChip>
          )}
          <ContinueButton
            onClick={onContinue}
            disabled={!canContinue || isSubmitting}
            label={getNextLabel(currentStep)}
          />
        </div>
      </div>
    );
  }

  // Step 4 — Time selection
  if (currentStep === 4) {
    return (
      <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 lg:flex-row lg:items-center lg:justify-between">
        <BackButton onClick={onBack} disabled={isSubmitting} label={getBackLabel(currentStep)} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {selectedDate && selectedTime && (
            <InfoChip>
              Lịch đã chọn:{' '}
              <span className="font-semibold text-gray-900">
                {formatScheduleDateShort(selectedDate)} · {selectedTime}
              </span>
            </InfoChip>
          )}
          <ContinueButton
            onClick={onContinue}
            disabled={!canContinue || isSubmitting}
            label={getNextLabel(currentStep)}
          />
        </div>
      </div>
    );
  }

  // Step 5 — Confirmation
  if (currentStep === 5) {
    return (
      <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 lg:flex-row lg:items-center lg:justify-between">
        <BackButton onClick={onBack} disabled={isSubmitting} label={getBackLabel(currentStep)} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {!depositPaid && (
            <p className="rounded-full border border-red-100 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-600 text-center">
              Vui lòng đặt cọc trước khi đăng ký lịch hẹn
            </p>
          )}
          {depositPaid && !canContinue && (
            <p className="rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-medium text-gray-500 text-center">
              Vui lòng đồng ý điều khoản để hoàn tất
            </p>
          )}
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue || isSubmitting}
            className={`inline-flex min-w-[220px] items-center justify-center gap-2.5 rounded-xl px-8 py-3 text-sm font-bold shadow-md transition-all ${
              canContinue && !isSubmitting
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 active:scale-[0.98]'
                : 'cursor-not-allowed bg-gray-200 text-gray-400 shadow-none'
            }`}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" color="#ffffff" />
                Đang đăng ký...
              </>
            ) : (
              <>
                <CalendarCheck size={18} />
                {getNextLabel(currentStep)}
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Steps 2+ generic
  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <BackButton onClick={onBack} label={getBackLabel(currentStep)} />
      <ContinueButton
        onClick={onContinue}
        disabled={!canContinue}
        label={getNextLabel(currentStep)}
      />
    </div>
  );
};

export default AppointmentBookingFooter;
