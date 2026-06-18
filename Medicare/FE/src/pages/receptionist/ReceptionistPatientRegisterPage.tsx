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
