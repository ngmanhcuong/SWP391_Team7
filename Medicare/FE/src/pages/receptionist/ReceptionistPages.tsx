import React from 'react';
import { Calendar, ClipboardList, Users } from 'lucide-react';
import { Card } from '../../components/ui';
import PlaceholderPage from '../shared/PlaceholderPage';

const STAT_CARDS = [
  { label: 'Tiếp nhận hôm nay', value: '—', icon: ClipboardList, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  { label: 'Lịch hẹn chờ xác nhận', value: '—', icon: Calendar, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
  { label: 'Bệnh nhân mới', value: '—', icon: Users, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
];

export const ReceptionistDashboardPage: React.FC = () => (
  <div>
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>Tổng quan lễ tân</h1>
      <p className="text-gray-500 dark:text-slate-400">Tiếp nhận và sắp xếp lịch hẹn</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className={`p-2.5 rounded-xl ${color}`}>
              <Icon size={20} />
            </div>
          </div>
        </Card>
      ))}
    </div>
    <Card>
      <p className="text-sm text-gray-600 dark:text-slate-300">
        Khu vực dành cho lễ tân — tiếp nhận bệnh nhân, đặt lịch và hỗ trợ thủ tục tại quầy.
      </p>
    </Card>
  </div>
);

export const ReceptionistCheckInPage: React.FC = () => (
  <PlaceholderPage title="Tiếp nhận" description="Đăng ký bệnh nhân đến khám và cấp số thứ tự." />
);

export const ReceptionistAppointmentsPage: React.FC = () => (
  <PlaceholderPage title="Quản lý lịch hẹn" description="Xác nhận, hủy hoặc đổi lịch hẹn cho bệnh nhân." />
);

export const ReceptionistPatientsPage: React.FC = () => (
  <PlaceholderPage title="Danh sách bệnh nhân" description="Tra cứu thông tin và lịch sử khám của bệnh nhân." />
);
