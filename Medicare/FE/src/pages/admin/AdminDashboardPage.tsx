import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Download,
  Info,
  Minus,
  MoreHorizontal,
} from 'lucide-react';
import { Avatar, Badge, Card, Modal } from '../../components/ui';
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
  const [goalDetailOpen, setGoalDetailOpen] = useState(false);

  const maxTrend = Math.max(
    ...appointmentTrend.flatMap((point) => [point.patients, point.appointments]),
  );
  const goalRemaining = Math.max(0, 100 - quarterlyGoal.percent);

  return (
    <div className="relative space-y-6 pb-16">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#1a56db] via-[#2563eb] to-[#0ea5e9] p-6 text-white shadow-[0_20px_55px_rgba(26,86,219,0.25)]">
        <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute right-28 bottom-0 h-24 w-24 rounded-full bg-cyan-200/20 blur-xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">Medicare Admin</p>
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
            Dashboard Tổng quan
          </h1>
          <p className="text-blue-50">
            Chào mừng trở lại, hôm nay là {formatToday()}
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<Download size={16} />}
          className="border-white/80 bg-white text-[#1a56db] hover:bg-blue-50"
        >
          Xuất báo cáo
        </Button>
        </div>
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
            onClick={() => setGoalDetailOpen(true)}
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

      <Modal
        open={goalDetailOpen}
        onClose={() => setGoalDetailOpen(false)}
        title="Chi tiết mục tiêu quý"
        size="lg"
      >
        <div className="space-y-5">
          <div className="rounded-2xl bg-gradient-to-r from-[#1a56db] to-[#3b82f6] p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
              {quarterlyGoal.title}
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-bold">{quarterlyGoal.percent}%</p>
                <p className="text-sm text-white/80">Đã hoàn thành mục tiêu hiện tại</p>
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                Còn {goalRemaining.toFixed(1)}%
              </span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white" style={{ width: `${quarterlyGoal.percent}%` }} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-blue-50 p-4 text-blue-700">
              <p className="text-xs font-semibold uppercase tracking-wide">Mục tiêu</p>
              <p className="mt-2 text-xl font-bold">3.5B VND</p>
              <p className="mt-1 text-xs text-blue-600/80">Dự kiến cuối tháng 6</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">
              <p className="text-xs font-semibold uppercase tracking-wide">Đã đạt</p>
              <p className="mt-2 text-xl font-bold">2.75B VND</p>
              <p className="mt-1 text-xs text-emerald-600/80">Theo tiến độ hiện tại</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4 text-amber-700">
              <p className="text-xs font-semibold uppercase tracking-wide">Cần thêm</p>
              <p className="mt-2 text-xl font-bold">0.75B VND</p>
              <p className="mt-1 text-xs text-amber-600/80">Để hoàn thành 100%</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 p-4 dark:border-slate-700">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100">Gợi ý hành động</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-slate-300">
              <p className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-slate-800">
                Tăng lịch khám ở các khoa có doanh thu cao để cải thiện tốc độ hoàn thành.
              </p>
              <p className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-slate-800">
                Kiểm tra lịch hẹn chờ xác nhận để giảm thất thoát lượt khám.
              </p>
              <p className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-slate-800">
                Theo dõi báo cáo tuần để cập nhật lại mục tiêu nếu tốc độ tăng trưởng thay đổi.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
