import React, { useState } from 'react';
import { Check, Pencil } from 'lucide-react';
import { Avatar, Card } from '../../components/ui';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAdminProfile } from '../../features/admin/hooks';

type ProfileTab = 'info' | 'password';

export const AdminProfilePage: React.FC = () => {
  const { profile, updateField, resetProfile, saveProfile, isSaving, savedAt } = useAdminProfile();
  const [tab, setTab] = useState<ProfileTab>('info');
  const [infoError, setInfoError] = useState('');

  const handleInfoSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile.fullName.trim()) {
      setInfoError('Vui lòng nhập họ và tên.');
      return;
    }
    if (!profile.email.includes('@')) {
      setInfoError('Email liên hệ không hợp lệ.');
      return;
    }
    if (!profile.phone.trim()) {
      setInfoError('Vui lòng nhập số điện thoại.');
      return;
    }
    setInfoError('');
    void saveProfile();
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
          Cài đặt tài khoản
        </h1>
        <p className="text-gray-500 dark:text-slate-400">
          Quản lý thông tin cá nhân và bảo mật tài khoản của bạn
        </p>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="flex border-b border-gray-100 dark:border-slate-700 px-2">
          <TabButton active={tab === 'info'} onClick={() => setTab('info')}>
            Thông tin cá nhân
          </TabButton>
          <TabButton active={tab === 'password'} onClick={() => setTab('password')}>
            Đổi mật khẩu
          </TabButton>
        </div>

        <div className="p-6">
          {tab === 'info' ? (
            <form onSubmit={handleInfoSubmit} className="space-y-6">
              {infoError && <div className="p-3 rounded-xl bg-red-50 text-sm text-red-600">{infoError}</div>}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <Avatar name={profile.fullName} src={profile.avatar} size="xl" />
                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#1a56db] text-white shadow hover:bg-[#1342a8] transition-colors"
                    title="Đổi ảnh đại diện"
                  >
                    <Pencil size={13} />
                  </button>
                </div>
                {savedAt && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
                    <Check size={16} />
                    Đã lưu lúc {savedAt.toLocaleTimeString('vi-VN')}
                  </span>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Họ và tên"
                  required
                  value={profile.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                />
                <Input label="Mã nhân viên" value={profile.employeeId} disabled />
                <Input
                  label="Email liên hệ"
                  type="email"
                  required
                  value={profile.email}
                  onChange={(event) => updateField('email', event.target.value)}
                />
                <Input
                  label="Số điện thoại"
                  required
                  value={profile.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                />
                <div className="sm:col-span-2">
                  <Input label="Vai trò" value={profile.role} disabled />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Ảnh đại diện (URL)"
                    placeholder="https://..."
                    value={profile.avatar ?? ''}
                    onChange={(event) => updateField('avatar', event.target.value)}
                    hint="Dán đường dẫn ảnh để xem avatar mới ngay trên hồ sơ."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                <Button type="button" variant="ghost" onClick={resetProfile}>
                  Hủy
                </Button>
                <Button type="submit" loading={isSaving} leftIcon={<Check size={16} />}>
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          ) : (
            <ChangePasswordForm />
          )}
        </div>
      </Card>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
      active
        ? 'border-[#1a56db] text-[#1a56db]'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {children}
  </button>
);

const ChangePasswordForm: React.FC = () => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setDone(false);
    if (!current.trim()) {
      setError('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (next.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }
    if (next === current) {
      setError('Mật khẩu mới không được trùng mật khẩu hiện tại.');
      return;
    }
    if (next !== confirm) {
      setError('Xác nhận mật khẩu không khớp.');
      return;
    }
    setError('');
    setDone(true);
    setCurrent('');
    setNext('');
    setConfirm('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {done && (
        <div className="p-3 rounded-xl bg-emerald-50 text-sm text-emerald-700">
          Đổi mật khẩu thành công.
        </div>
      )}
      {error && <div className="p-3 rounded-xl bg-red-50 text-sm text-red-600">{error}</div>}
      <Input
        label="Mật khẩu hiện tại"
        type="password"
        required
        value={current}
        onChange={(event) => setCurrent(event.target.value)}
      />
      <Input
        label="Mật khẩu mới"
        type="password"
        required
        value={next}
        onChange={(event) => setNext(event.target.value)}
        hint="Tối thiểu 8 ký tự"
      />
      <Input
        label="Xác nhận mật khẩu mới"
        type="password"
        required
        value={confirm}
        onChange={(event) => setConfirm(event.target.value)}
      />
      <div className="flex justify-end pt-2">
        <Button type="submit" leftIcon={<Check size={16} />}>
          Cập nhật mật khẩu
        </Button>
      </div>
    </form>
  );
};

export default AdminProfilePage;
