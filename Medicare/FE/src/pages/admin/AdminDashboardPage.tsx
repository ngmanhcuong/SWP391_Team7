import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Download,
  Info,
  Minus,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { Avatar, Badge, Card } from '../../components/ui';
import Button from '../../components/ui/Button';
import { useAdminDashboard } from '../../features/admin/hooks';
import { NewAppointmentStatus, TrendDirection } from '../../features/admin/types';

const TrendDelta: React.FC<{ trend: TrendDirection; delta: string; highlight?: boolean }> = ({
  trend,
  delta,
  highlight,
}) => {
  const Icon = trend === 'flat' ? Minus : ArrowUpRight;
  const tone = highlight
    ? 'text-white/90'
    : trend === 'flat'
      ? 'text-gray-400'
      : 'text-emerald-600';
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${tone}`}>
      <Icon size={13} />
      {delta}
    </span>
  );
};

const APPOINTMENT_BADGE: Record<NewAppointmentStatus, { label: string; variant: 'success' | 'warning' }> = {
  confirmed: { label: 'CONFIRM', variant: 'success' },
  pending: { label: 'PENDING', variant: 'warning' },
};

const formatToday = (): string => {
  const formatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const AdminDashboardPage: React.FC = () => {
  const {
    stats,
    appointmentTrend,
    newAppointments,
    systemNotices,
    topDepartments,
    quarterlyGoal,
    newUsersToday,
  } = useAdminDashboard();

  const maxTrend = Math.max(
    ...appointmentTrend.flatMap((point) => [point.patients, point.appointments]),
  );

  return (
    <div className="relative space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
            Dashboard Tổng quan
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Chào mừng trở lại, hôm nay là {formatToday()}
          </p>
        </div>
        <Button leftIcon={<Download size={16} />}>Xuất báo cáo</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map(({ id, label, value, unit, delta, trend, icon: Icon, color, highlight }) => (
          <Card
            key={id}
            hover
            padding="sm"
            className={highlight ? 'border-[#1a56db] text-white' : ''}
            style={highlight ? { background: '#1a56db' } : undefined}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-xl ${color}`}>
                <Icon size={18} />
              </div>
              <TrendDelta trend={trend} delta={delta} highlight={highlight} />
            </div>
            <p
              className={`mt-3 text-xs font-medium uppercase tracking-wide ${
                highlight ? 'text-white/80' : 'text-gray-500 dark:text-slate-400'
              }`}
            >
              {label}
            </p>
            <p className="mt-1 text-xl font-bold">
              {value}
              {unit && <span className="text-sm font-semibold ml-1">{unit}</span>}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <Card>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-semibold" style={{ fontFamily: 'Lexend' }}>
                Xu hướng Lịch hẹn &amp; Bệnh nhân
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Thống kê dữ liệu theo từng tháng trong năm 2024
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1a56db]" />
                Bệnh nhân
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Lịch hẹn
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-4 h-60">
            {appointmentTrend.map((point) => (
              <div key={point.month} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
                <div className="flex items-end justify-center gap-1.5 w-full h-full">
                  <div
                    className="w-1/2 max-w-[22px] rounded-t bg-[#1a56db] transition-all"
                    style={{ height: `${(point.patients / maxTrend) * 100}%` }}
                    title={`Bệnh nhân: ${point.patients}`}
                  />
                  <div
                    className="w-1/2 max-w-[22px] rounded-t bg-emerald-500 transition-all"
                    style={{ height: `${(point.appointments / maxTrend) * 100}%` }}
                    title={`Lịch hẹn: ${point.appointments}`}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                  {point.month}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ fontFamily: 'Lexend' }}>
                Lịch hẹn mới
              </h2>
              <Link to="/admin/lich-hen" className="text-xs font-medium text-[#1a56db] hover:underline">
                Xem tất cả
              </Link>
            </div>
            <ul className="space-y-3">
              {newAppointments.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <Avatar name={item.patientName} src={item.avatar} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-slate-100 truncate">
                      {item.patientName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                      {item.service} • {item.time}
                    </p>
                  </div>
                  <Badge variant={APPOINTMENT_BADGE[item.status].variant}>
                    {APPOINTMENT_BADGE[item.status].label}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-semibold flex-1" style={{ fontFamily: 'Lexend' }}>
                Thông báo hệ thống
              </h2>
              <Info size={16} className="text-gray-400" />
            </div>
            <ul className="space-y-4">
              {systemNotices.map((notice) => (
                <li key={notice.id} className="flex gap-3">
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      notice.level === 'warning' ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-slate-100">
                      {notice.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{notice.detail}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{notice.timeAgo}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ fontFamily: 'Lexend' }}>
              Top Khoa Doanh Thu Cao
            </h2>
            <button type="button" className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <ul className="space-y-4">
            {topDepartments.map((dept) => (
              <li key={dept.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-300 dark:text-slate-600 w-7">
                  {String(dept.rank).padStart(2, '0')}
                </span>
                <span className="flex-1 text-sm font-medium text-gray-800 dark:text-slate-100">
                  {dept.name}
                </span>
                <span className="text-sm font-semibold text-[#1a56db]">{dept.revenueLabel}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-[#1a56db] text-white" style={{ background: '#1a56db' }}>
          <p className="text-xs font-medium uppercase tracking-wide text-white/80">
            {quarterlyGoal.title}
          </p>
          <p className="mt-2 text-3xl font-bold">{quarterlyGoal.percent}% Hoàn thành</p>
          <div className="mt-3 h-2 rounded-full bg-white/25 overflow-hidden">
            <div className="h-full rounded-full bg-white" style={{ width: `${quarterlyGoal.percent}%` }} />
          </div>
          <p className="mt-3 text-sm text-white/85">{quarterlyGoal.description}</p>
          <button
            type="button"
            className="mt-4 px-4 py-2 rounded-lg bg-white text-[#1a56db] text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            Chi tiết mục tiêu
          </button>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4" style={{ fontFamily: 'Lexend' }}>
            Người dùng mới gần đây
          </h2>
          <div className="flex items-center mb-3">
            <div className="flex -space-x-3">
              {['An', 'Bình', 'Chi', 'Dũng'].map((name) => (
                <Avatar key={name} name={name} size="md" className="ring-2 ring-white dark:ring-slate-800" />
              ))}
              <span className="w-10 h-10 rounded-full bg-blue-100 text-[#1a56db] flex items-center justify-center text-sm font-semibold ring-2 ring-white dark:ring-slate-800">
                +12
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Có {newUsersToday} bệnh nhân mới đăng ký tham gia hệ thống trong hôm nay.
          </p>
        </Card>
      </div>

      <button
        type="button"
        aria-label="Tạo mới"
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-[#1a56db] text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:bg-[#1342a8] transition-colors"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default AdminDashboardPage;
