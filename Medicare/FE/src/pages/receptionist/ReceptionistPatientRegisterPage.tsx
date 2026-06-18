import React, { useState } from 'react';
import { Camera, Info, Monitor, Save, UserPlus, X } from 'lucide-react';
import { Card } from '../../components/ui';
import Button from '../../components/ui/Button';

const inputClass =
  'w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#1a56db]';

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode; className?: string }> = ({
  label,
  required,
  children,
  className = '',
}) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    {children}
  </label>
);

const ReceptionistPatientRegisterPage: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
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
        {/* Left: form */}
        <div className="space-y-6">
          {/* Personal info */}
          <Card>
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40">
                <UserPlus size={18} />
              </span>
              <h2 className="text-base font-semibold">Thông tin cá nhân</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Họ và tên" required>
                <input type="text" placeholder="VD: Nguyễn Văn A" className={inputClass} />
              </Field>
              <Field label="Số CCCD/CMND" required>
                <input type="text" placeholder="12 chữ số" className={inputClass} />
              </Field>

              <Field label="Ngày sinh" required>
                <input type="text" placeholder="mm/dd/yyyy" className={inputClass} />
              </Field>
              <Field label="Giới tính" required>
                <div className="grid grid-cols-2 gap-3">
                  {(['male', 'female'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                        gender === g
                          ? 'border-[#1a56db] bg-blue-50/60 text-[#1a56db] dark:bg-blue-950/20'
                          : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className={`h-3.5 w-3.5 rounded-full border ${
                          gender === g ? 'border-[#1a56db] bg-[#1a56db]' : 'border-gray-300'
                        }`}
                      />
                      {g === 'male' ? 'Nam' : 'Nữ'}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Số điện thoại" required>
                <input type="tel" placeholder="090..." className={inputClass} />
              </Field>
              <Field label="Email">
                <input type="email" placeholder="example@gmail.com" className={inputClass} />
              </Field>

              <Field label="Địa chỉ thường trú" required className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  className={inputClass}
                />
              </Field>
            </div>
          </Card>

          {/* BHYT info */}
          <Card>
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40">
                <Monitor size={18} />
              </span>
              <h2 className="text-base font-semibold">Thông tin BHYT</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mã số BHYT">
                <input type="text" placeholder="VD: DN479..." className={inputClass} />
              </Field>
              <Field label="Hạn dùng đến ngày">
                <input type="text" placeholder="mm/dd/yyyy" className={inputClass} />
              </Field>
              <Field label="Nơi đăng ký KCB ban đầu" className="sm:col-span-2">
                <input type="text" placeholder="Tên bệnh viện/phòng khám" className={inputClass} />
              </Field>
            </div>
          </Card>
        </div>

        {/* Right: sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#1e40af] p-5 text-white shadow-lg">
            <div className="mb-3 flex items-center gap-2">
              <Info size={18} />
              <h2 className="text-base font-semibold">Hướng dẫn</h2>
            </div>
            <ul className="space-y-2 text-sm text-blue-50">
              <li className="flex gap-2"><span>•</span> Cần CCCD/CMND bản gốc để đối chiếu.</li>
              <li className="flex gap-2"><span>•</span> Số điện thoại dùng để nhận mã OTP và thông báo lịch hẹn.</li>
              <li className="flex gap-2"><span>•</span> Các trường có dấu (*) là bắt buộc.</li>
            </ul>
          </div>

          <Card>
            <h2 className="mb-3 text-base font-semibold">Ảnh bệnh nhân</h2>
            <button
              type="button"
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 py-10 text-gray-400 transition-colors hover:border-[#1a56db] hover:text-[#1a56db]"
            >
              <Camera size={32} />
              <span className="text-sm font-medium">Tải ảnh lên hoặc Chụp ảnh</span>
            </button>
          </Card>

          <Card>
            <h2 className="mb-3 text-base font-semibold">Hành động</h2>
            <div className="space-y-3">
              <Button fullWidth leftIcon={<Save size={16} />}>Lưu thông tin</Button>
              <Button fullWidth variant="outline" leftIcon={<X size={16} />}>Hủy bỏ</Button>
            </div>
            <p className="mt-3 text-center text-xs text-gray-400">
              Dữ liệu sẽ được mã hóa an toàn theo tiêu chuẩn y tế.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistPatientRegisterPage;
