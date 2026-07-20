import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Info,
  LucideIcon,
  Plus,
  Search,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { Card, Modal, Spinner } from '../../components/ui';
import Button from '../../components/ui/Button';
import {
  useAppointments,
  useCheckinAppointment,
  useConfirmAppointmentDeposit,
  useCreateAppointment,
  useReceptionistCatalog,
  useUpdateAppointmentStatus,
} from '../../features/receptionist/hooks';
import { Appointment, AppointmentStatus } from '../../features/receptionist/types';
import {
  CLINIC_DEPARTMENTS,
  getDoctorsByDepartment,
  getServicesByDepartment,
} from '../../features/receptionist/constants';

const STATUS_STYLES: Record<AppointmentStatus, { label: string; className: string }> = {
  pending: { label: 'Chờ xác nhận', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40' },
  confirmed: { label: 'Đã xác nhận', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40' },
  'checked-in': { label: 'Đã check-in', className: 'bg-[#1a56db] text-white' },
  done: { label: 'Hoàn thành', className: 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-300' },
  cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-600 dark:bg-red-950/40' },
};

const STATUS_FILTER_OPTIONS: { value: 'all' | AppointmentStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'checked-in', label: 'Đã check-in' },
  { value: 'done', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const DEPARTMENTS = CLINIC_DEPARTMENTS;
const PAGE_SIZE = 5;

const todayISO = () => new Date().toISOString().split('T')[0];

const formatDate = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return 'Chưa ghi nhận';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa ghi nhận';
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const formatCurrency = (amount?: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount ?? 0);

const PAYMENT_METHOD_LABELS: Record<'vnpay' | 'momo' | 'banking' | '', string> = {
  '': 'Chưa có',
  vnpay: 'VNPay',
  momo: 'MoMo',
  banking: 'Chuyển khoản ngân hàng',
};

interface NewAppointmentForm {
  name: string;
  phone: string;
  department: string;
  doctor: string;
  service: string;
  date: string;
  time: string;
}

const EMPTY_NEW_FORM: NewAppointmentForm = {
  name: '',
  phone: '',
  department: DEPARTMENTS[0],
  doctor: getDoctorsByDepartment(DEPARTMENTS[0])[0],
  service: getServicesByDepartment(DEPARTMENTS[0])[0],
  date: todayISO(),
  time: '08:00',
};

const TIMELINE = [
  { code: '#LH-9795', name: 'Nguyễn Diệu Nhi', detail: 'Khám nhi tổng quát • BS. Vũ Hà Phương', state: 'done' as const, note: 'Đã hoàn thành' },
  { code: '#LH-9799', name: 'Lê Hoàng Nam', detail: 'Khám chấn thương • BS. Đặng Quốc Anh', state: 'active' as const, note: 'Đang khám...' },
  { code: '#LH-9802', name: 'Trần Văn Tú', detail: 'Khám nội tổng quát • Chờ BS. Lê Minh Hoàng', state: 'upcoming' as const, note: 'Sắp tới (08:30)' },
];

const getDepositStatusMeta = (appointment: Appointment) => {
  const needsDeposit = appointment.source === 'patient' && (appointment.depositAmount ?? 0) > 0;
  if (!needsDeposit) {
    return {
      label: 'Không yêu cầu đặt cọc',
      className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
      description: 'Lịch do lễ tân tạo tại quầy hoặc lịch này không cần giữ chỗ bằng tiền cọc.',
    };
  }

  if (appointment.receptionDepositConfirmed) {
    return {
      label: 'Đã xác nhận đặt cọc',
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40',
      description: 'Lễ tân đã đối chiếu đúng số tiền bệnh nhân chuyển và có thể tiếp tục duyệt lịch hẹn.',
    };
  }

  if (appointment.depositPaidAt) {
    return {
      label: 'Chờ xác nhận đặt cọc',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40',
      description: 'Bệnh nhân đã báo đã chuyển tiền cọc. Lễ tân cần xác minh trước khi xác nhận lịch.',
    };
  }

  return {
    label: 'Chưa có xác nhận thanh toán',
    className: 'bg-red-100 text-red-600 dark:bg-red-950/40',
    description: 'Bệnh nhân chưa xác nhận đã thanh toán khoản cọc giữ lịch.',
  };
};

const ReceptionistAppointmentManagement: React.FC = () => {
  const { data: appointments = [], isLoading, isError } = useAppointments();
  const { data: catalog } = useReceptionistCatalog();
  const createAppointment = useCreateAppointment();
  const confirmDeposit = useConfirmAppointmentDeposit();
  const updateStatus = useUpdateAppointmentStatus();
  const checkin = useCheckinAppointment();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Appointment | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newForm, setNewForm] = useState<NewAppointmentForm>(EMPTY_NEW_FORM);
  const [newErrors, setNewErrors] = useState<Partial<Record<keyof NewAppointmentForm, string>>>({});
  const [toast, setToast] = useState<string | null>(null);

  const departmentCatalog = useMemo(() => {
    if (catalog?.departments?.length) {
      return catalog.departments.map((department) => ({
        name: department.name,
        doctors: department.doctors,
        services: department.services,
      }));
    }

    return DEPARTMENTS.map((department) => ({
      name: department,
      doctors: getDoctorsByDepartment(department),
      services: getServicesByDepartment(department),
    }));
  }, [catalog]);

  const departmentOptions = useMemo(
    () => departmentCatalog.map((department) => department.name),
    [departmentCatalog],
  );

  const doctorsByDepartment = useMemo(
    () =>
      Object.fromEntries(
        departmentCatalog.map((department) => [department.name, department.doctors]),
      ) as Record<string, string[]>,
    [departmentCatalog],
  );

  const servicesByDepartment = useMemo(
    () =>
      Object.fromEntries(
        departmentCatalog.map((department) => [department.name, department.services]),
      ) as Record<string, string[]>,
    [departmentCatalog],
  );

  const availableDepartments = useMemo(() => {
    const fromAppointments = appointments.map((appointment) => appointment.department);
    return Array.from(new Set([...departmentOptions, ...fromAppointments])).filter(Boolean);
  }, [appointments, departmentOptions]);

  useEffect(() => {
    if (departmentOptions.length === 0) return;

    setNewForm((form) => {
      const department = departmentOptions.includes(form.department) ? form.department : departmentOptions[0];
      const doctors = doctorsByDepartment[department] ?? [];
      const services = servicesByDepartment[department] ?? [];
      const doctor = doctors.includes(form.doctor) ? form.doctor : doctors[0] ?? '';
      const service = services.includes(form.service) ? form.service : services[0] ?? '';

      if (department === form.department && doctor === form.doctor && service === form.service) {
        return form;
      }

      return { ...form, department, doctor, service };
    });
  }, [departmentOptions, doctorsByDepartment, servicesByDepartment]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!detail) return;
    const fresh = appointments.find((a) => a.id === detail.id);
    if (fresh) setDetail(fresh);
  }, [appointments, detail]);

  const stats: { label: string; value: number; icon: LucideIcon; tone: string }[] = useMemo(() => {
    const by = (s: AppointmentStatus) => appointments.filter((a) => a.status === s).length;
    return [
      { label: 'Tổng lịch hẹn', value: appointments.length, icon: Calendar, tone: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40' },
      { label: 'Đã xác nhận', value: by('confirmed'), icon: CheckCircle2, tone: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40' },
      { label: 'Chờ xác nhận', value: by('pending'), icon: Clock, tone: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40' },
      { label: 'Đã hủy', value: by('cancelled'), icon: XCircle, tone: 'bg-red-100 text-red-600 dark:bg-red-950/40' },
    ];
  }, [appointments]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return appointments.filter((a) => {
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchDept = departmentFilter === 'all' || a.department === departmentFilter;
      const matchSearch =
        keyword === '' ||
        a.patientName.toLowerCase().includes(keyword) ||
        a.code.toLowerCase().includes(keyword) ||
        (a.phone ?? '').replace(/\s/g, '').includes(keyword.replace(/\s/g, ''));
      return matchStatus && matchDept && matchSearch;
    });
  }, [appointments, search, statusFilter, departmentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, departmentFilter]);

  const changeStatus = (id: string, status: AppointmentStatus, message: string) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => setToast(message),
        onError: () => setToast('Cập nhật trạng thái thất bại.'),
      },
    );
  };

  const handleCheckin = (appt: Appointment) => {
    checkin.mutate(appt.id, {
      onSuccess: ({ ticket }) =>
        setToast(`Đã check-in ${appt.patientName} • Số thứ tự #${String(ticket).padStart(3, '0')}.`),
      onError: (err: unknown) => {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          || 'Không thể check-in. Vui lòng thử lại.';
        setToast(message);
      },
    });
  };

  const handleConfirmDeposit = (appt: Appointment) => {
    confirmDeposit.mutate(appt.id, {
      onSuccess: () => setToast(`Đã xác nhận đặt cọc cho lịch ${appt.code}.`),
      onError: (err: unknown) => {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          || 'Không thể xác nhận đặt cọc.';
        setToast(message);
      },
    });
  };

  const handleCreate = () => {
    const errors: Partial<Record<keyof NewAppointmentForm, string>> = {};
    if (!newForm.name.trim()) errors.name = 'Vui lòng nhập tên bệnh nhân.';
    if (!/^0\d{9}$/.test(newForm.phone.trim())) errors.phone = 'Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0.';
    if (!newForm.date) errors.date = 'Chọn ngày khám.';
    if (!newForm.time) errors.time = 'Chọn giờ khám.';
    setNewErrors(errors);
    if (Object.keys(errors).length > 0) return;

    createAppointment.mutate(
      {
        patientName: newForm.name.trim(),
        phone: newForm.phone.trim(),
        doctor: newForm.doctor,
        department: newForm.department,
        service: newForm.service,
        date: newForm.date,
        time: newForm.time,
      },
      {
        onSuccess: (appt) => {
          setCreateOpen(false);
          setNewForm(EMPTY_NEW_FORM);
          setNewErrors({});
          setStatusFilter('all');
          setDepartmentFilter('all');
          setSearch('');
          setToast(`Đã tạo lịch hẹn ${appt.code} cho ${appt.patientName}.`);
        },
        onError: () => setToast('Không thể tạo lịch hẹn.'),
      },
    );
  };

  const detailDepositStatus = detail ? getDepositStatusMeta(detail) : null;
  const detailNeedsDepositConfirmation = Boolean(
    detail &&
      detail.status === 'pending' &&
      detail.source === 'patient' &&
      (detail.depositAmount ?? 0) > 0 &&
      !detail.receptionDepositConfirmed,
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1a56db]" style={{ fontFamily: 'Lexend' }}>
        Quản lý lịch hẹn
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
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

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="flex-1">
            <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-slate-400">Tìm kiếm</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 focus-within:border-[#1a56db] dark:border-slate-600">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Mã LH, tên bệnh nhân, SĐT..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </label>
          <label className="lg:w-48">
            <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-slate-400">Trạng thái</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | AppointmentStatus)}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-[#1a56db] dark:border-slate-600"
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="lg:w-48">
            <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-slate-400">Khoa khám</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-[#1a56db] dark:border-slate-600"
            >
              <option value="all">Tất cả các khoa</option>
              {availableDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </label>
          <Button leftIcon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
            Tạo lịch hẹn mới
          </Button>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className="px-5 py-12 text-center text-sm text-red-500">Không tải được danh sách lịch hẹn.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 dark:border-slate-700">
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
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">
                      Không tìm thấy lịch hẹn phù hợp.
                    </td>
                  </tr>
                ) : (
                  paginated.map((appt) => (
                    <tr key={appt.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/40">
                      <td className="px-5 py-4 font-semibold text-[#1a56db]">{appt.code}</td>
                      <td className="px-3 py-4">
                        <p className="font-medium">{appt.patientName}</p>
                        <p className="text-xs text-gray-400">{appt.phone}</p>
                      </td>
                      <td className="px-3 py-4 text-gray-600 dark:text-slate-300">{appt.doctor}</td>
                      <td className="px-3 py-4 text-gray-600 dark:text-slate-300">{appt.department}</td>
                      <td className="px-3 py-4 text-gray-500 dark:text-slate-400">{formatDate(appt.date)}</td>
                      <td className="px-3 py-4 text-gray-500 dark:text-slate-400">{appt.time}</td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[appt.status].className}`}>
                          {STATUS_STYLES[appt.status].label}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-right pr-5">
                        <button
                          type="button"
                          onClick={() => setDetail(appt)}
                          className="text-sm font-medium text-[#1a56db] hover:underline"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-3 dark:border-slate-700">
          <p className="text-xs text-gray-400">
            Hiển thị {paginated.length} trên {filtered.length} kết quả
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600"
              aria-label="Trang trước"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-lg text-sm font-medium ${
                  p === currentPage
                    ? 'bg-[#1a56db] text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-slate-600'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600"
              aria-label="Trang sau"
            >
              ›
            </button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
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
          <h2 className="mb-3 text-base font-semibold">Ghi chú quan trọng</h2>
          <p className="text-sm text-blue-50">
            Hôm nay ưu tiên xử lý các lịch bệnh nhân tự đặt đang chờ duyệt cọc trước khi gọi check-in để tránh sai lệch trạng thái.
          </p>
          <div className="mt-4 flex gap-3 rounded-xl bg-white/10 p-3">
            <Info size={18} className="shrink-0" />
            <div>
              <p className="text-sm font-semibold">Lưu ý vận hành</p>
              <p className="mt-0.5 text-xs text-blue-100">
                Lễ tân chỉ xác nhận lịch hẹn sau khi đã kiểm tra đúng khoản đặt cọc đối với lịch do bệnh nhân đặt online.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail ? `Chi tiết lịch hẹn ${detail.code}` : ''}
        footer={
          detail && (
            <>
              <Button variant="ghost" onClick={() => setDetail(null)}>
                Đóng
              </Button>
              {detail.status === 'pending' && (
                <>
                  <Button
                    variant="danger"
                    loading={updateStatus.isPending}
                    onClick={() => changeStatus(detail.id, 'cancelled', `Đã hủy lịch hẹn ${detail.code}.`)}
                  >
                    Hủy lịch
                  </Button>
                  {detailNeedsDepositConfirmation && (
                    <Button
                      loading={confirmDeposit.isPending}
                      onClick={() => handleConfirmDeposit(detail)}
                    >
                      Xác nhận đặt cọc
                    </Button>
                  )}
                  <Button
                    loading={updateStatus.isPending}
                    disabled={detailNeedsDepositConfirmation}
                    onClick={() => changeStatus(detail.id, 'confirmed', `Đã xác nhận lịch hẹn ${detail.code}.`)}
                    leftIcon={<CheckCircle2 size={16} />}
                  >
                    Xác nhận lịch
                  </Button>
                </>
              )}
              {detail.status === 'confirmed' && (
                <>
                  <Button
                    variant="danger"
                    loading={updateStatus.isPending}
                    onClick={() => changeStatus(detail.id, 'cancelled', `Đã hủy lịch hẹn ${detail.code}.`)}
                  >
                    Hủy lịch
                  </Button>
                  <Button
                    loading={checkin.isPending}
                    onClick={() => handleCheckin(detail)}
                    leftIcon={<UserCheck size={16} />}
                  >
                    Check-in
                  </Button>
                </>
              )}
            </>
          )
        }
      >
        {detail && detailDepositStatus && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{detail.patientName}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {detail.source === 'patient' ? 'Bệnh nhân tự đặt lịch online' : 'Lễ tân tạo lịch tại quầy'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[detail.status].className}`}>
                  {STATUS_STYLES[detail.status].label}
                </span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${detailDepositStatus.className}`}>
                  {detailDepositStatus.label}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-slate-700">
              <p className="font-medium text-slate-900">Luồng xử lý hiện tại</p>
              <p className="mt-1 leading-6">{detailDepositStatus.description}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-100 text-sm dark:border-slate-700">
                <div className="border-b border-gray-100 px-4 py-3 font-medium text-slate-900 dark:border-slate-700 dark:text-slate-100">
                  Thông tin lịch hẹn
                </div>
                <dl className="divide-y divide-gray-100 dark:divide-slate-700">
                  {[
                    { label: 'Số điện thoại', value: detail.phone || '—' },
                    { label: 'Bác sĩ', value: detail.doctor },
                    { label: 'Khoa khám', value: detail.department },
                    { label: 'Dịch vụ', value: detail.service || 'Khám tổng quát' },
                    { label: 'Ngày khám', value: formatDate(detail.date) },
                    { label: 'Giờ khám', value: detail.time },
                    { label: 'Phòng khám', value: detail.room || 'Chưa phân phòng' },
                    { label: 'Số thứ tự', value: detail.queueTicket ? `#${detail.queueTicket}` : 'Chưa check-in' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between gap-4 px-4 py-2.5">
                      <dt className="text-gray-500 dark:text-slate-400">{item.label}</dt>
                      <dd className="text-right font-medium text-slate-800 dark:text-slate-200">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-xl border border-gray-100 text-sm dark:border-slate-700">
                <div className="border-b border-gray-100 px-4 py-3 font-medium text-slate-900 dark:border-slate-700 dark:text-slate-100">
                  Thông tin đặt cọc
                </div>
                <dl className="divide-y divide-gray-100 dark:divide-slate-700">
                  {[
                    { label: 'Yêu cầu đặt cọc', value: detail.source === 'patient' && (detail.depositAmount ?? 0) > 0 ? 'Có' : 'Không' },
                    { label: 'Số tiền đặt cọc', value: (detail.depositAmount ?? 0) > 0 ? formatCurrency(detail.depositAmount) : 'Không áp dụng' },
                    { label: 'Phương thức', value: PAYMENT_METHOD_LABELS[detail.depositPaymentMethod ?? ''] },
                    { label: 'Bệnh nhân xác nhận lúc', value: formatDateTime(detail.depositPaidAt) },
                    { label: 'Lễ tân xác nhận cọc', value: detail.receptionDepositConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận' },
                    { label: 'Bảo hiểm', value: detail.insured ? 'Có bảo hiểm' : 'Không có bảo hiểm' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between gap-4 px-4 py-2.5">
                      <dt className="text-gray-500 dark:text-slate-400">{item.label}</dt>
                      <dd className="text-right font-medium text-slate-800 dark:text-slate-200">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {(detail.status === 'cancelled' || detail.status === 'done' || detail.status === 'checked-in') && (
              <p className="text-xs text-gray-400">
                {detail.status === 'cancelled'
                  ? 'Lịch hẹn này đã bị hủy.'
                  : detail.status === 'done'
                    ? 'Lịch hẹn này đã hoàn thành.'
                    : 'Bệnh nhân đã check-in và đang trong hàng chờ.'}
              </p>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setNewErrors({});
        }}
        title="Tạo lịch hẹn mới"
        description="Lịch hẹn mới sẽ ở trạng thái Chờ xác nhận."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setCreateOpen(false);
                setNewErrors({});
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleCreate} loading={createAppointment.isPending} leftIcon={<Plus size={16} />}>
              Tạo lịch hẹn
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
              Tên bệnh nhân <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={newForm.name}
              onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="VD: Nguyễn Văn A"
              className={`w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm outline-none ${
                newErrors.name ? 'border-red-400' : 'border-gray-200 focus:border-[#1a56db] dark:border-slate-600'
              }`}
            />
            {newErrors.name && <span className="mt-1 block text-xs text-red-500">{newErrors.name}</span>}
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
              Số điện thoại <span className="text-red-500">*</span>
            </span>
            <input
              type="tel"
              inputMode="numeric"
              value={newForm.phone}
              onChange={(e) => setNewForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
              placeholder="090..."
              className={`w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm outline-none ${
                newErrors.phone ? 'border-red-400' : 'border-gray-200 focus:border-[#1a56db] dark:border-slate-600'
              }`}
            />
            {newErrors.phone && <span className="mt-1 block text-xs text-red-500">{newErrors.phone}</span>}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">Khoa khám</span>
            <select
              value={newForm.department}
              onChange={(e) => {
                const department = e.target.value;
                const doctors = doctorsByDepartment[department] ?? [];
                const services = servicesByDepartment[department] ?? [];
                setNewForm((f) => ({
                  ...f,
                  department,
                  doctor: doctors[0] ?? '',
                  service: services[0] ?? '',
                }));
              }}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] dark:border-slate-600"
            >
              {departmentOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">Bác sĩ</span>
            <select
              value={newForm.doctor}
              onChange={(e) => setNewForm((f) => ({ ...f, doctor: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] dark:border-slate-600"
            >
              {(doctorsByDepartment[newForm.department] ?? []).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">Dịch vụ khám</span>
            <select
              value={newForm.service}
              onChange={(e) => setNewForm((f) => ({ ...f, service: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#1a56db] dark:border-slate-600"
            >
              {(servicesByDepartment[newForm.department] ?? []).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
              Ngày khám <span className="text-red-500">*</span>
            </span>
            <input
              type="date"
              value={newForm.date}
              min={todayISO()}
              onChange={(e) => setNewForm((f) => ({ ...f, date: e.target.value }))}
              className={`w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm outline-none ${
                newErrors.date ? 'border-red-400' : 'border-gray-200 focus:border-[#1a56db] dark:border-slate-600'
              }`}
            />
            {newErrors.date && <span className="mt-1 block text-xs text-red-500">{newErrors.date}</span>}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">
              Giờ khám <span className="text-red-500">*</span>
            </span>
            <input
              type="time"
              value={newForm.time}
              onChange={(e) => setNewForm((f) => ({ ...f, time: e.target.value }))}
              className={`w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm outline-none ${
                newErrors.time ? 'border-red-400' : 'border-gray-200 focus:border-[#1a56db] dark:border-slate-600'
              }`}
            />
            {newErrors.time && <span className="mt-1 block text-xs text-red-500">{newErrors.time}</span>}
          </label>
        </div>
      </Modal>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg animate-fade-up"
        >
          <CheckCircle2 size={18} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default ReceptionistAppointmentManagement;
