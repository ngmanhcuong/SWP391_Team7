import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Info,
  LucideIcon,
  Plus,
  Search,
  XCircle,
} from 'lucide-react';
import { Card } from '../../components/ui';
import Button from '../../components/ui/Button';

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: string;
}

const STATS: Stat[] = [
  { label: 'Tổng lịch hẹn (Hôm nay)', value: '42', icon: Calendar, tone: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40' },
  { label: 'Đã xác nhận', value: '28', icon: CheckCircle2, tone: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40' },
  { label: 'Chờ xác nhận', value: '10', icon: Clock, tone: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40' },
  { label: 'Đã hủy', value: '4', icon: XCircle, tone: 'bg-red-100 text-red-600 dark:bg-red-950/40' },
];

type Status = 'pending' | 'confirmed' | 'in-progress' | 'done' | 'cancelled';

const STATUS_STYLES: Record<Status, { label: string; className: string }> = {
  pending: { label: 'Chờ xác nhận', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40' },
  confirmed: { label: 'Đã xác nhận', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40' },
  'in-progress': { label: 'Đang khám', className: 'bg-[#1a56db] text-white' },
  done: { label: 'Hoàn thành', className: 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-300' },
  cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-600 dark:bg-red-950/40' },
};

interface AppointmentRow {
  code: string;
  name: string;
  phone: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  status: Status;
}

const APPOINTMENTS: AppointmentRow[] = [
  { code: '#LH-9802', name: 'Trần Văn Tú', phone: '0901 234 567', doctor: 'BS. Lê Minh Hoàng', department: 'Khoa Nội tổng quát', date: '24/10/2023', time: '08:30 AM', status: 'pending' },
  { code: '#LH-9801', name: 'Phạm Mỹ Linh', phone: '0982 555 111', doctor: 'BS. Nguyễn Thu Thủy', department: 'Sản phụ khoa', date: '24/10/2023', time: '09:15 AM', status: 'confirmed' },
  { code: '#LH-9799', name: 'Lê Hoàng Nam', phone: '0911 333 999', doctor: 'BS. Đặng Quốc Anh', department: 'Khoa Chấn thương', date: '24/10/2023', time: '08:00 AM', status: 'in-progress' },
  { code: '#LH-9795', name: 'Nguyễn Diệu Nhi', phone: '0888 123 456', doctor: 'BS. Vũ Hà Phương', department: 'Khoa Nhi', date: '24/10/2023', time: '07:30 AM', status: 'done' },
  { code: '#LH-9790', name: 'Hoàng Công Thành', phone: '0977 444 888', doctor: 'BS. Lê Minh Hoàng', department: 'Khoa Nội tổng quát', date: '24/10/2023', time: '10:00 AM', status: 'cancelled' },
];

interface TimelineItem {
  code: string;
  name: string;
  detail: string;
  state: 'done' | 'active' | 'upcoming';
  note: string;
}

const TIMELINE: TimelineItem[] = [
  { code: '#LH-9795', name: 'Nguyễn Diệu Nhi', detail: 'Khám tổng quát nhi • BS. Hà Phương', state: 'done', note: 'ĐÃ HOÀN THÀNH' },
  { code: '#LH-9799', name: 'Lê Hoàng Nam', detail: 'Chụp X-Quang • BS. Quốc Anh', state: 'active', note: 'Đang khám...' },
  { code: '#LH-9802', name: 'Trần Văn Tú', detail: 'Tiếp nhận hồ sơ • Chờ BS. Minh Hoàng', state: 'upcoming', note: 'Sắp tới (08:30)' },
];

const ReceptionistAppointmentManagement: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-[#1a56db]" style={{ fontFamily: 'Lexend' }}>
      Quản lý lịch hẹn
    </h1>

    {/* Stats */}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

    {/* Filters */}
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-slate-400">Tìm kiếm</span>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-2 focus-within:border-[#1a56db]">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="ID, Tên bệnh nhân..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
        </label>
        <label className="lg:w-48">
          <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-slate-400">Trạng thái</span>
          <select className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2 text-sm outline-none focus:border-[#1a56db]">
            <option>Tất cả trạng thái</option>
            <option>Chờ xác nhận</option>
            <option>Đã xác nhận</option>
            <option>Đã hủy</option>
          </select>
        </label>
        <label className="lg:w-48">
          <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-slate-400">Khoa khám</span>
          <select className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2 text-sm outline-none focus:border-[#1a56db]">
            <option>Tất cả các khoa</option>
            <option>Khoa Nội tổng quát</option>
            <option>Sản phụ khoa</option>
            <option>Khoa Nhi</option>
          </select>
