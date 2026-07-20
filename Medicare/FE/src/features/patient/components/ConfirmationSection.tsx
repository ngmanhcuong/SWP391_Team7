import React from 'react';
import {
  Building2,
  Calendar,
  Clock,
  Mail,
  MapPin,
  Pencil,
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
  icon?: React.ReactNode;
  onEdit?: () => void;
}

const ReviewRow: React.FC<ReviewRowProps> = ({ label, value, icon, onEdit }) => (
  <div className="flex items-start justify-between gap-4 py-3.5 border-b border-gray-100 last:border-0">
    <div className="min-w-0 flex items-start gap-3">
      {icon && <span className="mt-0.5 shrink-0 text-gray-400">{icon}</span>}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <div className="text-[15px] text-gray-900 mt-1">{value}</div>
      </div>
    </div>
    {onEdit && (
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-[#003d9b] shadow-sm transition-all hover:bg-blue-50 hover:border-blue-200"
      >
        <Pencil size={12} />
        Sửa
      </button>
    )}
  </div>
);

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  editButton?: React.ReactNode;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ icon, title, editButton, children }) => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
    <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/60 px-6 py-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#003d9b]/10">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      {editButton}
    </div>
    <div className="px-6 py-2">{children}</div>
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
          <h2 className="text-2xl font-bold text-gray-900">Xác nhận thông tin đặt lịch</h2>
          <p className="text-sm text-gray-500">
            Kiểm tra lại thông tin trước khi hoàn tất đặt lịch khám.
          </p>
        </header>

        {/* Patient info */}
        <SectionCard icon={<User size={16} className="text-[#003d9b]" />} title="Thông tin bệnh nhân">
          <ReviewRow
            label="Họ và tên"
            value={patient?.fullName ?? 'Chưa cập nhật'}
          />
          <ReviewRow
            label="Email"
            icon={<Mail size={14} />}
            value={patient?.email ?? 'Chưa cập nhật'}
          />
          <ReviewRow
            label="Số điện thoại"
            icon={<Phone size={14} />}
            value={patient?.phone ?? 'Chưa cập nhật'}
          />
        </SectionCard>

        {/* Symptoms */}
        <SectionCard
          icon={<Stethoscope size={16} className="text-[#003d9b]" />}
          title="Triệu chứng"
          editButton={
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-[#003d9b] shadow-sm transition-all hover:bg-blue-50 hover:border-blue-200"
            >
              <Pencil size={12} />
              Sửa
            </button>
          }
        >
          <div className="py-4 space-y-3">
            <p className="text-[15px] text-gray-900 whitespace-pre-wrap leading-7">{symptoms}</p>
            {aiAnalysis && (
              <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-4 py-3 text-sm text-gray-600">
                <span className="font-semibold text-[#003d9b]">Gợi ý AI: </span>
                {aiAnalysis.summary}
              </div>
            )}
          </div>
        </SectionCard>

        {/* Appointment details */}
        <SectionCard icon={<Calendar size={16} className="text-[#003d9b]" />} title="Chi tiết lịch hẹn">
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
                    className="shrink-0 overflow-hidden rounded-xl p-0.5"
                    style={{ background: doctor.avatarBg }}
                  >
                    <Avatar name={doctor.name} size="sm" className="rounded-xl" />
                  </div>
                  <span className="font-medium">{doctor.name}</span>
                </div>
              ) : (
                '—'
              )
            }
            onEdit={() => onEditStep(3)}
          />
          <ReviewRow
            label="Ngày khám"
            icon={<Calendar size={14} />}
            value={selectedDate ? formatScheduleDate(selectedDate) : '—'}
            onEdit={() => onEditStep(4)}
          />
          <ReviewRow
            label="Giờ khám"
            icon={<Clock size={14} />}
            value={selectedTime ?? '—'}
            onEdit={() => onEditStep(4)}
          />
          <ReviewRow
            label="Địa điểm"
            icon={<MapPin size={14} />}
            value={
              <span className="space-y-0.5 block">
                <span className="flex items-center gap-2">
                  <Building2 size={14} className="text-gray-400" />
                  MedCare Clinic - Phòng khám đa khoa
                </span>
                <span className="text-sm text-gray-500">
                  123 Nguyễn Trãi, Quận 1, TP.HCM
                </span>
              </span>
            }
          />
        </SectionCard>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <DepositPaymentSection
          specialtyId={specialty?.id ?? null}
          paymentMethod={depositPaymentMethod}
          depositPaid={depositPaid}
          isPayingDeposit={isPayingDeposit}
          onPaymentMethodChange={onDepositPaymentMethodChange}
          onPayDeposit={onPayDeposit}
        />

        {/* Cost summary */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/60 px-6 py-4">
            <h3 className="text-base font-semibold text-gray-900">Chi phí dự kiến</h3>
          </div>
          <div className="space-y-3 p-6">
            <div className="flex items-center justify-between gap-3 text-sm text-gray-500">
              <span>Phí khám ban đầu</span>
              <span>{formatCurrencyVnd(consultationFee)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-gray-500">Tiền cọc đã/ cần thanh toán</span>
              <span className={depositPaid ? 'font-semibold text-emerald-600' : 'font-semibold text-[#003d9b]'}>
                {formatCurrencyVnd(depositAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm text-gray-500">
              <span>Còn lại khi khám</span>
              <span>{formatCurrencyVnd(consultationFee - depositAmount)}</span>
            </div>
            <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-3">
              <span className="text-base font-semibold text-gray-900">Tổng phí khám</span>
              <span className="text-xl font-bold text-[#003d9b]">
                {formatCurrencyVnd(consultationFee)}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-5">
              Tiền cọc được trừ vào phí khám. Phần còn lại thanh toán tại quầy sau khi lễ tân xác
              nhận cọc và bác sĩ xác nhận lịch.
            </p>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
          <label htmlFor="booking-notes" className="text-sm font-semibold text-gray-900">
            Ghi chú thêm (tuỳ chọn)
          </label>
          <textarea
            id="booking-notes"
            value={additionalNotes}
            onChange={(event) => onAdditionalNotesChange(event.target.value)}
            placeholder="Ví dụ: Tôi cần phiên dịch, mang theo kết quả xét nghiệm cũ..."
            rows={4}
            className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
          />
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 cursor-pointer transition-colors hover:bg-blue-50/30">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(event) => onAgreedToTermsChange(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#003d9b] focus:ring-[#003d9b]"
          />
          <span className="text-sm text-gray-500 leading-5">
            Tôi xác nhận thông tin trên là chính xác và đồng ý với{' '}
            <span className="text-[#003d9b] font-medium">điều khoản sử dụng</span> cũng như{' '}
            <span className="text-[#003d9b] font-medium">chính sách bảo mật</span> của MedCare Clinic.
          </span>
        </label>

        {selectedDate && selectedTime && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-sm font-medium text-emerald-700">
            ✓ Lịch hẹn: {formatScheduleDateShort(selectedDate)} · {selectedTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationSection;
