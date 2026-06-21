import React from 'react';
import { Avatar, Card } from '../../components/ui';
import Input from '../../components/ui/Input';
import { useAdminProfile } from '../../features/admin/hooks';

export const AdminProfilePage: React.FC = () => {
  const { profile } = useAdminProfile();

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
          Thông tin tài khoản
        </h1>
        <p className="text-gray-500 dark:text-slate-400">
          Thông tin cá nhân của quản trị viên (chỉ xem)
        </p>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="flex border-b border-gray-100 dark:border-slate-700 px-4 py-3">
          <span className="text-sm font-medium text-[#1a56db]">
            Thông tin cá nhân
          </span>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-5">
            <Avatar name={profile.fullName} src={profile.avatar} size="xl" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Họ và tên" value={profile.fullName} disabled />
            <Input label="Mã nhân viên" value={profile.employeeId} disabled />
            <Input label="Email liên hệ" value={profile.email} disabled />
            <Input label="Số điện thoại" value={profile.phone} disabled />
            <div className="sm:col-span-2">
              <Input label="Vai trò" value={profile.role} disabled />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
            <p className="text-sm text-gray-400 italic">
              Quản trị viên không thể chỉnh sửa thông tin cá nhân.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminProfilePage;

