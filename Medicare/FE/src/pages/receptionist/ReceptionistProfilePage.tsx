import React, { useState } from 'react';
import { Camera, Eye, EyeOff, Lock, Save, UserRound } from 'lucide-react';
import { Avatar, Card } from '../../components/ui';
import Button from '../../components/ui/Button';

const inputClass =
  'w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#1a56db]';

const ReceptionistProfilePage: React.FC = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#1a56db]" style={{ fontFamily: 'Lexend' }}>
        Hồ sơ cá nhân
      </h1>

      {/* Profile header */}
      <Card>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <Avatar name="Nguyễn Thị Tâm An" size="lg" />
              <button
                type="button"
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#1a56db] text-white shadow ring-2 ring-white dark:ring-slate-800"
                aria-label="Đổi ảnh đại diện"
              >
                <Camera size={14} />
              </button>
            </div>
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40">
                Nhân viên y tế
              </span>
              <h2 className="mt-1 text-xl font-bold">Nguyễn Thị Tâm An</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">Lễ tân chính</p>
            </div>
          </div>
          <Button leftIcon={<Save size={16} />}>Lưu thay đổi</Button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic info */}
        <Card>
          <div className="mb-5 flex items-center gap-2">
