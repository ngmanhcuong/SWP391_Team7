import React, { useState } from 'react';
import { Bell, Globe, Shield, ChevronRight } from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, Toggle, HealthScoreBadge } from '../../../components/ui';
import Button from '../../../components/ui/Button';
import { useSettings, useUpdateSettings } from '../hooks';
import { useAuthStore } from '../../../store/authStore';
import { useThemeStore } from '../../../store/themeStore';
import ThemeModeToggle from '../../../components/ui/ThemeModeToggle';
import { Avatar } from '../../../components/ui';
import ChangePasswordForm from './ChangePasswordForm';

type SecuritySection = 'password' | null;

const SECURITY_ITEMS = [
  { id: 'password' as const, label: 'Thay đổi mật khẩu', desc: 'Cập nhật mật khẩu của bạn' },
  { id: null, label: 'Xác thực 2 bước', desc: 'Tăng cường bảo mật tài khoản' },
  { id: null, label: 'Phiên đăng nhập', desc: 'Quản lý thiết bị đang đăng nhập' },
];

const SettingsPage: React.FC = () => {
  useSettings();
  const updateSettings = useUpdateSettings();
  const { user } = useAuthStore();
  const { mode: themeMode } = useThemeStore();

  const [activeSecuritySection, setActiveSecuritySection] = useState<SecuritySection>(null);

  const [localSettings, setLocalSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    dataSharing: true,
    appointmentReminders: true,
    aiResults: true,
  });

  const handleToggle = (key: keyof typeof localSettings) => {
    const next = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(next);
    updateSettings.mutate(next);
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-slate-900 min-h-screen py-8 transition-colors duration-200">
        <div className="container max-w-3xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100" style={{ fontFamily: 'Lexend' }}>Cài đặt hệ thống</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Quản lý tùy chọn cá nhân, bảo mật và thông báo trong hệ thống MediCare AI Clinic.</p>
          </div>

          {user && (
            <Card className="mb-5 flex items-center gap-4">
              <Avatar name={user.fullName} src={user.avatar} size="lg" />
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900 dark:text-slate-100">{user.fullName}</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
              </div>
              <HealthScoreBadge score={user.healthScore || 90} />
            </Card>
          )}

          <Card className="mb-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield size={15} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-slate-100">Tài khoản & Bảo mật</h3>
            </div>
            <div className="space-y-1">
              {SECURITY_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (item.id === 'password') {
                      setActiveSecuritySection((current) =>
                        current === 'password' ? null : 'password',
                      );
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors group ${
                    item.id === 'password' && activeSecuritySection === 'password'
                      ? 'bg-blue-50 dark:bg-blue-950/40'
                      : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-800 dark:text-slate-200">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">{item.desc}</div>
                  </div>
                  <ChevronRight
                    size={15}
                    className={`text-gray-300 transition-transform group-hover:text-gray-500 ${
                      item.id === 'password' && activeSecuritySection === 'password'
                        ? 'rotate-90 text-blue-500'
                        : ''
                    }`}
                  />
                </button>
              ))}
            </div>

            {activeSecuritySection === 'password' ? (
              <ChangePasswordForm onClose={() => setActiveSecuritySection(null)} />
            ) : null}
          </Card>

          <Card className="mb-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Bell size={15} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-slate-100">Thông báo</h3>
            </div>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications' as const, label: 'Nhắc nhở lịch hẹn', channels: 'Email · SMS' },
                { key: 'aiResults' as const, label: 'Kết quả xét nghiệm AI', channels: 'Email · SMS' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-slate-200">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-slate-400">{item.channels}</div>
                  </div>
                  <Toggle checked={localSettings[item.key]} onChange={() => handleToggle(item.key)} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="mb-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe size={15} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-slate-100">Giao diện & Ngôn ngữ</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-slate-200">Ngôn ngữ ứng dụng</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">Hiển thị giao diện theo ngôn ngữ đã chọn</div>
                </div>
                <select className="text-sm border border-gray-200 dark:border-slate-600 rounded-xl px-3 py-2 outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100">
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-slate-200">Chế độ giao diện</div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    {themeMode === 'dark' ? 'Đang dùng giao diện tối' : 'Đang dùng giao diện sáng'}
                  </div>
                </div>
                <ThemeModeToggle />
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-950/50 rounded-lg flex items-center justify-center">
                <Shield size={15} className="text-red-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-slate-100">Quyền riêng tư</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-800 dark:text-slate-200">Chia sẻ dữ liệu để cải thiện</div>
                <div className="text-xs text-gray-500 dark:text-slate-400 max-w-xs">Cho phép MediCare sử dụng dữ liệu ẩn danh để cải thiện dịch vụ AI</div>
              </div>
              <Toggle checked={localSettings.dataSharing} onChange={() => handleToggle('dataSharing')} />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => updateSettings.mutate(localSettings)} loading={updateSettings.isPending}>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
