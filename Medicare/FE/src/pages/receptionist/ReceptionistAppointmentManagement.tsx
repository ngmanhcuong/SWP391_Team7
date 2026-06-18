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
        </label>
        <Button leftIcon={<Plus size={16} />}>Tạo lịch hẹn mới</Button>
      </div>
    </Card>

    {/* Table */}
    <Card padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-100 dark:border-slate-700">
              <th className="px-5 py-3">Mã LH</th>
              <th className="px-3 py-3">Bệnh nhân</th>
              <th className="px-3 py-3">Bác sĩ</th>
              <th className="px-3 py-3">Khoa khám</th>
              <th className="px-3 py-3">Ngày khám</th>
              <th className="px-3 py-3">Giờ khám</th>
              <th className="px-3 py-3">Trạng thái</th>
              <th className="px-3 py-3 text-right pr-5">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {APPOINTMENTS.map((appt) => (
              <tr key={appt.code} className="hover:bg-gray-50 dark:hover:bg-slate-700/40">
                <td className="px-5 py-4 font-semibold text-[#1a56db]">{appt.code}</td>
                <td className="px-3 py-4">
                  <p className="font-medium">{appt.name}</p>
                  <p className="text-xs text-gray-400">{appt.phone}</p>
                </td>
                <td className="px-3 py-4 text-gray-600 dark:text-slate-300">{appt.doctor}</td>
                <td className="px-3 py-4 text-gray-600 dark:text-slate-300">{appt.department}</td>
                <td className="px-3 py-4 text-gray-500 dark:text-slate-400">{appt.date}</td>
                <td className="px-3 py-4 text-gray-500 dark:text-slate-400">{appt.time}</td>
                <td className="px-3 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[appt.status].className}`}>
                    {STATUS_STYLES[appt.status].label}
                  </span>
                </td>
                <td className="px-3 py-4 text-right pr-5">
                  <button type="button" className="text-sm font-medium text-[#1a56db] hover:underline">
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-gray-100 dark:border-slate-700">
        <p className="text-xs text-gray-400">Hiển thị 5 trên 42 kết quả</p>
        <div className="flex items-center gap-1">
          <button type="button" className="h-8 w-8 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-400 hover:bg-gray-50" aria-label="Trang trước">‹</button>
          <button type="button" className="h-8 w-8 rounded-lg bg-[#1a56db] text-sm font-medium text-white">1</button>
          <button type="button" className="h-8 w-8 rounded-lg border border-gray-200 dark:border-slate-600 text-sm font-medium text-gray-600 hover:bg-gray-50">2</button>
          <button type="button" className="h-8 w-8 rounded-lg border border-gray-200 dark:border-slate-600 text-sm font-medium text-gray-600 hover:bg-gray-50">3</button>
          <span className="px-1 text-gray-400">...</span>
          <button type="button" className="h-8 w-8 rounded-lg border border-gray-200 dark:border-slate-600 text-sm font-medium text-gray-600 hover:bg-gray-50">9</button>
          <button type="button" className="h-8 w-8 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-400 hover:bg-gray-50" aria-label="Trang sau">›</button>
        </div>
      </div>
    </Card>

    {/* Bottom: timeline + note */}
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold">Tiến độ khám bệnh hôm nay</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Trực tiếp
          </span>
        </div>
        <div className="space-y-3">
          {TIMELINE.map((item, idx) => {
            const dotColor = item.state === 'done' ? 'bg-emerald-500' : item.state === 'active' ? 'bg-[#1a56db]' : 'bg-gray-300';
            return (
              <div key={item.code} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={`h-3.5 w-3.5 rounded-full ${dotColor} ${item.state === 'active' ? 'ring-4 ring-blue-100 dark:ring-blue-950/40' : ''}`} />
                  {idx < TIMELINE.length - 1 && <span className="w-px flex-1 bg-gray-200 dark:bg-slate-700" />}
                </div>
                <div
                  className={`mb-2 flex-1 rounded-xl border p-3 ${
                    item.state === 'active'
                      ? 'border-[#1a56db]/30 bg-blue-50/60 dark:bg-blue-950/20'
                      : 'border-gray-100 dark:border-slate-700'
                  } ${item.state === 'upcoming' ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.code}: {item.name}</p>
                      <p className="text-xs text-gray-400">{item.detail}</p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold ${
                        item.state === 'done' ? 'text-emerald-600' : item.state === 'active' ? 'text-[#1a56db]' : 'text-gray-400'
                      }`}
                    >
                      {item.note}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#1e40af] p-5 text-white shadow-lg">
        <h2 className="text-base font-semibold mb-3">Ghi chú quan trọng</h2>
        <p className="text-sm text-blue-50">
          Hôm nay có lịch họp giao ban định kỳ lúc 10:30 AM tại phòng hội nghị tầng 3. Các bác sĩ khoa Nội cần chuẩn bị báo cáo tháng.
        </p>
        <div className="mt-4 flex gap-3 rounded-xl bg-white/10 p-3">
          <Info size={18} className="shrink-0" />
          <div>
            <p className="text-sm font-semibold">Cập nhật hệ thống</p>
            <p className="mt-0.5 text-xs text-blue-100">Phiên bản 2.4.0 sẽ được triển khai vào 22:00 đêm nay.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReceptionistAppointmentManagement;
