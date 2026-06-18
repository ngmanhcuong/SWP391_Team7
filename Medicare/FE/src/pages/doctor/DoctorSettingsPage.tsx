import React, { useEffect, useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import {
  ConsultationTimeSection,
  DoctorNotificationSettingsSection,
  DoctorProfileSettingsSection,
  DoctorSecuritySettingsSection,
  DoctorSettingsFooter,
  GoogleCalendarSyncBanner,
  HolidaysLeaveSection,
  WeeklyScheduleSection,
} from '../../features/doctor/components/settings';
import {
  buildDoctorProfileFromUser,
  DEFAULT_DOCTOR_SETTINGS,
} from '../../features/doctor/utils/defaultDoctorSettings';
import { applyWeeklySchedulePreset, WeeklySchedulePreset } from '../../features/doctor/utils/weeklyScheduleUtils';
import {
  DoctorProfileSettings,
  DoctorSettingsData,
  DoctorSettingsTab,
  HolidayEntry,
  TimeSlotKey,
} from '../../features/doctor/types';

const SETTINGS_TABS: { id: DoctorSettingsTab; label: string }[] = [
  { id: 'schedule', label: 'Lịch làm việc' },
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
  const [activeTab, setActiveTab] = useState<DoctorSettingsTab>('schedule');
  const [settings, setSettings] = useState<DoctorSettingsData>(DEFAULT_DOCTOR_SETTINGS);
  const [profileInitialized, setProfileInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (user && !profileInitialized) {
      setSettings((prev) => ({
        ...prev,
        profile: buildDoctorProfileFromUser(user),
      }));
      setProfileInitialized(true);
    }
  }, [user, profileInitialized]);

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage('');
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Đã lưu thay đổi thành công.');
    }, 600);
  };

  const handleRestoreDefaults = () => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...DEFAULT_DOCTOR_SETTINGS.notifications },
    }));
    setSaveMessage('');
  };

  const handleProfileChange = (field: keyof DoctorProfileSettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  const handleSlotToggle = (dayIndex: number, slot: TimeSlotKey) => {
    setSettings((prev) => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        weeklySchedule: prev.workSchedule.weeklySchedule.map((day, index) =>
          index === dayIndex
            ? { ...day, slots: { ...day.slots, [slot]: !day.slots[slot] } }
            : day,
        ),
      },
    }));
  };

  const handleColumnToggle = (slot: TimeSlotKey, enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        weeklySchedule: prev.workSchedule.weeklySchedule.map((day) => ({
          ...day,
          slots: { ...day.slots, [slot]: enabled },
        })),
      },
    }));
  };

  const handleApplySchedulePreset = (preset: WeeklySchedulePreset) => {
    setSettings((prev) => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        weeklySchedule: applyWeeklySchedulePreset(prev.workSchedule.weeklySchedule, preset),
      },
    }));
  };

  const handleAddHoliday = (entry: HolidayEntry) => {
    setSettings((prev) => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        holidays: [...prev.workSchedule.holidays, entry],
      },
    }));
  };

  const handleUpdateHoliday = (entry: HolidayEntry) => {
    setSettings((prev) => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        holidays: prev.workSchedule.holidays.map((holiday) =>
          holiday.id === entry.id ? entry : holiday,
        ),
      },
    }));
  };

  const handleRemoveHoliday = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        holidays: prev.workSchedule.holidays.filter((h) => h.id !== id),
      },
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

  const showTopSaveButton = activeTab === 'schedule';

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191c1e]">Cài đặt hệ thống</h1>
          <p className="text-sm text-[#737685] mt-1">{TAB_DESCRIPTIONS[activeTab]}</p>
        </div>
        {showTopSaveButton && (
          <Button
            leftIcon={<Save size={16} />}
            onClick={handleSave}
            loading={isSaving}
            className="shrink-0 bg-[#003d9b] border-[#003d9b] hover:bg-[#002d75]"
          >
            Lưu thay đổi
          </Button>
        )}
      </div>

      {saveMessage && (
        <p className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
          {saveMessage}
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

      {activeTab === 'professional' && user && (
        <DoctorProfileSettingsSection
          user={user}
          profile={settings.profile}
          onChange={handleProfileChange}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-5">
          <WeeklyScheduleSection
            applyToAllWeeks={settings.workSchedule.applyToAllWeeks}
            schedule={settings.workSchedule.weeklySchedule}
            onApplyToAllWeeksChange={(value) =>
              setSettings((prev) => ({
                ...prev,
                workSchedule: { ...prev.workSchedule, applyToAllWeeks: value },
              }))
            }
            onSlotToggle={handleSlotToggle}
            onColumnToggle={handleColumnToggle}
            onApplyPreset={handleApplySchedulePreset}
          />

          <ConsultationTimeSection
            selectedMinutes={settings.workSchedule.consultationMinutes}
            customMinutes={settings.workSchedule.customConsultationMinutes}
            onPresetSelect={(minutes) =>
              setSettings((prev) => ({
                ...prev,
                workSchedule: {
                  ...prev.workSchedule,
                  consultationMinutes: minutes,
                  customConsultationMinutes: '',
                },
              }))
            }
            onCustomChange={(value) => {
              const parsed = parseInt(value, 10);
              setSettings((prev) => ({
                ...prev,
                workSchedule: {
                  ...prev.workSchedule,
                  customConsultationMinutes: value,
                  consultationMinutes:
                    Number.isFinite(parsed) && parsed > 0
                      ? parsed
                      : prev.workSchedule.consultationMinutes,
                },
              }));
            }}
          />

          <HolidaysLeaveSection
            holidays={settings.workSchedule.holidays}
            onAdd={handleAddHoliday}
            onUpdate={handleUpdateHoliday}
            onRemove={handleRemoveHoliday}
          />

          <GoogleCalendarSyncBanner />
        </div>
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
              onClick={handleSave}
              loading={isSaving}
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
