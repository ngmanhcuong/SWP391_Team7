import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  LucideIcon,
  Megaphone,
  Receipt,
  UserPlus,
  Users,
} from 'lucide-react';
import { Avatar, Card } from '../../components/ui';
import Button from '../../components/ui/Button';

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: string;
}

const STATS: Stat[] = [
  { label: 'Bệnh nhân chờ khám', value: '42', icon: Users, tone: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40' },
  { label: 'Lịch hẹn hôm nay', value: '124', icon: Calendar, tone: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40' },
  { label: 'Đã check-in', value: '86', icon: CheckCircle2, tone: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40' },
  { label: 'Hóa đơn chưa trả', value: '12', icon: Receipt, tone: 'bg-red-100 text-red-600 dark:bg-red-950/40' },
];

type QueueStatus = 'priority' | 'waiting';

interface QueueRow {
  ticket: string;
  name: string;
  code: string;
  service: string;
  room: string;
  wait: string;
  status: QueueStatus;
}

const QUEUE: QueueRow[] = [
  { ticket: '#082', name: 'Trần Văn Long', code: 'BN-2023-4512', service: 'Khám Nội', room: 'Phòng 101', wait: '15 phút', status: 'priority' },
  { ticket: '#083', name: 'Lê Thị Mai Anh', code: 'BN-2023-8821', service: 'Khám Nhi', room: 'Phòng 103', wait: '22 phút', status: 'waiting' },
  { ticket: '#084', name: 'Phạm Quang Huy', code: 'BN-2023-1209', service: 'X-Quang', room: 'Phòng 204', wait: '5 phút', status: 'waiting' },
];

interface Room {
  name: string;
  specialty: string;
  doctor: string;
  busy: boolean;
  progress: number;
}

const ROOMS: Room[] = [
  { name: 'Phòng 101', specialty: 'Khám Nội Tổng Quát', doctor: 'BS. Nguyễn Hữu Hoàng - Đang khám', busy: true, progress: 65 },
  { name: 'Phòng 102', specialty: 'Khám Sản Phụ Khoa', doctor: 'Đang trống', busy: false, progress: 0 },
  { name: 'Phòng 103', specialty: 'Khám Nhi', doctor: 'BS. Trần Mỹ Linh - Đang khám', busy: true, progress: 45 },
];

interface Appointment {
  time: string;
  name: string;
  detail: string;
}

const APPOINTMENTS: Appointment[] = [
  { time: '09:00 AM', name: 'Vương Quốc Anh', detail: 'Khám tổng quát • BS. Tuấn' },
  { time: '09:30 AM', name: 'Nguyễn Hải Yến', detail: 'Siêu âm thai • BS. Phương' },
  { time: '10:15 AM', name: 'Đặng Hoàng Nam', detail: 'Khám Nha khoa • BS. Sơn' },
];

const NOTICES = [
  { title: 'Họp giao ban định kỳ', body: '14:00 chiều nay tại phòng hội trường tầng 5.' },
  { title: 'Cập nhật phần mềm', body: 'Hệ thống sẽ bảo trì từ 23:00 tối mai trong 30 phút.' },
];

const ReceptionistDashboardPage: React.FC = () => {
  const [queueFilter, setQueueFilter] = useState<'all' | 'waiting'>('all');

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
            Tổng quan Lễ tân
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Chào mừng trở lại! Hôm nay có 124 bệnh nhân dự kiến.
          </p>
        </div>
        <Button leftIcon={<UserPlus size={16} />}>Tiếp nhận mới</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {STATS.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label}>
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Queue */}
          <Card padding="none" className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-700">
              <h2 className="text-base font-semibold">Danh sách bệnh nhân đang chờ (Queue)</h2>
              <div className="inline-flex p-1 rounded-lg bg-gray-100 dark:bg-slate-700">
                {([['all', 'Tất cả'], ['waiting', 'Đang chờ']] as const).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setQueueFilter(key)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      queueFilter === key ? 'bg-white dark:bg-slate-600 text-[#1a56db] shadow-sm' : 'text-gray-500 dark:text-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    <th className="px-5 py-3">STT</th>
                    <th className="px-3 py-3">Bệnh nhân</th>
                    <th className="px-3 py-3">Dịch vụ/Phòng</th>
                    <th className="px-3 py-3">Thời gian chờ</th>
                    <th className="px-3 py-3">Trạng thái</th>
                    <th className="px-3 py-3 text-right pr-5">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {QUEUE.map((row) => (
                    <tr key={row.ticket} className="hover:bg-gray-50 dark:hover:bg-slate-700/40">
                      <td className="px-5 py-4 font-semibold text-[#1a56db]">{row.ticket}</td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={row.name} size="sm" />
                          <div>
                            <p className="font-medium">{row.name}</p>
                            <p className="text-xs text-gray-400">{row.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <p>{row.service}</p>
                        <p className="text-xs text-gray-400">({row.room})</p>
                      </td>
                      <td className="px-3 py-4 text-gray-500 dark:text-slate-400">{row.wait}</td>
                      <td className="px-3 py-4">
                        {row.status === 'priority' ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-emerald-700 dark:bg-emerald-950/40">
                            Ưu tiên
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-gray-500 dark:bg-slate-700 dark:text-slate-300">
                            Chờ ghi
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-right pr-5">
                        <button type="button" className="text-sm font-medium text-[#1a56db] hover:underline">
                          Mời khám
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-100 dark:border-slate-700 py-3 text-center">
              <button type="button" className="text-sm font-medium text-[#1a56db] hover:underline">
                Xem tất cả hàng đợi (42)
              </button>
            </div>
          </Card>

          {/* Rooms */}
          <div className="grid gap-4 sm:grid-cols-3">
            {ROOMS.map((room) => (
              <Card key={room.name} className={room.busy ? '' : 'border-emerald-200 dark:border-emerald-900'}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#1a56db]">{room.name}</h3>
                  <span className={`h-2.5 w-2.5 rounded-full ${room.busy ? 'bg-red-500' : 'bg-emerald-500'}`} />
                </div>
