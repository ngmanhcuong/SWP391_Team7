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
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40">
              <UserRound size={18} />
            </span>
            <h2 className="text-base font-semibold">Thông tin cơ bản</h2>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
                  Họ và tên <span className="text-red-500">*</span>
                </span>
                <input type="text" defaultValue="Nguyễn Thị Tâm An" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">Chức danh</span>
                <input
                  type="text"
                  defaultValue="Lễ tân chính"
                  disabled
                  className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-slate-700/40`}
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
                Địa chỉ Email <span className="text-red-500">*</span>
              </span>
              <input type="email" defaultValue="taman.nguyen@medcare.vn" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
                Số điện thoại <span className="text-red-500">*</span>
              </span>
              <input type="tel" defaultValue="+84 0987 654 321" className={inputClass} />
            </label>
          </div>
        </Card>

        {/* Change password + actions */}
        <div className="space-y-6">
          <Card>
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40">
                <Lock size={18} />
              </span>
              <h2 className="text-base font-semibold">Đổi mật khẩu</h2>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">Mật khẩu cũ</span>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    defaultValue="password"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Hiện/ẩn mật khẩu"
                  >
                    {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">Mật khẩu mới</span>
                <input type="password" placeholder="Tối thiểu 8 ký tự" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">Xác nhận mật khẩu</span>
                <input type="password" placeholder="Nhập lại mật khẩu mới" className={inputClass} />
              </label>
            </div>
          </Card>

          <Card>
            <div className="space-y-3">
              <Button fullWidth leftIcon={<Save size={16} />}>Cập nhật thông tin</Button>
              <Button fullWidth variant="outline">Hủy</Button>
            </div>
            <p className="mt-3 text-center text-xs text-gray-400">Lần cập nhật cuối cùng: 2 ngày trước</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistProfilePage;
