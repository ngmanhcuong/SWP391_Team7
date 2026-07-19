import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Camera, Eye, EyeOff, Lock, Save, UserRound } from 'lucide-react';
import { Avatar, Card, Spinner } from '../../components/ui';
import Button from '../../components/ui/Button';
import {
  useChangePassword,
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
} from '../../features/profile/hooks';
import { useAuthStore } from '../../store/authStore';

const inputClass =
  'w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#1a56db]';

type ProfileFormState = {
  fullName: string;
  phone: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const buildProfileForm = (fullName?: string, phone?: string): ProfileFormState => ({
  fullName: fullName ?? '',
  phone: phone ?? '',
});

const defaultPasswordForm: PasswordFormState = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const ReceptionistProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const changePasswordMutation = useChangePassword();

  const activeUser = profile ?? user ?? null;
  const [profileForm, setProfileForm] = useState<ProfileFormState>(() => buildProfileForm());
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(defaultPasswordForm);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!activeUser) return;
    setProfileForm(buildProfileForm(activeUser.fullName, activeUser.phone));
  }, [activeUser]);

  const roleLabel = useMemo(() => 'Lễ tân', []);
  const titleLabel = useMemo(() => 'Nhân viên tiếp đón', []);
  const isSavingProfile = updateProfileMutation.isPending || uploadAvatarMutation.isPending;

  const handleProfileFieldChange = (field: keyof ProfileFormState) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordFieldChange = (field: keyof PasswordFormState) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!activeUser) return;

    const trimmedName = profileForm.fullName.trim();
    const trimmedPhone = profileForm.phone.trim();

    if (!trimmedName) {
      window.alert('Họ và tên không được để trống.');
      return;
    }

    if (!trimmedPhone) {
      window.alert('Số điện thoại không được để trống.');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        fullName: trimmedName,
        phone: trimmedPhone,
      });
      window.alert('Đã cập nhật hồ sơ lễ tân thành công.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể cập nhật hồ sơ lễ tân.';
      window.alert(message);
    }
  };

  const handleResetProfile = () => {
    setProfileForm(buildProfileForm(activeUser?.fullName, activeUser?.phone));
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('Vui lòng chọn một tệp ảnh hợp lệ.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.alert('Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.');
      return;
    }

    try {
      await uploadAvatarMutation.mutateAsync(file);
      window.alert('Đã cập nhật ảnh đại diện thành công.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể cập nhật ảnh đại diện.';
      window.alert(message);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.newPassword.trim()) {
      window.alert('Vui lòng nhập mật khẩu mới.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      window.alert('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      window.alert('Xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm(defaultPasswordForm);
      window.alert('Đổi mật khẩu thành công.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể đổi mật khẩu.';
      window.alert(message);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-[#434654]">Vui lòng đăng nhập để xem hồ sơ lễ tân.</p>
      </div>
    );
  }

  if (isLoading && !activeUser) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-[#434654]">Không tải được dữ liệu hồ sơ lễ tân.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <h1 className="text-2xl font-bold text-[#1a56db]" style={{ fontFamily: 'Lexend' }}>
        Hồ sơ cá nhân
      </h1>

      <Card>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <Avatar name={activeUser.fullName} src={activeUser.avatar} size="lg" />
              <label
                className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#1a56db] text-white shadow ring-2 ring-white dark:ring-slate-800"
                aria-label="Đổi ảnh đại diện"
              >
                <Camera size={14} />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40">
                {titleLabel}
              </span>
              <h2 className="mt-1 text-xl font-bold">{activeUser.fullName}</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">{roleLabel}</p>
            </div>
          </div>
          <Button
            leftIcon={<Save size={16} />}
            loading={isSavingProfile}
            onClick={handleSaveProfile}
          >
            Lưu thay đổi
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
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
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={handleProfileFieldChange('fullName')}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
                  Chức danh
                </span>
                <input
                  type="text"
                  value={roleLabel}
                  disabled
                  className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-slate-700/40`}
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
                Địa chỉ Email
              </span>
              <input
                type="email"
                value={activeUser.email}
                disabled
                className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500 dark:bg-slate-700/40`}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
                Số điện thoại <span className="text-red-500">*</span>
              </span>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={handleProfileFieldChange('phone')}
                className={inputClass}
              />
            </label>
          </div>
        </Card>

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
                <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
                  Mật khẩu cũ
                </span>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordFieldChange('currentPassword')}
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Hiện hoặc ẩn mật khẩu cũ"
                  >
                    {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
                  Mật khẩu mới
                </span>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFieldChange('newPassword')}
                    placeholder="Tối thiểu 8 ký tự"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Hiện hoặc ẩn mật khẩu mới"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
                  Xác nhận mật khẩu
                </span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordFieldChange('confirmPassword')}
                    placeholder="Nhập lại mật khẩu mới"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Hiện hoặc ẩn xác nhận mật khẩu"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>
            </div>
          </Card>

          <Card>
            <div className="space-y-3">
              <Button
                fullWidth
                leftIcon={<Save size={16} />}
                loading={changePasswordMutation.isPending}
                onClick={handleChangePassword}
              >
                Cập nhật mật khẩu
              </Button>
              <Button fullWidth variant="outline" onClick={handleResetProfile}>
                Khôi phục thông tin
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-gray-400">
              Hồ sơ hiển thị đúng theo tài khoản lễ tân đang đăng nhập.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistProfilePage;
