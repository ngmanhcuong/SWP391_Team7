import React from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { Card, Toggle } from '../../components/ui';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAdminSettings } from '../../features/admin/hooks';

const SLOT_OPTIONS = [15, 20, 30, 45, 60];

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateField, resetSettings, saveSettings, isSaving, savedAt } =
    useAdminSettings();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void saveSettings();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
            Cài đặt hệ thống
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Cấu hình chung cho phòng khám và ứng dụng.
          </p>
        </div>
        {savedAt && (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
            <Check size={16} />
            Đã lưu lúc {savedAt.toLocaleTimeString('vi-VN')}
          </span>
        )}
      </div>

      <Card>
        <h2 className="font-semibold mb-5" style={{ fontFamily: 'Lexend' }}>
          Thông tin phòng khám
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Tên phòng khám"
            value={settings.clinicName}
            onChange={(event) => updateField('clinicName', event.target.value)}
          />
          <Input
            label="Hotline"
            value={settings.hotline}
            onChange={(event) => updateField('hotline', event.target.value)}
          />
          <Input
            label="Email hỗ trợ"
            type="email"
            value={settings.supportEmail}
            onChange={(event) => updateField('supportEmail', event.target.value)}
          />
          <Input
            label="Địa chỉ"
            value={settings.address}
            onChange={(event) => updateField('address', event.target.value)}
          />
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-5" style={{ fontFamily: 'Lexend' }}>
          Lịch làm việc
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Giờ mở cửa"
            type="time"
            value={settings.openingTime}
            onChange={(event) => updateField('openingTime', event.target.value)}
          />
          <Input
            label="Giờ đóng cửa"
            type="time"
            value={settings.closingTime}
            onChange={(event) => updateField('closingTime', event.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Thời lượng mỗi lượt khám
            </label>
            <select
              value={settings.appointmentSlotMinutes}
              onChange={(event) =>
                updateField('appointmentSlotMinutes', Number(event.target.value))
              }
              className="w-full px-4 py-2.5 text-sm border rounded-xl outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-200 dark:border-slate-600 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10 transition-all"
            >
              {SLOT_OPTIONS.map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} phút
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-2" style={{ fontFamily: 'Lexend' }}>
          Thông báo &amp; vận hành
        </h2>
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          <SettingToggleRow
            title="Thông báo qua email"
            description="Gửi email nhắc lịch hẹn và biến động hệ thống."
            checked={settings.emailNotifications}
            onChange={(value) => updateField('emailNotifications', value)}
          />
          <SettingToggleRow
            title="Thông báo qua SMS"
            description="Gửi tin nhắn SMS xác nhận lịch hẹn cho bệnh nhân."
            checked={settings.smsNotifications}
            onChange={(value) => updateField('smsNotifications', value)}
          />
          <SettingToggleRow
            title="Tự động xác nhận lịch hẹn"
            description="Lịch hẹn hợp lệ sẽ được duyệt mà không cần lễ tân xác nhận."
            checked={settings.autoConfirmAppointments}
            onChange={(value) => updateField('autoConfirmAppointments', value)}
          />
          <SettingToggleRow
            title="Chế độ bảo trì"
            description="Tạm khóa truy cập của người dùng để bảo trì hệ thống."
            checked={settings.maintenanceMode}
            onChange={(value) => updateField('maintenanceMode', value)}
          />
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          leftIcon={<RotateCcw size={16} />}
          onClick={resetSettings}
        >
          Khôi phục mặc định
        </Button>
        <Button type="submit" loading={isSaving} leftIcon={<Check size={16} />}>
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
};

interface SettingToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SettingToggleRow: React.FC<SettingToggleRowProps> = ({
  title,
  description,
  checked,
  onChange,
}) => (
  <div className="flex items-center justify-between gap-4 py-4">
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-800 dark:text-slate-100">{title}</p>
      <p className="text-sm text-gray-500 dark:text-slate-400">{description}</p>
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

export default AdminSettingsPage;
