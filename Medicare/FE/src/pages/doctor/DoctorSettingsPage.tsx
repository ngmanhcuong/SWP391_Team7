import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import {
  DoctorNotificationSettingsSection,
  DoctorProfileSettingsSection,
  DoctorSecuritySettingsSection,
  DoctorSettingsFooter,
} from '../../features/doctor/components/settings';
import {
  buildDoctorProfileFromUser,
  DEFAULT_DOCTOR_SETTINGS,
} from '../../features/doctor/utils/defaultDoctorSettings';
import {
  DoctorProfileSettings,
  DoctorSettingsData,
  DoctorSettingsTab,
} from '../../features/doctor/types';
import { useProfile, useUpdateProfile, useUploadAvatar } from '../../features/profile/hooks';

const SETTINGS_TABS: { id: DoctorSettingsTab; label: string }[] = [
  { id: 'professional', label: 'Hồ sơ chuyên môn' },
  { id: 'notifications', label: 'Thông báo' },
  { id: 'security', label: 'Bảo mật' },
];

const TAB_DESCRIPTIONS: Record<DoctorSettingsTab, string> = {
  professional: 'Quản lý chuyên khoa, tiểu sử nghề nghiệp và thông tin hiển thị công khai.',
  schedule: 'Quản lý các thông số vận hành và lịch trình cá nhân của bạn.',
  notifications: 'Quản lý cấu hình tài khoản và tùy chọn nhận thông báo của bạn.',
  security: 'Bảo vệ tài khoản và quản lý quyền truy cập của bạn.',
};

export const DoctorSettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: profileUser } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const [activeTab, setActiveTab] = useState<DoctorSettingsTab>('professional');
  const [settings, setSettings] = useState<DoctorSettingsData>(DEFAULT_DOCTOR_SETTINGS);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const effectiveUser = profileUser ?? user ?? null;
  const derivedProfile = useMemo(
    () => (effectiveUser ? buildDoctorProfileFromUser(effectiveUser) : DEFAULT_DOCTOR_SETTINGS.profile),
    [effectiveUser],
  );

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...derivedProfile,
      },
    }));
  }, [derivedProfile]);

  const handleSave = async () => {
    if (!effectiveUser) return;

    setErrorMessage('');
    setSaveMessage('');

    try {
      await updateProfile.mutateAsync({
        fullName: effectiveUser.fullName,
        phone: effectiveUser.phone || '',
        dateOfBirth: effectiveUser.dateOfBirth || '',
        gender: effectiveUser.gender || '',
        address: effectiveUser.address || '',
        nationalId: effectiveUser.nationalId || '',
        emergencyPhone: effectiveUser.emergencyPhone || '',
        occupation: effectiveUser.occupation || '',
        height: effectiveUser.height != null ? String(effectiveUser.height) : '',
        weight: effectiveUser.weight != null ? String(effectiveUser.weight) : '',
        bio: settings.profile.biography,
      });
      setSaveMessage('Đã lưu thay đổi thành công.');
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Không thể lưu thay đổi lúc này.');
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setErrorMessage('');
    setSaveMessage('');
    try {
      await uploadAvatar.mutateAsync(file);
      setSaveMessage('Đã cập nhật ảnh đại diện.');
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Không thể tải ảnh lên lúc này.');
    }
  };

  const handleRestoreDefaults = () => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...DEFAULT_DOCTOR_SETTINGS.notifications },
      profile: {
        ...prev.profile,
        biography: derivedProfile.biography,
      },
    }));
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleProfileChange = (field: keyof DoctorProfileSettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  const handleNotificationToggle = (key: keyof DoctorSettingsData['notifications']) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1e]">Cài đặt hệ thống</h1>
          <p className="text-sm text-[#737685] mt-1">{TAB_DESCRIPTIONS[activeTab]}</p>
        </div>
      </div>

      {saveMessage && (
        <p className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
          {saveMessage}
        </p>
      )}

      {errorMessage && (
        <p className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5">
          {errorMessage}
        </p>
      )}

      <div className="border-b border-[#c3c6d6]/50">
        <nav className="flex gap-1 overflow-x-auto -mb-px" aria-label="Cài đặt">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 sm:px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#003d9b] text-[#003d9b]'
                  : 'border-transparent text-[#737685] hover:text-[#191c1e] hover:border-[#c3c6d6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'professional' && effectiveUser && (
        <DoctorProfileSettingsSection
          user={effectiveUser}
          profile={settings.profile}
          onChange={handleProfileChange}
          onSave={handleSave}
          onAvatarUpload={handleAvatarUpload}
          isSaving={updateProfile.isPending}
          isUploadingAvatar={uploadAvatar.isPending}
        />
      )}

      {activeTab === 'notifications' && (
        <>
          <DoctorNotificationSettingsSection
            settings={settings.notifications}
            onToggle={handleNotificationToggle}
          />

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
            <Button
              variant="outline"
              leftIcon={<RotateCcw size={16} />}
              onClick={handleRestoreDefaults}
              className="border-[#c3c6d6] text-[#434654] hover:bg-[#f8f9fb]"
            >
              Khôi phục mặc định
            </Button>
            <Button
              leftIcon={<Save size={16} />}
              onClick={() => setSaveMessage('Tùy chọn thông báo hiện chỉ lưu cục bộ ở giao diện.')}
              className="bg-[#003d9b] border-[#003d9b] hover:bg-[#002d75]"
            >
              Lưu thay đổi
            </Button>
          </div>
        </>
      )}

      {activeTab === 'security' && <DoctorSecuritySettingsSection />}

      <DoctorSettingsFooter />
    </div>
  );
};

export default DoctorSettingsPage;
