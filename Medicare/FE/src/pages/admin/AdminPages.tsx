import React from 'react';
import { BarChart3, UserCog, Users } from 'lucide-react';
import { Card } from '../../components/ui';
import PlaceholderPage from '../shared/PlaceholderPage';

const STAT_CARDS = [
  { label: 'Tổng người dùng', value: '—', icon: Users, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  { label: 'Bác sĩ hoạt động', value: '—', icon: UserCog, color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40' },
  { label: 'Lượt khám tháng này', value: '—', icon: BarChart3, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
];

export const AdminDashboardPage: React.FC = () => (
  <div>
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>Tổng quan quản trị</h1>
      <p className="text-gray-500 dark:text-slate-400">Giám sát hệ thống và người dùng</p>
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
        Khu vực quản trị — quản lý tài khoản, phân quyền và cấu hình hệ thống phòng khám.
      </p>
    </Card>
  </div>
);

export const AdminUsersPage: React.FC = () => (
  <PlaceholderPage title="Quản lý người dùng" description="Thêm, sửa, phân quyền tài khoản trong hệ thống." />
);

export const AdminReportsPage: React.FC = () => (
  <PlaceholderPage title="Báo cáo thống kê" description="Xem báo cáo hoạt động và hiệu suất phòng khám." />
);

export const AdminSettingsPage: React.FC = () => (
  <PlaceholderPage title="Cài đặt hệ thống" description="Cấu hình chung cho phòng khám và ứng dụng." />
);
