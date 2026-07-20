import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle2, Info, Monitor, Save, Trash2, UserPlus, X } from 'lucide-react';
import { Avatar, Card, Modal } from '../../components/ui';
import Button from '../../components/ui/Button';
import { useCreatePatient } from '../../features/receptionist/hooks';

type Gender = 'male' | 'female';

interface FormState {
  fullName: string;
  idNumber: string;
  dob: string;
  gender: Gender | null;
  phone: string;
  email: string;
  address: string;
  insuranceCode: string;
  insuranceExpiry: string;
  insurancePlace: string;
  emergencyPhone: string;
  occupation: string;
  height: string;
  weight: string;
  bio: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  fullName: '',
  idNumber: '',
  dob: '',
  gender: null,
  phone: '',
  email: '',
  address: '',
  insuranceCode: '',
  insuranceExpiry: '',
  insurancePlace: '',
  emergencyPhone: '',
  occupation: '',
  height: '',
  weight: '',
  bio: '',
};

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

const baseInput =
  'w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 transition-colors';

const inputClass = (hasError?: boolean) =>
  `${baseInput} ${
    hasError
      ? 'border-red-400 focus:border-red-500'
      : 'border-gray-200 dark:border-slate-600 focus:border-[#1a56db]'
  }`;

const Field: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, required, error, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    {children}
    {error && <span className="mt-1 block text-xs font-medium text-red-500">{error}</span>}
  </label>
);

const todayISO = () => new Date().toISOString().split('T')[0];

const validate = (form: FormState): FormErrors => {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên.';
  else if (form.fullName.trim().length < 2) errors.fullName = 'Họ và tên quá ngắn.';

  if (form.idNumber.trim() && !/^(\d{9}|\d{12})$/.test(form.idNumber.trim())) {
    errors.idNumber = 'CCCD/CMND phải gồm 9 hoặc 12 chữ số.';
  }

  if (!form.dob) errors.dob = 'Vui lòng chọn ngày sinh.';
  else if (form.dob > todayISO()) errors.dob = 'Ngày sinh không hợp lệ.';
  else if (Number(form.dob.slice(0, 4)) < 1900) errors.dob = 'Ngày sinh không hợp lệ.';

  if (!form.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại.';
  else if (!/^0\d{9}$/.test(form.phone.trim())) {
    errors.phone = 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.';
  }

  if (form.emergencyPhone.trim() && !/^0\d{9}$/.test(form.emergencyPhone.trim())) {
    errors.emergencyPhone = 'SĐT khẩn cấp phải gồm 10 chữ số và bắt đầu bằng 0.';
  }

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Email không hợp lệ.';
  }

  if (!form.insuranceCode.trim()) errors.insuranceCode = 'Vui lòng nhập mã bảo hiểm.';

  if (!form.height.trim()) errors.height = 'Vui lòng nhập chiều cao.';
  else if (Number.isNaN(Number(form.height)) || Number(form.height) <= 0) {
    errors.height = 'Chiều cao phải lớn hơn 0.';
  }

  if (!form.weight.trim()) errors.weight = 'Vui lòng nhập cân nặng.';
  else if (Number.isNaN(Number(form.weight)) || Number(form.weight) <= 0) {
    errors.weight = 'Cân nặng phải lớn hơn 0.';
  }

  if (form.insuranceCode.trim() && form.insuranceExpiry && form.insuranceExpiry < todayISO()) {
    errors.insuranceExpiry = 'Thẻ BHYT đã hết hạn.';
  }

  return errors;
};

const ReceptionistPatientRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createPatient = useCreatePatient();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(
    () => () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    },
    [avatarPreview],
  );

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(EMPTY_FORM) || avatarPreview !== null,
    [form, avatarPreview],
  );

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const onlyDigits = (value: string, maxLen: number) => value.replace(/\D/g, '').slice(0, maxLen);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarError(null);
    if (!file.type.startsWith('image/')) {
      setAvatarError('Tệp phải là hình ảnh.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError('Ảnh tối đa 5MB.');
      return;
    }
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const removeAvatar = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
    setAvatarError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
    removeAvatar();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      const firstField = document.querySelector('[data-error="true"]');
      firstField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setToast('Vui lòng kiểm tra lại các trường còn thiếu hoặc chưa hợp lệ.');
      return;
    }

    createPatient.mutate(
      {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        nationalId: form.idNumber.trim() || undefined,
        dob: form.dob,
        gender: form.gender ?? undefined,
        address: form.address.trim() || undefined,
        email: form.email.trim() || undefined,
        emergencyPhone: form.emergencyPhone.trim() || undefined,
        occupation: form.occupation.trim() || undefined,
        bio: form.bio.trim() || undefined,
        height: Number(form.height),
        weight: Number(form.weight),
        insurance: {
          code: form.insuranceCode.trim(),
          expiry: form.insuranceExpiry || null,
          place: form.insurancePlace.trim(),
        },
      },
      {
        onSuccess: (patient) => setSavedCode(patient.code),
        onError: (err: unknown) => {
          const message =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Không thể lưu hồ sơ. Vui lòng thử lại.';
          setToast(message);
        },
      },
    );
  };

  const handleCancel = () => {
    if (isDirty) setConfirmCancel(true);
    else navigate('/receptionist');
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-[1200px] space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Lexend' }}>
          Đăng ký bệnh nhân mới
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          <span>Bệnh nhân</span> <span className="mx-1">›</span>{' '}
          <span className="font-medium text-[#1a56db]">Đăng ký mới</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40">
                <UserPlus size={18} />
              </span>
              <h2 className="text-base font-semibold">Thông tin cá nhân</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Họ và tên" required error={errors.fullName}>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  data-error={Boolean(errors.fullName)}
                  placeholder="VD: Nguyễn Văn A"
                  className={inputClass(Boolean(errors.fullName))}
                />
              </Field>

              <Field label="Ngày sinh" required error={errors.dob}>
                <input
                  type="date"
                  value={form.dob}
                  max={todayISO()}
                  onChange={(e) => setField('dob', e.target.value)}
                  data-error={Boolean(errors.dob)}
                  className={inputClass(Boolean(errors.dob))}
                />
              </Field>

              <Field label="Mã bảo hiểm" required error={errors.insuranceCode}>
                <input
                  type="text"
                  value={form.insuranceCode}
                  onChange={(e) => setField('insuranceCode', e.target.value.toUpperCase())}
                  data-error={Boolean(errors.insuranceCode)}
                  placeholder="VD: BHYT123456"
                  className={inputClass(Boolean(errors.insuranceCode))}
                />
              </Field>

              <Field label="Giới tính">
                <div className="grid grid-cols-2 gap-3">
                  {(['male', 'female'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setField('gender', g)}
                      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                        form.gender === g
                          ? 'border-[#1a56db] bg-blue-50/60 text-[#1a56db] dark:bg-blue-950/20'
                          : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className={`h-3.5 w-3.5 rounded-full border ${
                          form.gender === g ? 'border-[#1a56db] bg-[#1a56db]' : 'border-gray-300'
                        }`}
                      />
                      {g === 'male' ? 'Nam' : 'Nữ'}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Chiều cao (cm)" required error={errors.height}>
                <input
                  type="number"
                  min="1"
                  value={form.height}
                  onChange={(e) => setField('height', e.target.value)}
                  data-error={Boolean(errors.height)}
                  placeholder="VD: 170"
                  className={inputClass(Boolean(errors.height))}
                />
              </Field>

              <Field label="Cân nặng (kg)" required error={errors.weight}>
                <input
                  type="number"
                  min="1"
                  value={form.weight}
                  onChange={(e) => setField('weight', e.target.value)}
                  data-error={Boolean(errors.weight)}
                  placeholder="VD: 60"
                  className={inputClass(Boolean(errors.weight))}
                />
              </Field>

              <Field label="Số điện thoại" required error={errors.phone}>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => setField('phone', onlyDigits(e.target.value, 10))}
                  data-error={Boolean(errors.phone)}
                  placeholder="090..."
                  className={inputClass(Boolean(errors.phone))}
                />
              </Field>

              <Field label="SĐT khẩn cấp" error={errors.emergencyPhone}>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.emergencyPhone}
                  onChange={(e) => setField('emergencyPhone', onlyDigits(e.target.value, 10))}
                  data-error={Boolean(errors.emergencyPhone)}
                  placeholder="0901234567"
                  className={inputClass(Boolean(errors.emergencyPhone))}
                />
              </Field>

              <Field label="Số CCCD/CMND" error={errors.idNumber}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.idNumber}
                  onChange={(e) => setField('idNumber', onlyDigits(e.target.value, 12))}
                  data-error={Boolean(errors.idNumber)}
                  placeholder="9 hoặc 12 chữ số"
                  className={inputClass(Boolean(errors.idNumber))}
                />
              </Field>

              <Field label="Nghề nghiệp">
                <input
                  type="text"
                  value={form.occupation}
                  onChange={(e) => setField('occupation', e.target.value)}
                  placeholder="VD: Kỹ sư phần mềm"
                  className={inputClass()}
                />
              </Field>

              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  data-error={Boolean(errors.email)}
                  placeholder="example@gmail.com"
                  className={inputClass(Boolean(errors.email))}
                />
              </Field>

              <Field label="Địa chỉ" className="sm:col-span-2">
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setField('address', e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  className={inputClass()}
                />
              </Field>

              <Field label="Bệnh sử" className="sm:col-span-2">
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setField('bio', e.target.value)}
                  placeholder="Liệt kê các bệnh lý đang điều trị hoặc tiền sử bệnh..."
                  className={`${inputClass()} resize-none`}
                />
              </Field>
            </div>
          </Card>

          <Card>
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40">
                <Monitor size={18} />
              </span>
              <h2 className="text-base font-semibold">Thông tin BHYT</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Hạn dùng đến ngày" error={errors.insuranceExpiry}>
                <input
                  type="date"
                  value={form.insuranceExpiry}
                  onChange={(e) => setField('insuranceExpiry', e.target.value)}
                  data-error={Boolean(errors.insuranceExpiry)}
                  className={inputClass(Boolean(errors.insuranceExpiry))}
                />
              </Field>
              <Field label="Nơi đăng ký KCB ban đầu">
                <input
                  type="text"
                  value={form.insurancePlace}
                  onChange={(e) => setField('insurancePlace', e.target.value)}
                  placeholder="Tên bệnh viện/phòng khám"
                  className={inputClass()}
                />
              </Field>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#1e40af] p-5 text-white shadow-lg">
            <div className="mb-3 flex items-center gap-2">
              <Info size={18} />
              <h2 className="text-base font-semibold">Hướng dẫn</h2>
            </div>
            <ul className="space-y-2 text-sm text-blue-50">
              <li className="flex gap-2">
                <span>•</span> Các trường bắt buộc đã được đồng bộ giống hồ sơ bệnh nhân tự cập nhật.
              </li>
              <li className="flex gap-2">
                <span>•</span> Cần nhập đủ ngày sinh, mã bảo hiểm, chiều cao, cân nặng và số điện thoại trước khi lưu.
              </li>
              <li className="flex gap-2">
                <span>•</span> CCCD/CMND, email, nghề nghiệp và bệnh sử là thông tin bổ sung nếu bệnh nhân cung cấp.
              </li>
            </ul>
          </div>

          <Card>
            <h2 className="mb-3 text-base font-semibold">Ảnh bệnh nhân</h2>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleAvatarChange}
              className="hidden"
            />
            {avatarPreview ? (
              <div className="flex flex-col items-center gap-3">
                <Avatar src={avatarPreview} name={form.fullName} size="xl" />
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Đổi ảnh
                  </Button>
                  <Button type="button" size="sm" variant="ghost" leftIcon={<Trash2 size={14} />} onClick={removeAvatar}>
                    Xóa
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-10 text-gray-400 transition-colors hover:border-[#1a56db] hover:text-[#1a56db]"
              >
                <Camera size={32} />
                <span className="text-sm font-medium">Tải ảnh lên hoặc chụp ảnh</span>
              </button>
            )}
            {avatarError && <p className="mt-2 text-center text-xs font-medium text-red-500">{avatarError}</p>}
          </Card>

          <Card>
            <h2 className="mb-3 text-base font-semibold">Hành động</h2>
            <div className="space-y-3">
              <Button type="submit" fullWidth loading={createPatient.isPending} leftIcon={<Save size={16} />}>
                Lưu thông tin
              </Button>
              <Button type="button" fullWidth variant="outline" leftIcon={<X size={16} />} onClick={handleCancel}>
                Hủy bỏ
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-gray-400">
              Dữ liệu sẽ được lưu đồng bộ với chuẩn hồ sơ bệnh nhân của hệ thống.
            </p>
          </Card>
        </div>
      </div>

      <Modal
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Hủy đăng ký?"
        description="Các thông tin đã nhập sẽ không được lưu."
        size="sm"
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setConfirmCancel(false)}>
              Tiếp tục nhập
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                setConfirmCancel(false);
                resetForm();
                navigate('/receptionist');
              }}
            >
              Hủy và thoát
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Bạn có chắc chắn muốn hủy đăng ký bệnh nhân này không?
        </p>
      </Modal>

      <Modal
        open={savedCode !== null}
        onClose={() => setSavedCode(null)}
        title="Đăng ký thành công"
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSavedCode(null);
                resetForm();
              }}
            >
              Đăng ký người khác
            </Button>
            <Button type="button" onClick={() => navigate('/receptionist')}>
              Về trang lễ tân
            </Button>
          </>
        }
      >
        <div className="text-center">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={30} />
          </span>
          <p className="text-sm text-gray-500 dark:text-slate-400">Đã tạo hồ sơ cho</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{form.fullName}</p>
          <p className="mt-2 inline-block rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-[#1a56db] dark:bg-blue-950/40">
            Mã bệnh nhân: {savedCode}
          </p>
        </div>
      </Modal>

      {toast && (
        <div
          role="status"
          className="animate-fade-up fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          <Info size={18} className="text-amber-400" />
          {toast}
        </div>
      )}
    </form>
  );
};

export default ReceptionistPatientRegisterPage;
