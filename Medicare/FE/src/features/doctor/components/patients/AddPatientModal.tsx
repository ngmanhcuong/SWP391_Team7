import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  HeartPulse,
  Phone,
  Shield,
  UserRound,
  X,
} from 'lucide-react';
import Button from '../../../../components/ui/Button';
import { NewPatientFormData, NewPatientFormErrors, PatientHealthStatus } from '../../types';
import {
  calculateAgeFromDob,
  EMPTY_NEW_PATIENT_FORM,
  hasFormErrors,
  validateNewPatientForm,
} from '../../utils/newPatientForm';

interface AddPatientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: NewPatientFormData, options: { openRecord: boolean; addAnother: boolean }) => void;
}

const inputClassName =
  'w-full px-4 py-2.5 text-sm border border-[#c3c6d6]/60 rounded-xl outline-none transition-all bg-white text-[#191c1e] placeholder:text-[#737685] focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10';

const selectClassName =
  'w-full px-4 py-2.5 text-sm border border-[#c3c6d6]/60 rounded-xl outline-none transition-all bg-white text-[#191c1e] focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10';

const labelClassName = 'text-xs font-medium text-[#737685] block mb-1.5';

const errorClassName = 'text-xs text-rose-600 mt-1';

const BLOOD_TYPES = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PROVINCES = [
  '',
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Cần Thơ',
  'Bình Dương',
  'Đồng Nai',
  'Khánh Hòa',
];

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({
  icon,
  title,
  subtitle,
}) => (
  <div className="flex items-start gap-3 pb-3 border-b border-[#c3c6d6]/30">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f0fe] shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-[#191c1e]">{title}</h3>
      <p className="text-xs text-[#737685] mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const Field: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, required, error, children, className = '' }) => (
  <div className={className}>
    <label className={labelClassName}>
      {label}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className={errorClassName}>{error}</p>}
  </div>
);

const AddPatientModal: React.FC<AddPatientModalProps> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState<NewPatientFormData>(EMPTY_NEW_PATIENT_FORM);
  const [errors, setErrors] = useState<NewPatientFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const computedAge = useMemo(() => calculateAgeFromDob(form.dateOfBirth), [form.dateOfBirth]);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_NEW_PATIENT_FORM);
    setErrors({});
    setSubmitting(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const updateField = <K extends keyof NewPatientFormData>(field: K, value: NewPatientFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (openRecord: boolean, addAnother: boolean) => {
    const nextErrors = validateNewPatientForm(form);
    if (hasFormErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    onSubmit(form, { openRecord, addAnother });
    setSubmitting(false);

    if (addAnother) {
      setForm(EMPTY_NEW_PATIENT_FORM);
      setErrors({});
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#191c1e]/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Đóng"
      />

      <div className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-[#003d9b]/10 border border-[#c3c6d6]/50 flex flex-col overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#c3c6d6]/40 bg-[#f8f9fb]/50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#191c1e]">Thêm bệnh nhân mới</h2>
            <p className="text-sm text-[#737685] mt-0.5">
              Đăng ký hồ sơ theo chuẩn BYT — đầy đủ thông tin hành chính và y khoa
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#737685] hover:bg-white hover:text-[#191c1e] transition-colors"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <section className="space-y-4">
            <SectionHeader
              icon={<UserRound size={16} className="text-[#003d9b]" />}
              title="Thông tin hành chính"
              subtitle="Họ tên, giới tính, ngày sinh và định danh cá nhân"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Họ và tên" required error={errors.fullName} className="sm:col-span-2">
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className={inputClassName}
                />
              </Field>
              <Field label="Giới tính" required error={errors.gender}>
                <select
                  value={form.gender}
                  onChange={(e) => updateField('gender', e.target.value as NewPatientFormData['gender'])}
                  className={selectClassName}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </Field>
              <Field label="Ngày sinh" required error={errors.dateOfBirth}>
                <input
                  type="text"
                  value={form.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className={inputClassName}
                />
              </Field>
              <Field label="Tuổi" className="sm:col-span-1">
                <input
                  type="text"
                  readOnly
                  value={computedAge !== null ? `${computedAge} tuổi` : '—'}
                  className={`${inputClassName} bg-[#f8f9fb] cursor-default`}
                />
              </Field>
              <Field label="CCCD / CMND" error={errors.nationalId}>
                <input
                  type="text"
                  value={form.nationalId}
                  onChange={(e) => updateField('nationalId', e.target.value)}
                  placeholder="12 chữ số"
                  className={inputClassName}
                />
              </Field>
              <Field label="Nhóm máu">
                <select
                  value={form.bloodType}
                  onChange={(e) => updateField('bloodType', e.target.value)}
                  className={selectClassName}
                >
                  {BLOOD_TYPES.map((type) => (
                    <option key={type || 'empty'} value={type}>
                      {type || 'Chưa xác định'}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader
              icon={<Phone size={16} className="text-[#003d9b]" />}
              title="Liên hệ & địa chỉ"
              subtitle="Thông tin liên lạc và người thân liên hệ khẩn cấp"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Số điện thoại" required error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="0901234567"
                  className={inputClassName}
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="email@example.com"
                  className={inputClassName}
                />
              </Field>
              <Field label="Địa chỉ thường trú" required error={errors.address} className="sm:col-span-2">
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Số nhà, đường, phường/xã"
                  className={inputClassName}
                />
              </Field>
              <Field label="Tỉnh / Thành phố">
                <select
                  value={form.province}
                  onChange={(e) => updateField('province', e.target.value)}
                  className={selectClassName}
                >
                  {PROVINCES.map((province) => (
                    <option key={province || 'empty'} value={province}>
                      {province || 'Chọn tỉnh/thành'}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Người liên hệ khẩn cấp">
                <input
                  type="text"
                  value={form.emergencyContactName}
                  onChange={(e) => updateField('emergencyContactName', e.target.value)}
                  placeholder="Họ tên người thân"
                  className={inputClassName}
                />
              </Field>
              <Field label="SĐT liên hệ khẩn cấp" error={errors.emergencyContactPhone}>
                <input
                  type="tel"
                  value={form.emergencyContactPhone}
                  onChange={(e) => updateField('emergencyContactPhone', e.target.value)}
                  placeholder="090..."
                  className={inputClassName}
                />
              </Field>
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader
              icon={<Shield size={16} className="text-[#003d9b]" />}
              title="Bảo hiểm y tế"
              subtitle="Thông tin thẻ BHYT theo quy định Bộ Y tế"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Trạng thái BHYT">
                <select
                  value={form.insuranceStatus}
                  onChange={(e) =>
                    updateField('insuranceStatus', e.target.value as NewPatientFormData['insuranceStatus'])
                  }
                  className={selectClassName}
                >
                  <option value="none">Không có / chưa cập nhật</option>
                  <option value="active">Còn hiệu lực</option>
                  <option value="inactive">Hết hiệu lực</option>
                </select>
              </Field>
              <Field label="Số thẻ BHYT" error={errors.insuranceNumber}>
                <input
                  type="text"
                  value={form.insuranceNumber}
                  onChange={(e) => updateField('insuranceNumber', e.target.value)}
                  placeholder="DN4 80 1234567890123456"
                  className={inputClassName}
                  disabled={form.insuranceStatus === 'none'}
                />
              </Field>
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader
              icon={<HeartPulse size={16} className="text-[#003d9b]" />}
              title="Thông tin y khoa"
              subtitle="Dị ứng, tiền sử bệnh và trạng thái tiếp nhận"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Dị ứng thuốc / thực phẩm">
                <input
                  type="text"
                  value={form.allergies}
                  onChange={(e) => updateField('allergies', e.target.value)}
                  placeholder="Penicillin, hải sản (phân cách bằng dấu phẩy)"
                  className={inputClassName}
                />
              </Field>
              <Field label="Tiền sử bệnh nền">
                <input
                  type="text"
                  value={form.medicalHistory}
                  onChange={(e) => updateField('medicalHistory', e.target.value)}
                  placeholder="Tăng huyết áp, đái tháo đường..."
                  className={inputClassName}
                />
              </Field>
              <Field label="Trạng thái tiếp nhận" required className="sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { value: 'waiting', label: 'Chờ khám' },
                      { value: 'stable', label: 'Ổn định' },
                      { value: 'monitoring', label: 'Cần theo dõi' },
                    ] as { value: PatientHealthStatus; label: string }[]
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField('healthStatus', option.value)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                        form.healthStatus === option.value
                          ? 'bg-[#003d9b] text-white border-[#003d9b]'
                          : 'bg-white text-[#434654] border-[#c3c6d6]/60 hover:border-[#003d9b]/40'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Ghi chú lâm sàng ban đầu" className="sm:col-span-2">
                <textarea
                  rows={3}
                  value={form.clinicalNotes}
                  onChange={(e) => updateField('clinicalNotes', e.target.value)}
                  placeholder="Triệu chứng chính, lý do đến khám, yêu cầu của bệnh nhân..."
                  className={`${inputClassName} resize-y`}
                />
              </Field>
            </div>
          </section>

          {hasFormErrors(errors) && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>Vui lòng kiểm tra lại các trường bắt buộc được đánh dấu đỏ.</p>
            </div>
          )}
        </div>

        <div className="shrink-0 px-5 py-4 border-t border-[#c3c6d6]/40 bg-[#f8f9fb]/50 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <Button variant="ghost" onClick={onClose} className="text-[#434654]">
            Hủy
          </Button>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => handleSubmit(false, true)}
              loading={submitting}
              className="border-[#c3c6d6] text-[#434654]"
            >
              Lưu & thêm tiếp
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmit(false, false)}
              loading={submitting}
              className="border-[#003d9b] text-[#003d9b] hover:bg-[#e8f0fe]"
            >
              Lưu bệnh nhân
            </Button>
            <Button
              onClick={() => handleSubmit(true, false)}
              loading={submitting}
              className="bg-[#003d9b] border-[#003d9b] hover:bg-[#002d75]"
            >
              Lưu & mở hồ sơ khám
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;
