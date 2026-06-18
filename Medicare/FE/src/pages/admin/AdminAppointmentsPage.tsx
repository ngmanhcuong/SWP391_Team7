import React, { useState } from 'react';
import {
  CalendarRange,
  Check,
  Download,
  Eye,
  Plus,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Card, Modal } from '../../components/ui';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
  AdminAppointmentInput,
  AppointmentStatusFilter,
  useAdminAppointments,
} from '../../features/admin/hooks';
import { APPOINTMENT_STATUS_LABELS } from '../../features/admin/constants';
import { AdminAppointment, AppointmentStatus } from '../../features/admin/types';
import { SectionStatCard } from './AdminDoctorsPage';
import { CompactPagination } from './AdminFeedbackPage';

const PAGE_SIZE = 10;

const formInputClass =
  'w-full px-4 py-2.5 text-sm border rounded-xl outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-200 dark:border-slate-600 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10';

const EMPTY_APPOINTMENT: AdminAppointmentInput = {
  patientName: '',
  patientPhone: '',
  doctorName: '',
  doctorDept: '',
  date: '',
  timeRange: '',
  status: 'pending',
};

const FILTER_TABS: { value: AppointmentStatusFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: APPOINTMENT_STATUS_LABELS.pending },
  { value: 'confirmed', label: APPOINTMENT_STATUS_LABELS.confirmed },
  { value: 'completed', label: APPOINTMENT_STATUS_LABELS.completed },
  { value: 'cancelled', label: APPOINTMENT_STATUS_LABELS.cancelled },
];

const STATUS_STYLE: Record<AppointmentStatus, { dot: string; badge: string }> = {
  pending: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700' },
  confirmed: { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700' },
  completed: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700' },
  cancelled: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700' },
};

export const AdminAppointmentsPage: React.FC = () => {
  const {
    appointments,
    stats,
    total,
    statusFilter,
    setStatusFilter,
    setAppointmentStatus,
    addAppointment,
  } = useAdminAppointments();
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<AdminAppointment | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<AdminAppointmentInput>(EMPTY_APPOINTMENT);
  const [error, setError] = useState('');

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const openCreate = () => {
    setForm(EMPTY_APPOINTMENT);
    setError('');
    setCreateOpen(true);
  };

  const handleCreateSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.patientName.trim()) {
      setError('Vui lòng nhập tên bệnh nhân.');
      return;
    }
    if (!form.doctorName.trim()) {
      setError('Vui lòng nhập tên bác sĩ.');
      return;
    }
    if (!form.date.trim() || !form.timeRange.trim()) {
      setError('Vui lòng nhập ngày và khung giờ.');
      return;
    }
    addAppointment(form);
    setCreateOpen(false);
  };

  return (
    <div className="relative space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="text-xs text-gray-400 mb-1">
            Hệ thống <span className="mx-1">›</span>
            <span className="text-[#1a56db] font-medium">Quản lý lịch hẹn</span>
          </nav>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
            Danh sách lịch hẹn
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Theo dõi và cập nhật trạng thái các buổi khám bệnh
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Download size={16} />}>
            Xuất báo cáo
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={openCreate}>
            Tạo lịch hẹn mới
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <SectionStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-600 shrink-0">Lọc theo:</span>
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === tab.value
                    ? 'bg-[#1a56db] text-white'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-[#1a56db]/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">
              <CalendarRange size={15} />
              01/01/2024 - 31/01/2024
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              <SlidersHorizontal size={15} />
              Nâng cao
            </button>
          </div>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-slate-400 border-b border-gray-100 dark:border-slate-700">
                <th className="px-5 py-3 font-medium">Mã lịch</th>
                <th className="px-5 py-3 font-medium">Bệnh nhân</th>
                <th className="px-5 py-3 font-medium">Bác sĩ</th>
                <th className="px-5 py-3 font-medium">Thời gian</th>
                <th className="px-5 py-3 font-medium">Trạng thái</th>
                <th className="px-5 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {appointments.map((appointment) => {
                const style = STATUS_STYLE[appointment.status];
                return (
                  <tr key={appointment.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-700/30">
                    <td className="px-5 py-4 font-semibold text-[#1a56db] whitespace-nowrap">
                      {appointment.id}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold flex items-center justify-center">
                          {appointment.patientInitials}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 dark:text-slate-100 truncate">
                            {appointment.patientName}
                          </p>
                          <p className="text-xs text-gray-400">{appointment.patientPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-700 dark:text-slate-200">{appointment.doctorName}</p>
                      <p className="text-xs text-gray-400">{appointment.doctorDept}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-gray-700 dark:text-slate-200">{appointment.date}</p>
                      <p className="text-xs text-gray-400">{appointment.timeRange}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {APPOINTMENT_STATUS_LABELS[appointment.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="Xem"
                          onClick={() => setViewing(appointment)}
                          className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-[#1a56db] transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              title="Xác nhận"
                              onClick={() => setAppointmentStatus(appointment.id, 'confirmed')}
                              className="p-2 rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              type="button"
                              title="Hủy"
                              onClick={() => setAppointmentStatus(appointment.id, 'cancelled')}
                              className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {appointments.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-500">Không có lịch hẹn phù hợp.</div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-gray-100 dark:border-slate-700">
          <p className="text-sm text-gray-500">
            Hiển thị 1 - {appointments.length} trong tổng số {total.toLocaleString('vi-VN')} lịch hẹn
          </p>
          <CompactPagination currentPage={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </Card>

      <button
        type="button"
        aria-label="Tạo lịch hẹn"
        onClick={openCreate}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-[#1a56db] text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:bg-[#1342a8] transition-colors"
      >
        <Plus size={24} />
      </button>

      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title="Chi tiết lịch hẹn"
        description={viewing ? `Mã lịch: ${viewing.id}` : undefined}
        footer={
          viewing && (
            <>
              {viewing.status === 'pending' && (
                <>
                  <Button
                    variant="danger"
                    leftIcon={<X size={16} />}
                    onClick={() => {
                      setAppointmentStatus(viewing.id, 'cancelled');
                      setViewing(null);
                    }}
                  >
                    Hủy lịch
                  </Button>
                  <Button
                    variant="secondary"
                    leftIcon={<Check size={16} />}
                    onClick={() => {
                      setAppointmentStatus(viewing.id, 'confirmed');
                      setViewing(null);
                    }}
                  >
                    Xác nhận
                  </Button>
                </>
              )}
              <Button variant="ghost" onClick={() => setViewing(null)}>
                Đóng
              </Button>
            </>
          )
        }
      >
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Trạng thái</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[viewing.status].badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLE[viewing.status].dot}`} />
                {APPOINTMENT_STATUS_LABELS[viewing.status]}
              </span>
            </div>
            <DetailRow label="Bệnh nhân" value={viewing.patientName} />
            <DetailRow label="Số điện thoại" value={viewing.patientPhone} />
            <DetailRow label="Bác sĩ" value={viewing.doctorName} />
            <DetailRow label="Chuyên khoa" value={viewing.doctorDept} />
            <DetailRow label="Ngày khám" value={viewing.date} />
            <DetailRow label="Khung giờ" value={viewing.timeRange} />
          </div>
        )}
      </Modal>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Tạo lịch hẹn mới"
        description="Đặt lịch khám cho bệnh nhân"
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" form="appointment-form" leftIcon={<Plus size={16} />}>
              Tạo lịch hẹn
            </Button>
          </>
        }
      >
        <form id="appointment-form" onSubmit={handleCreateSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-50 text-sm text-red-600">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Tên bệnh nhân"
              required
              placeholder="VD: Nguyễn Văn Hùng"
              value={form.patientName}
              onChange={(event) => setForm((prev) => ({ ...prev, patientName: event.target.value }))}
            />
            <Input
              label="Số điện thoại"
              placeholder="09xxxxxxxx"
              value={form.patientPhone}
              onChange={(event) => setForm((prev) => ({ ...prev, patientPhone: event.target.value }))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Bác sĩ"
              required
              placeholder="VD: TS.BS. Nguyễn Văn An"
              value={form.doctorName}
              onChange={(event) => setForm((prev) => ({ ...prev, doctorName: event.target.value }))}
            />
            <Input
              label="Chuyên khoa"
              placeholder="VD: Khoa Nội"
              value={form.doctorDept}
              onChange={(event) => setForm((prev) => ({ ...prev, doctorDept: event.target.value }))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Ngày khám"
              type="date"
              required
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
            />
            <Input
              label="Khung giờ"
              required
              placeholder="VD: 09:00 - 09:30"
              value={form.timeRange}
              onChange={(event) => setForm((prev) => ({ ...prev, timeRange: event.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Trạng thái</label>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, status: event.target.value as AppointmentStatus }))
              }
              className={formInputClass}
            >
              <option value="pending">{APPOINTMENT_STATUS_LABELS.pending}</option>
              <option value="confirmed">{APPOINTMENT_STATUS_LABELS.confirmed}</option>
              <option value="completed">{APPOINTMENT_STATUS_LABELS.completed}</option>
              <option value="cancelled">{APPOINTMENT_STATUS_LABELS.cancelled}</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-800 dark:text-slate-100 text-right">{value}</span>
  </div>
);

export default AdminAppointmentsPage;
