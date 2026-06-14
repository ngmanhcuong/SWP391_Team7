import React from 'react';
import { Calendar, FileText, Heart } from 'lucide-react';
import { Card } from '../../components/ui';
import PlaceholderPage from '../shared/PlaceholderPage';

const STAT_CARDS = [
  { label: 'Lịch hẹn sắp tới', value: '—', icon: Calendar, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  { label: 'Điểm sức khỏe', value: '—', icon: Heart, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
  { label: 'Hồ sơ y tế', value: '—', icon: FileText, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
];

export const PatientDashboardPage: React.FC = () => (
  <div>
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>Tổng quan bệnh nhân</h1>
      <p className="text-gray-500 dark:text-slate-400">Theo dõi lịch hẹn và sức khỏe của bạn</p>
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
        Chào mừng bạn đến khu vực bệnh nhân. Tại đây bạn có thể đặt lịch khám, xem kết quả và quản lý hồ sơ sức khỏe.
      </p>
    </Card>
  </div>
);

export const PatientAppointmentsPage: React.FC = () => (
  <PlaceholderPage title="Lịch hẹn" description="Xem và quản lý các lịch hẹn khám bệnh của bạn." />
);

export const PatientHealthRecordsPage: React.FC = () => (
  <PlaceholderPage title="Hồ sơ sức khỏe" description="Theo dõi tiền sử bệnh, đơn thuốc và kết quả khám." />
);
