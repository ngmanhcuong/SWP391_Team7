import React from 'react';
import {
  Bell,
  Calendar,
  CalendarX,
  Clock,
  LucideIcon,
  Mail,
  MessageSquare,
  MessagesSquare,
} from 'lucide-react';
import { Toggle } from '../../../../components/ui';
import { DoctorNotificationSettings } from '../../types';

interface DoctorNotificationSettingsSectionProps {
  settings: DoctorNotificationSettings;
  onToggle: (key: keyof DoctorNotificationSettings) => void;
}

interface NotificationItem {
  key: keyof DoctorNotificationSettings;
  label: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const CHANNEL_ITEMS: NotificationItem[] = [
  {
    key: 'email',
    label: 'Email',
    description: 'Nhận thông báo qua địa chỉ email đã đăng ký',
    icon: Mail,
    iconBg: 'bg-[#e8f0fe]',
    iconColor: 'text-[#003d9b]',
  },
  {
    key: 'sms',
    label: 'SMS',
    description: 'Nhận tin nhắn văn bản qua số điện thoại',
    icon: MessageSquare,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    key: 'pushNotifications',
    label: 'Thông báo đẩy',
    description: 'Thông báo trực tiếp trên trình duyệt hoặc ứng dụng',
    icon: Bell,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
];

const EVENT_ITEMS: NotificationItem[] = [
  {
    key: 'newAppointment',
    label: 'Lịch hẹn mới',
    description: 'Khi có bệnh nhân đặt lịch khám mới',
    icon: Calendar,
    iconBg: 'bg-[#e8f0fe]',
    iconColor: 'text-[#003d9b]',
  },
  {
    key: 'patientCancelAppointment',
    label: 'Bệnh nhân hủy lịch',
    description: 'Khi bệnh nhân hủy hoặc thay đổi lịch hẹn',
    icon: CalendarX,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    key: 'newMessage',
    label: 'Tin nhắn mới',
    description: 'Khi có tin nhắn từ bệnh nhân hoặc đồng nghiệp',
    icon: MessagesSquare,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    key: 'shiftReminder',
    label: 'Nhắc nhở ca trực',
    description: 'Nhắc nhở lịch trực trước 30 phút',
    icon: Clock,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

const NotificationCard: React.FC<{
  title: string;
  description: string;
  items: NotificationItem[];
  settings: DoctorNotificationSettings;
  onToggle: (key: keyof DoctorNotificationSettings) => void;
}> = ({ title, description, items, settings, onToggle }) => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
    <div className="px-5 sm:px-6 py-4 border-b border-[#c3c6d6]/40">
      <h2 className="text-base font-semibold text-[#191c1e]">{title}</h2>
      <p className="text-sm text-[#737685] mt-1">{description}</p>
    </div>

    <div className="divide-y divide-[#c3c6d6]/20">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 hover:bg-[#f8f9fb]/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}>
                <Icon size={18} className={item.iconColor} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#191c1e]">{item.label}</p>
                <p className="text-xs text-[#737685] mt-0.5">{item.description}</p>
              </div>
            </div>
            <Toggle checked={settings[item.key]} onChange={() => onToggle(item.key)} />
          </div>
        );
      })}
    </div>
  </div>
);

const DoctorNotificationSettingsSection: React.FC<DoctorNotificationSettingsSectionProps> = ({
  settings,
  onToggle,
}) => (
  <div className="space-y-5">
    <NotificationCard
      title="Phương thức nhận thông báo"
      description="Chọn các kênh bạn muốn nhận cập nhật từ hệ thống."
      items={CHANNEL_ITEMS}
      settings={settings}
      onToggle={onToggle}
    />
    <NotificationCard
      title="Sự kiện kích hoạt thông báo"
      description="Cấu hình cụ thể loại sự kiện bạn muốn được nhắc nhở."
      items={EVENT_ITEMS}
      settings={settings}
      onToggle={onToggle}
    />
  </div>
);

export default DoctorNotificationSettingsSection;
