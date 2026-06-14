import React from 'react';
import {
  Building2,
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  User,
} from 'lucide-react';
import { Avatar } from '../../../components/ui';
import { User as AuthUser } from '../../../types';
import { formatCurrencyVnd, getConsultationFee, getDepositAmount } from '../constants/consultationFees';
import { MedicalSpecialty } from '../constants/medicalSpecialties';
import { AiSymptomAnalysis, BookingDoctor, DepositPaymentMethod } from '../types';
import { formatScheduleDate, formatScheduleDateShort } from '../utils/buildDoctorSchedule';
import DepositPaymentSection from './DepositPaymentSection';

interface ConfirmationSectionProps {
  patient: AuthUser | null;
  symptoms: string;
  specialty: MedicalSpecialty | null;
  doctor: BookingDoctor | null;
  selectedDate: string | null;
  selectedTime: string | null;
  aiAnalysis: AiSymptomAnalysis | null;
  additionalNotes: string;
  agreedToTerms: boolean;
  depositPaymentMethod: DepositPaymentMethod | null;
  depositPaid: boolean;
  isPayingDeposit: boolean;
  onAdditionalNotesChange: (value: string) => void;
  onAgreedToTermsChange: (value: boolean) => void;
  onDepositPaymentMethodChange: (method: DepositPaymentMethod) => void;
  onPayDeposit: () => void;
  onEditStep: (step: 1 | 2 | 3 | 4) => void;
}

interface ReviewRowProps {
  label: string;
  value: React.ReactNode;
  onEdit?: () => void;
}

const ReviewRow: React.FC<ReviewRowProps> = ({ label, value, onEdit }) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-[#c3c6d6] last:border-0">
    <div className="min-w-0">
      <p className="text-sm text-[#434654]">{label}</p>
      <div className="text-base text-[#191c1e] mt-0.5">{value}</div>
    </div>
    {onEdit && (
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 text-sm font-medium text-[#003d9b] hover:underline"
      >
        Sửa
      </button>
    )}
  </div>
);

const ConfirmationSection: React.FC<ConfirmationSectionProps> = ({
  patient,
  symptoms,
  specialty,
  doctor,
  selectedDate,
  selectedTime,
  aiAnalysis,
  additionalNotes,
  agreedToTerms,
  depositPaymentMethod,
  depositPaid,
  isPayingDeposit,
  onAdditionalNotesChange,
  onAgreedToTermsChange,
  onDepositPaymentMethodChange,
  onPayDeposit,
  onEditStep,
}) => {
  const consultationFee = getConsultationFee(specialty?.id ?? null);
  const depositAmount = getDepositAmount(specialty?.id ?? null);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="space-y-6">
        <header className="space-y-1">
          <h2 className="text-2xl font-semibold text-[#191c1e]">Xác nhận thông tin đặt lịch</h2>
          <p className="text-base text-[#434654]">
            Kiểm tra lại thông tin trước khi hoàn tất đặt lịch khám.
          </p>
        </header>

        <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-[#c3c6d6] px-6 py-4 flex items-center gap-2">
            <User size={18} className="text-[#003d9b]" />
            <h3 className="text-lg font-medium text-[#191c1e]">Thông tin bệnh nhân</h3>
          </div>
          <div className="px-6 py-2">
            <ReviewRow
              label="Họ và tên"
              value={patient?.fullName ?? 'Chưa cập nhật'}
            />
            <ReviewRow
              label="Email"
              value={
                <span className="inline-flex items-center gap-2">
                  <Mail size={14} className="text-[#434654]" />
                  {patient?.email ?? 'Chưa cập nhật'}
                </span>
              }
            />
            <ReviewRow
              label="Số điện thoại"
              value={
                <span className="inline-flex items-center gap-2">
                  <Phone size={14} className="text-[#434654]" />
                  {patient?.phone ?? 'Chưa cập nhật'}
                </span>
              }
            />
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-[#c3c6d6] px-6 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Stethoscope size={18} className="text-[#003d9b]" />
              <h3 className="text-lg font-medium text-[#191c1e]">Triệu chứng</h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-sm font-medium text-[#003d9b] hover:underline"
            >
              Sửa
            </button>
          </div>
          <div className="px-6 py-5 space-y-3">
            <p className="text-base text-[#191c1e] whitespace-pre-wrap leading-6">{symptoms}</p>
            {aiAnalysis && (
              <div className="rounded-lg bg-[#f8f9fb] border border-[#c3c6d6] px-4 py-3 text-sm text-[#434654]">
                <span className="font-medium text-[#003d9b]">Gợi ý AI: </span>
                {aiAnalysis.summary}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-[#c3c6d6] px-6 py-4 flex items-center gap-2">
            <Calendar size={18} className="text-[#003d9b]" />
            <h3 className="text-lg font-medium text-[#191c1e]">Chi tiết lịch hẹn</h3>
          </div>
          <div className="px-6 py-2">
            <ReviewRow
              label="Chuyên khoa"
              value={specialty?.name ?? '—'}
              onEdit={() => onEditStep(2)}
            />
            <ReviewRow
              label="Bác sĩ phụ trách"
              value={
                doctor ? (
                  <div className="flex items-center gap-3 mt-1">
                    <div
                      className="rounded-lg border border-[#c3c6d6] p-0.5 shrink-0"
                      style={{ background: doctor.avatarBg }}
                    >
                      <Avatar name={doctor.name} size="sm" className="rounded-lg" />
                    </div>
                    <span>{doctor.name}</span>
                  </div>
                ) : (
                  '—'
                )
              }
              onEdit={() => onEditStep(3)}
            />
            <ReviewRow
              label="Ngày khám"
              value={selectedDate ? formatScheduleDate(selectedDate) : '—'}
              onEdit={() => onEditStep(4)}
            />
            <ReviewRow
              label="Giờ khám"
              value={
                selectedTime ? (
                  <span className="inline-flex items-center gap-2">
                    <Clock size={14} className="text-[#434654]" />
                    {selectedTime}
                  </span>
                ) : (
                  '—'
                )
              }
              onEdit={() => onEditStep(4)}
            />
            <ReviewRow
              label="Địa điểm"
              value={
                <span className="space-y-1 block">
                  <span className="inline-flex items-center gap-2">
                    <Building2 size={14} className="text-[#434654]" />
                    MedCare Clinic - Phòng khám đa khoa
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-[#434654]">
                    <MapPin size={14} />
                    123 Nguyễn Trãi, Quận 1, TP.HCM
                  </span>
                </span>
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <DepositPaymentSection
          specialtyId={specialty?.id ?? null}
          paymentMethod={depositPaymentMethod}
          depositPaid={depositPaid}
          isPayingDeposit={isPayingDeposit}
          onPaymentMethodChange={onDepositPaymentMethodChange}
          onPayDeposit={onPayDeposit}
        />

        <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-[#c3c6d6] px-6 py-5">
            <h3 className="text-lg font-medium text-[#191c1e]">Chi phí dự kiến</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 text-sm text-[#434654]">
              <span>Phí khám ban đầu</span>
              <span>{formatCurrencyVnd(consultationFee)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm text-[#434654]">
              <span>Tiền cọc đã/ cần thanh toán</span>
              <span className={depositPaid ? 'text-[#006c47] font-medium' : 'text-[#003d9b] font-medium'}>
                {formatCurrencyVnd(depositAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm text-[#434654]">
              <span>Còn lại khi khám</span>
              <span>{formatCurrencyVnd(consultationFee - depositAmount)}</span>
            </div>
            <div className="border-t border-[#c3c6d6] pt-4 flex items-center justify-between gap-3">
              <span className="text-base font-medium text-[#191c1e]">Tổng phí khám</span>
              <span className="text-xl font-semibold text-[#003d9b]">
                {formatCurrencyVnd(consultationFee)}
              </span>
            </div>
            <p className="text-xs text-[#434654] leading-5">
              Tiền cọc được trừ vào phí khám. Phần còn lại thanh toán tại quầy sau khi lễ tân xác
              nhận cọc và bác sĩ xác nhận lịch.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm p-6 space-y-3">
          <label htmlFor="booking-notes" className="text-base font-medium text-[#191c1e]">
            Ghi chú thêm (tuỳ chọn)
          </label>
          <textarea
            id="booking-notes"
            value={additionalNotes}
            onChange={(event) => onAdditionalNotesChange(event.target.value)}
            placeholder="Ví dụ: Tôi cần phiên dịch, mang theo kết quả xét nghiệm cũ..."
            rows={4}
            className="w-full resize-y rounded-lg border border-[#c3c6d6] bg-[#f8f9fb] px-4 py-3 text-base text-[#191c1e] placeholder:text-[#6b7280] outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
          />
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-[#c3c6d6] bg-[#f8f9fb] p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(event) => onAgreedToTermsChange(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[#c3c6d6] text-[#003d9b] focus:ring-[#003d9b]"
          />
          <span className="text-sm text-[#434654] leading-5">
            Tôi xác nhận thông tin trên là chính xác và đồng ý với{' '}
            <span className="text-[#003d9b] font-medium">điều khoản sử dụng</span> cũng như{' '}
            <span className="text-[#003d9b] font-medium">chính sách bảo mật</span> của MedCare Clinic.
          </span>
        </label>

        {selectedDate && selectedTime && (
          <div className="rounded-lg border border-[#006c47]/20 bg-[#006c47]/5 px-4 py-3 text-sm text-[#006c47]">
            Lịch hẹn: {formatScheduleDateShort(selectedDate)} · {selectedTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationSection;
