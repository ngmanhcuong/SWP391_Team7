import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Info,
  Phone,
  Printer,
  Search,
  Stethoscope,
  UserPlus,
} from 'lucide-react';
import { Avatar, Badge, Card, Modal, Spinner } from '../../components/ui';
import Button from '../../components/ui/Button';
import { useAppointments, useCheckinAppointment } from '../../features/receptionist/hooks';
import { Appointment } from '../../features/receptionist/types';

const STATUS_FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'booked', label: 'Chờ check-in' },
  { key: 'checked-in', label: 'Đã check-in' },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]['key'];

const isBooked = (a: Appointment) => a.status === 'pending' || a.status === 'confirmed';
const formatTicket = (n?: number | null) => (n ? `#${String(n).padStart(3, '0')}` : '#---');

interface IssuedTicket {
  appointment: Appointment;
  ticket: number;
}

const ReceptionistReceptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: appointments = [], isLoading, isError } = useAppointments();
  const checkin = useCheckinAppointment();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [pending, setPending] = useState<Appointment | null>(null);
  const [issued, setIssued] = useState<IssuedTicket | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Only appointments relevant to reception (exclude cancelled/done).
  const relevant = useMemo(
    () => appointments.filter((a) => isBooked(a) || a.status === 'checked-in'),
    [appointments],
  );

  const counts = useMemo(
    () => ({
      total: relevant.length,
      checkedIn: relevant.filter((a) => a.status === 'checked-in').length,
      booked: relevant.filter(isBooked).length,
    }),
    [relevant],
  );

  const lastTicket = useMemo(
    () => relevant.reduce((max, a) => Math.max(max, a.queueTicket ?? 0), 83),
    [relevant],
  );

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return relevant.filter((a) => {
      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'booked'
          ? isBooked(a)
          : a.status === 'checked-in';
      const matchSearch =
        keyword === '' ||
        a.patientName.toLowerCase().includes(keyword) ||
        (a.phone ?? '').replace(/\s/g, '').includes(keyword.replace(/\s/g, '')) ||
        a.code.toLowerCase().includes(keyword) ||
        (a.patientCode ?? '').toLowerCase().includes(keyword);
      return matchStatus && matchSearch;
    });
  }, [relevant, search, statusFilter]);

  const confirmCheckIn = () => {
    if (!pending) return;
    checkin.mutate(pending.id, {
      onSuccess: ({ appointment, ticket }) => {
        setPending(null);
        setIssued({ appointment, ticket });
        setToast(`Đã check-in ${appointment.patientName} • Số thứ tự ${formatTicket(ticket)}.`);
      },
      onError: (err: unknown) => {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          || 'Không thể check-in. Vui lòng thử lại.';
        setToast(message);
      },
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Lexend' }}>
            Tiếp đón &amp; Check-in
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Xác nhận bệnh nhân đến khám và cấp số thứ tự vào hàng chờ.
          </p>
        </div>
        <Button leftIcon={<UserPlus size={16} />} onClick={() => navigate('/receptionist/benh-nhan')}>
          Khách vãng lai (không hẹn)
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Lịch hẹn hôm nay', value: counts.total, icon: CalendarClock, tone: 'bg-blue-50 text-[#1a56db]' },
          { label: 'Chờ check-in', value: counts.booked, icon: Clock, tone: 'bg-amber-50 text-amber-600' },
          { label: 'Đã check-in', value: counts.checkedIn, icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-600' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} padding="sm" className="flex items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
              <Icon size={20} />
            </span>
            <div>
              <p className="text-2xl font-bold leading-7">{value}</p>
              <p className="text-[13px] text-gray-500 dark:text-slate-400">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main: appointment list */}
        <Card padding="none" className="overflow-hidden">
          <div className="flex flex-col gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-700 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên, SĐT, mã hẹn, mã BN..."
                className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent py-2 pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1a56db]"
              />
            </div>
            <div className="inline-flex shrink-0 p-1 rounded-lg bg-gray-100 dark:bg-slate-700">
              {STATUS_FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    statusFilter === key
                      ? 'bg-white dark:bg-slate-600 text-[#1a56db] shadow-sm'
                      : 'text-gray-500 dark:text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : isError ? (
            <div className="px-5 py-12 text-center text-sm text-red-500">
              Không tải được danh sách lịch hẹn.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    <th className="px-5 py-3">Giờ hẹn</th>
                    <th className="px-3 py-3">Bệnh nhân</th>
                    <th className="px-3 py-3">Dịch vụ / Bác sĩ</th>
                    <th className="px-3 py-3">Trạng thái</th>
                    <th className="px-3 py-3 text-right pr-5">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400">
                        Không tìm thấy lịch hẹn phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/40">
                        <td className="px-5 py-4 align-top">
                          <p className="font-semibold text-[#1a56db]">{row.time}</p>
                          <p className="text-xs text-gray-400">{row.code}</p>
                        </td>
                        <td className="px-3 py-4 align-top">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={row.patientName} size="sm" />
                            <div className="min-w-0">
                              <p className="font-medium">{row.patientName}</p>
                              <p className="flex items-center gap-1 text-xs text-gray-400">
                                <Phone size={11} /> {row.phone || '—'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 align-top">
                          <p>{row.service}</p>
                          <p className="text-xs text-gray-400">
                            {row.doctor} • {row.department}
                          </p>
                        </td>
                        <td className="px-3 py-4 align-top">
                          {row.status === 'checked-in' ? (
                            <div className="space-y-1">
                              <Badge variant="success">Đã check-in</Badge>
                              {row.queueTicket && (
                                <p className="text-xs font-semibold text-emerald-600">
                                  STT {formatTicket(row.queueTicket)}
                                </p>
                              )}
                            </div>
                          ) : (
                            <Badge variant="warning">Chờ check-in</Badge>
                          )}
                        </td>
                        <td className="px-3 py-4 align-top text-right pr-5">
                          {row.status === 'checked-in' ? (
                            <button
                              type="button"
                              onClick={() => setIssued({ appointment: row, ticket: row.queueTicket ?? 0 })}
                              className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-[#1a56db]"
                            >
                              <Printer size={14} /> In lại STT
                            </button>
                          ) : (
                            <Button size="sm" onClick={() => setPending(row)}>
                              Check-in
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#1e40af] p-5 text-white shadow-lg">
            <div className="mb-3 flex items-center gap-2">
              <Info size={18} />
              <h2 className="text-base font-semibold">Quy trình tiếp đón</h2>
            </div>
            <ol className="space-y-2.5 text-sm text-blue-50">
              <li className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">1</span>
                Tìm bệnh nhân theo tên, SĐT hoặc mã hẹn.
              </li>
              <li className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">2</span>
                Đối chiếu giấy tờ và xác nhận thông tin lịch hẹn.
              </li>
              <li className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">3</span>
                Nhấn <strong>Check-in</strong> để cấp số thứ tự và đưa vào hàng chờ.
              </li>
              <li className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">4</span>
                In phiếu số thứ tự và mời bệnh nhân ngồi chờ.
              </li>
            </ol>
          </div>

          <Card>
            <h2 className="mb-2 text-base font-semibold">Số thứ tự gần nhất</h2>
            <p className="text-4xl font-bold text-[#1a56db]" style={{ fontFamily: 'Lexend' }}>
              {formatTicket(lastTicket)}
            </p>
            <p className="mt-1 text-xs text-gray-400">Số tiếp theo sẽ là {formatTicket(lastTicket + 1)}.</p>
            <button
              type="button"
              onClick={() => navigate('/receptionist/hang-cho')}
              className="mt-4 text-sm font-medium text-[#1a56db] hover:underline"
            >
              Xem hàng chờ →
            </button>
          </Card>
        </div>
      </div>

      {/* Confirm check-in modal */}
      <Modal
        open={pending !== null}
        onClose={() => setPending(null)}
        title="Xác nhận check-in"
        description="Đối chiếu thông tin trước khi cấp số thứ tự."
        footer={
          <>
            <Button variant="ghost" onClick={() => setPending(null)}>
              Hủy
            </Button>
            <Button onClick={confirmCheckIn} loading={checkin.isPending} leftIcon={<CheckCircle2 size={16} />}>
              Xác nhận check-in
            </Button>
          </>
        }
      >
        {pending && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={pending.patientName} size="lg" />
              <div className="min-w-0">
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{pending.patientName}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{pending.patientCode || '—'}</p>
              </div>
              {pending.insured && (
                <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Có BHYT
                </span>
              )}
            </div>
            <dl className="divide-y divide-gray-100 dark:divide-slate-700 rounded-xl border border-gray-100 dark:border-slate-700 text-sm">
              {[
                { label: 'Mã lịch hẹn', value: pending.code },
                { label: 'Giờ hẹn', value: pending.time },
                { label: 'Dịch vụ', value: pending.service || '—' },
                { label: 'Bác sĩ', value: pending.doctor },
                { label: 'Khoa khám', value: pending.department },
              ].map((item) => (
                <div key={item.label} className="flex justify-between px-4 py-2.5">
                  <dt className="text-gray-500 dark:text-slate-400">{item.label}</dt>
                  <dd className="font-medium text-slate-800 dark:text-slate-200">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Modal>

      {/* Issued ticket modal */}
      <Modal
        open={issued !== null}
        onClose={() => setIssued(null)}
        title="Phiếu số thứ tự"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIssued(null)}>
              Đóng
            </Button>
            <Button onClick={() => window.print()} leftIcon={<Printer size={16} />}>
              In phiếu
            </Button>
          </>
        }
      >
        {issued && (
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">Số thứ tự của bạn</p>
            <p className="my-2 text-6xl font-bold text-[#1a56db]" style={{ fontFamily: 'Lexend' }}>
              {formatTicket(issued.ticket)}
            </p>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
              {issued.appointment.patientName}
            </p>
            <div className="mx-auto mt-4 max-w-xs space-y-1.5 rounded-xl bg-gray-50 dark:bg-slate-700/40 p-4 text-left text-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Stethoscope size={15} className="text-[#1a56db]" /> {issued.appointment.service}
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <CalendarClock size={15} className="text-[#1a56db]" /> {issued.appointment.time} • {issued.appointment.doctor}
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Info size={15} className="text-[#1a56db]" /> {issued.appointment.department}
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400">Vui lòng giữ phiếu và chờ được gọi vào phòng khám.</p>
          </div>
        )}
      </Modal>

      {/* Toast */}
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

export default ReceptionistReceptionPage;
