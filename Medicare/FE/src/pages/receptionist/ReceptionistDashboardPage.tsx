import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  LucideIcon,
  Megaphone,
  UserPlus,
  Users,
} from 'lucide-react';
import { Avatar, Card, Spinner } from '../../components/ui';
import Button from '../../components/ui/Button';
import { Modal } from '../../components/ui';
import { useReceptionistOverview, useUpdateQueueTicket } from '../../features/receptionist/hooks';
import { QueueTicket, RoomKey } from '../../features/receptionist/types';
import { CLINIC_ROOMS } from '../../features/receptionist/constants';

const PATHS = {
  reception: '/receptionist/tiep-nhan',
  queue: '/receptionist/hang-cho',
  appointments: '/receptionist/lich-hen',
  invoices: '/receptionist/hoa-don',
} as const;

interface Room {
  name: string;
  specialty: string;
  doctor: string;
  busy: boolean;
  progress: number;
}

// Trạng thái hoạt động của từng phòng (phòng/khoa/bác sĩ lấy từ nguồn chung CLINIC_ROOMS).
const ROOM_ACTIVITY: Record<RoomKey, { busy: boolean; progress: number }> = {
  P101: { busy: true, progress: 65 },
  P102: { busy: false, progress: 0 },
  P201: { busy: true, progress: 40 },
  P202: { busy: true, progress: 80 },
  P301: { busy: true, progress: 30 },
  P302: { busy: false, progress: 0 },
  P401: { busy: true, progress: 50 },
  P402: { busy: false, progress: 0 },
};

const ROOMS: Room[] = CLINIC_ROOMS.map((room) => {
  const activity = ROOM_ACTIVITY[room.key];
  return {
    name: room.label,
    specialty: room.department,
    doctor: activity.busy ? `${room.doctor} - Đang khám` : 'Đang trống',
    busy: activity.busy,
    progress: activity.progress,
  };
});

const NOTICES = [
  { title: 'Họp giao ban định kỳ', body: '14:00 chiều nay tại phòng hội trường tầng 5.' },
  { title: 'Cập nhật phần mềm', body: 'Hệ thống sẽ bảo trì từ 23:00 tối mai trong 30 phút.' },
];

const formatTicket = (n: number) => `#${String(n).padStart(3, '0')}`;

const ReceptionistDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useReceptionistOverview();
  const updateTicket = useUpdateQueueTicket();

  const [queueFilter, setQueueFilter] = useState<'all' | 'waiting'>('all');
  const [pendingCall, setPendingCall] = useState<QueueTicket | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const stats = data?.stats;
  const queuePreview = useMemo(() => data?.queuePreview ?? [], [data]);
  const upcoming = data?.upcoming ?? [];

  const statCards: { label: string; value: string; icon: LucideIcon; tone: string; to: string }[] = [
    { label: 'Bệnh nhân chờ khám', value: String(stats?.waitingCount ?? 0), icon: Users, tone: 'bg-blue-50 text-[#2563eb]', to: PATHS.queue },
    { label: 'Lịch hẹn hôm nay', value: String(stats?.appointmentsToday ?? 0), icon: Calendar, tone: 'bg-emerald-50 text-emerald-600', to: PATHS.appointments },
    { label: 'Đã check-in', value: String(stats?.checkedInToday ?? 0), icon: CheckCircle2, tone: 'bg-cyan-50 text-cyan-600', to: PATHS.reception },
    { label: 'Chờ xác nhận', value: String(stats?.pendingToday ?? 0), icon: Clock, tone: 'bg-amber-50 text-amber-600', to: PATHS.appointments },
  ];

  const filteredQueue = useMemo(
    () => (queueFilter === 'all' ? queuePreview : queuePreview.filter((row) => row.status === 'waiting')),
    [queueFilter, queuePreview],
  );

  const confirmCall = () => {
    if (!pendingCall) return;
    const row = pendingCall;
    updateTicket.mutate(
      { id: row.id, action: 'call' },
      {
        onSuccess: () => setToast(`Đã mời ${row.patientName} (${formatTicket(row.ticket)}) vào ${row.room}.`),
        onError: () => setToast('Không thể mời khám. Vui lòng thử lại.'),
      },
    );
    setPendingCall(null);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#06b6d4] p-7 sm:p-9 shadow-soft-lg animate-fade-up">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-soft-float" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-[#06b6d4]/30 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <h1 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight leading-tight">
              Tổng quan Lễ tân
            </h1>
            <p className="text-sm sm:text-[15px] text-blue-50/90">
              Chào mừng trở lại! Hôm nay có {stats?.appointmentsToday ?? 0} bệnh nhân dự kiến.
            </p>
          </div>
          <Button
            onClick={() => navigate(PATHS.reception)}
            leftIcon={<UserPlus size={16} />}
            className="!bg-white !text-[#1e40af] !border-white hover:!bg-blue-50 shrink-0 shadow-lg shadow-blue-900/20"
          >
            Tiếp nhận mới
          </Button>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, tone, to }, index) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(to)}
            className={`group text-left bg-white border border-slate-200/70 rounded-[20px] shadow-soft p-5 hover:shadow-soft-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40 transition-all duration-300 animate-fade-up stagger-${index + 1}`}
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-[28px] font-bold text-slate-900 tracking-tight leading-8">
                  {isLoading ? '…' : value}
                </p>
                <p className="text-[13px] text-slate-500 font-medium mt-0.5">{label}</p>
              </div>
            </div>
          </button>
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
                      queueFilter === key ? 'bg-white dark:bg-slate-600 text-[#2563eb] shadow-sm' : 'text-gray-500 dark:text-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : isError ? (
              <div className="px-5 py-10 text-center text-sm text-red-500">Không tải được hàng chờ.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      <th className="px-5 py-3">STT</th>
                      <th className="px-3 py-3">Bệnh nhân</th>
                      <th className="px-3 py-3">Dịch vụ/Phòng</th>
                      <th className="px-3 py-3">Trạng thái</th>
                      <th className="px-3 py-3 text-right pr-5">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {filteredQueue.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                          Không còn bệnh nhân nào đang chờ.
                        </td>
                      </tr>
                    ) : (
                      filteredQueue.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/40">
                          <td className="px-5 py-4 font-semibold text-[#2563eb]">{formatTicket(row.ticket)}</td>
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={row.patientName} size="sm" />
                              <div>
                                <p className="font-medium">{row.patientName}</p>
                                <p className="text-xs text-gray-400">{row.code}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <p>{row.department}</p>
                            <p className="text-xs text-gray-400">({row.room})</p>
                          </td>
                          <td className="px-3 py-4">
                            {row.status === 'in-progress' ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-emerald-700 dark:bg-emerald-950/40">
                                Đang khám
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-gray-500 dark:bg-slate-700 dark:text-slate-300">
                                Chờ ghi
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-4 text-right pr-5">
                            {row.status === 'in-progress' ? (
                              <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                                <CheckCircle2 size={14} /> Đang khám
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setPendingCall(row)}
                                className="text-sm font-medium text-[#2563eb] hover:underline"
                              >
                                Mời khám
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="border-t border-gray-100 dark:border-slate-700 py-3 text-center">
              <button
                type="button"
                onClick={() => navigate(PATHS.queue)}
                className="text-sm font-medium text-[#2563eb] hover:underline"
              >
                Xem tất cả hàng đợi ({stats?.waitingCount ?? 0})
              </button>
            </div>
          </Card>

          {/* Rooms */}
          <div className="grid gap-4 sm:grid-cols-3">
            {ROOMS.map((room) => (
              <Card key={room.name} className={room.busy ? '' : 'border-emerald-200 dark:border-emerald-900'}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#2563eb]">{room.name}</h3>
                  <span className={`h-2.5 w-2.5 rounded-full ${room.busy ? 'bg-red-500' : 'bg-emerald-500'}`} />
                </div>
                <p className="mt-2 text-sm font-medium">{room.specialty}</p>
                <p className="mt-1 text-xs text-gray-400">{room.doctor}</p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                  <div
                    className={`h-full rounded-full ${room.busy ? 'bg-gradient-to-r from-[#2563eb] to-[#06b6d4]' : 'bg-emerald-500'}`}
                    style={{ width: `${room.busy ? room.progress : 0}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Upcoming */}
          <Card padding="none" className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
              <h2 className="text-base font-semibold">Lịch hẹn sắp tới</h2>
              <button
                type="button"
                onClick={() => navigate(PATHS.appointments)}
                className="text-sm font-medium text-[#2563eb] hover:underline"
              >
                Xem hết
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {upcoming.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-gray-400">Chưa có lịch hẹn sắp tới.</p>
              ) : (
                upcoming.map((appt) => (
                  <button
                    key={appt.id}
                    type="button"
                    onClick={() => navigate(PATHS.appointments)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    <div className="flex w-14 shrink-0 flex-col items-center rounded-lg bg-blue-50 dark:bg-blue-950/40 py-1.5 text-[#2563eb]">
                      <span className="text-sm font-bold leading-tight">{appt.time}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{appt.patientName}</p>
                      <p className="text-xs text-gray-400 truncate">{appt.service} • {appt.doctor}</p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-gray-300" />
                  </button>
                ))
              )}
            </div>
          </Card>

          {/* Notices */}
          <div className="rounded-[20px] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#06b6d4] p-5 text-white shadow-soft-lg">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone size={18} />
              <h2 className="text-base font-semibold">Thông báo mới</h2>
            </div>
            <div className="space-y-3">
              {NOTICES.map((notice) => (
                <div key={notice.title} className="rounded-xl bg-white/10 p-3">
                  <p className="text-sm font-semibold">{notice.title}</p>
                  <p className="mt-0.5 text-xs text-blue-100">{notice.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm call modal */}
      <Modal
        open={pendingCall !== null}
        onClose={() => setPendingCall(null)}
        title="Xác nhận mời khám"
        description="Vui lòng kiểm tra thông tin trước khi mời bệnh nhân vào phòng."
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingCall(null)}>
              Hủy
            </Button>
            <Button onClick={confirmCall} loading={updateTicket.isPending} leftIcon={<CheckCircle2 size={16} />}>
              Xác nhận mời
            </Button>
          </>
        }
      >
        {pendingCall && (
          <div className="flex items-center gap-3">
            <Avatar name={pendingCall.patientName} size="lg" />
            <div className="min-w-0">
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {pendingCall.patientName}{' '}
                <span className="font-medium text-[#2563eb]">{formatTicket(pendingCall.ticket)}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">{pendingCall.code}</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {pendingCall.department} • {pendingCall.room}
              </p>
            </div>
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

export default ReceptionistDashboardPage;
