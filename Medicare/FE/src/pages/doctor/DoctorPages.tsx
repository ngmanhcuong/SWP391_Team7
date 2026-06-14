import React from 'react';
import { Calendar, Users, Stethoscope } from 'lucide-react';
import { Card } from '../../components/ui';
import PlaceholderPage from '../shared/PlaceholderPage';

const STAT_CARDS = [
  { label: 'Lịch khám hôm nay', value: '—', icon: Calendar, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  { label: 'Bệnh nhân đang chờ', value: '—', icon: Users, color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40' },
  { label: 'Ca khám tuần này', value: '—', icon: Stethoscope, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
];

export const DoctorDashboardPage: React.FC = () => (
  <div>
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>Tổng quan bác sĩ</h1>
      <p className="text-gray-500 dark:text-slate-400">Quản lý lịch khám và bệnh nhân</p>
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
        Khu vực dành cho bác sĩ — xem lịch khám, cập nhật chẩn đoán và quản lý hồ sơ bệnh án.
      </p>
    </Card>
  </div>
);

export const DoctorSchedulePage: React.FC = () => (
  <PlaceholderPage title="Lịch khám" description="Xem và quản lý lịch khám theo ngày, tuần." />
);

export const DoctorPatientsPage: React.FC = () => (
  <PlaceholderPage title="Danh sách bệnh nhân" description="Tra cứu thông tin bệnh nhân đang điều trị." />
);

export const DoctorRecordsPage: React.FC = () => (
  <PlaceholderPage title="Hồ sơ bệnh án" description="Ghi nhận chẩn đoán, đơn thuốc và kết quả khám." />
);
