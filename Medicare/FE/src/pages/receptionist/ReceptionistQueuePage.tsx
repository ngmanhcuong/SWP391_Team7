import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Megaphone,
  Pause,
  Play,
  TrendingUp,
  UserPlus,
  Volume2,
} from 'lucide-react';
import { Avatar, Badge, Card, Modal, Spinner } from '../../components/ui';
import Button from '../../components/ui/Button';
import {
  useCallNext,
  useManualAddQueue,
  useQueue,
  useUpdateQueueTicket,
} from '../../features/receptionist/hooks';
import { QueueStatus, QueueTicket, RoomKey } from '../../features/receptionist/types';

const ROOM_FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'P101', label: 'Phòng 101' },
  { key: 'P102', label: 'Phòng 102' },
] as const;

type RoomFilter = (typeof ROOM_FILTERS)[number]['key'];

const ACTIVE_DOCTORS = ['BS. Phan Minh Hưng', 'BS. Nguyễn Lan Anh', 'BS. Lê Quang', 'BS. Trần Thu Hà'];

const ROOM_META: Record<RoomKey, string> = { P101: 'Nội khoa', P102: 'Sản khoa' };

const STATUS_LABEL: Record<QueueStatus, { label: string; variant: 'gray' | 'success' | 'danger' }> = {
  waiting: { label: 'Đang chờ', variant: 'gray' },
  'in-progress': { label: 'Đang khám', variant: 'success' },
  skipped: { label: 'Bỏ qua', variant: 'danger' },
  done: { label: 'Hoàn thành', variant: 'success' },
};

const PAGE_SIZE = 4;

interface ManualForm {
  name: string;
  code: string;
  doctor: string;
  roomKey: RoomKey;
}

const ReceptionistQueuePage: React.FC = () => {
  const [roomFilter, setRoomFilter] = useState<RoomFilter>('all');
  const { data, isLoading, isError } = useQueue(roomFilter);
  const callNext = useCallNext();
  const updateTicket = useUpdateQueueTicket();
  const manualAdd = useManualAddQueue();

  const [sortBy, setSortBy] = useState<'ticket' | 'wait'>('ticket');
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [nowServingId, setNowServingId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [page, setPage] = useState(1);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualForm, setManualForm] = useState<ManualForm>({ name: '', code: '', doctor: ACTIVE_DOCTORS[0], roomKey: 'P101' });
  const [manualError, setManualError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const tickets = useMemo(() => data?.tickets ?? [], [data]);
  const completedCount = data?.completedCount ?? 0;

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const nowServing = useMemo(() => {
    const inProgress = tickets.filter((t) => t.status === 'in-progress');
    if (nowServingId) {
      const found = inProgress.find((t) => t.id === nowServingId);
      if (found) return found;
    }
    return (
      [...inProgress].sort(
        (a, b) => new Date(b.calledAt ?? 0).getTime() - new Date(a.calledAt ?? 0).getTime(),
      )[0] ?? null
    );
  }, [tickets, nowServingId]);

  const waitingCount = useMemo(() => tickets.filter((t) => t.status === 'waiting').length, [tickets]);

  const nextWaiting = useMemo(() => {
    const waiting = tickets.filter((t) => t.status === 'waiting');
    if (waiting.length === 0) return null;
    return [...waiting].sort((a, b) => a.ticket - b.ticket)[0];
  }, [tickets]);

  const sorted = useMemo(
    () =>
      [...tickets].sort((a, b) =>
        sortBy === 'ticket' ? a.ticket - b.ticket : b.waitMinutes - a.waitMinutes,
      ),
    [tickets, sortBy],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [roomFilter, sortBy]);

  const busy = callNext.isPending || updateTicket.isPending;

  const handleCallNext = () => {
    if (paused || !nextWaiting || busy) return;
    callNext.mutate(undefined, {
      onSuccess: (t) => {
        setNowServingId(t.id);
        setSelectedTicket(t.ticket);
        setToast(`Đang mời số ${t.ticket} - ${t.patientName}.`);
      },
      onError: () => setToast('Không thể gọi số. Vui lòng thử lại.'),
    });
  };

  const handleAction = (patient: QueueTicket, action: 'call' | 'recall' | 'skip' | 'complete', message: string) => {
    if (busy) return;
    updateTicket.mutate(
      { id: patient.id, action },
      {
        onSuccess: () => {
          if (action === 'call' || action === 'recall') {
            setNowServingId(patient.id);
            setSelectedTicket(patient.ticket);
          } else if (patient.id === nowServingId) {
            setNowServingId(null);
          }
          setToast(message);
        },
        onError: () => setToast('Thao tác thất bại. Vui lòng thử lại.'),
      },
    );
  };

  const handleAddManual = () => {
    if (!manualForm.name.trim()) {
      setManualError('Vui lòng nhập tên bệnh nhân.');
      return;
    }
    manualAdd.mutate(
      { patientName: manualForm.name.trim(), code: manualForm.code.trim() || undefined, doctor: manualForm.doctor, roomKey: manualForm.roomKey },
      {
        onSuccess: (t) => {
          setManualOpen(false);
          setManualForm({ name: '', code: '', doctor: ACTIVE_DOCTORS[0], roomKey: 'P101' });
          setManualError(null);
          setRoomFilter('all');
          setToast(`Đã thêm số ${t.ticket} - ${t.patientName} vào hàng chờ.`);
        },
        onError: () => setManualError('Không thể thêm. Vui lòng thử lại.'),
      },
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Page header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
            Quản lý hàng chờ
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Điều phối bệnh nhân tại Khoa Nội Tổng Quát - Tầng 2
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-slate-800">
            {ROOM_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setRoomFilter(key)}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  roomFilter === key
                    ? 'bg-white dark:bg-slate-700 text-[#1a56db] shadow-sm'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Button leftIcon={<UserPlus size={16} />} onClick={() => setManualOpen(true)}>
            Thêm thủ công
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left column */}
        <div className="space-y-4">
          {/* Now serving */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#1e40af] p-6 text-white shadow-lg">
            <Megaphone className="absolute top-5 right-5 opacity-20" size={56} />
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide">
              ĐANG GHI
            </span>
            {nowServing ? (
              <>
                <p className="mt-4 text-6xl font-bold leading-none" style={{ fontFamily: 'Lexend' }}>
                  {nowServing.ticket}
                </p>
                <p className="mt-3 text-lg font-medium text-blue-50">{nowServing.patientName}</p>

                <div className="mt-6 space-y-1.5 border-t border-white/20 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Phòng khám:</span>
                    <span className="font-semibold">{nowServing.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-100">Bác sĩ:</span>
                    <span className="font-semibold">{nowServing.doctor}</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction(nowServing, 'complete', `Hoàn thành khám cho số ${nowServing.ticket}.`)}
                    className="flex-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#1a56db] hover:bg-blue-50 transition-colors"
                  >
                    Hoàn thành
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(nowServing, 'skip', `Đã bỏ qua số ${nowServing.ticket}.`)}
                    className="flex-1 rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold text-white hover:bg-white/25 transition-colors"
                  >
                    Bỏ qua
                  </button>
                </div>
              </>
            ) : (
              <div className="py-10 text-center">
                <p className="text-2xl font-bold text-blue-50" style={{ fontFamily: 'Lexend' }}>
                  ---
                </p>
                <p className="mt-2 text-sm text-blue-100">Chưa gọi số nào. Nhấn “Ghi số tiếp theo”.</p>
              </div>
            )}
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card padding="sm">
              <p className="text-sm text-gray-500 dark:text-slate-400">Đang chờ</p>
              <p className="mt-1 text-3xl font-bold">{waitingCount}</p>
              <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp size={13} /> Trong hàng đợi
              </p>
            </Card>
            <Card padding="sm">
              <p className="text-sm text-gray-500 dark:text-slate-400">Đã hoàn thành</p>
              <p className="mt-1 text-3xl font-bold">{completedCount}</p>
              <p className="mt-2 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-slate-400">
                <Clock size={13} /> Hôm nay
              </p>
            </Card>
          </div>
        </div>

        {/* Right column — patient list */}
        <Card padding="none" className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-700">
            <h2 className="text-base font-semibold">Danh sách bệnh nhân</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'ticket' | 'wait')}
                className="rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent px-2.5 py-1.5 text-sm font-medium text-[#1a56db] focus:outline-none focus:ring-2 focus:ring-[#1a56db]/30"
              >
                <option value="ticket">Theo số thứ tự</option>
                <option value="wait">Theo thời gian chờ</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : isError ? (
            <div className="px-5 py-12 text-center text-sm text-red-500">Không tải được hàng chờ.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    <th className="px-5 py-3">STT</th>
                    <th className="px-3 py-3">Bệnh nhân</th>
                    <th className="px-3 py-3">Bác sĩ / Phòng</th>
                    <th className="px-3 py-3">Thời gian</th>
                    <th className="px-3 py-3">Trạng thái</th>
                    <th className="px-3 py-3 text-right pr-5">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                        Không có bệnh nhân trong hàng chờ.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((patient) => {
                      const isSelected = patient.ticket === selectedTicket;
                      const isSkipped = patient.status === 'skipped';
                      const isInProgress = patient.status === 'in-progress';
                      return (
                        <tr
                          key={patient.id}
                          onClick={() => setSelectedTicket(patient.ticket)}
                          className={`cursor-pointer transition-colors ${
                            isInProgress
                              ? 'bg-emerald-50/80 dark:bg-emerald-950/20'
                              : isSelected
                              ? 'bg-blue-50/60 dark:bg-blue-950/20'
                              : 'hover:bg-gray-50 dark:hover:bg-slate-700/40'
                          }`}
                        >
                          <td className="px-5 py-4 align-top">
                            <div className="flex items-center gap-2">
                              {patient.status === 'waiting' && <span className="h-2 w-2 rounded-full bg-red-500" />}
                              <span className={`font-semibold ${isSkipped ? 'text-gray-400' : 'text-[#1a56db]'}`}>
                                {patient.ticket}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-4 align-top">
                            <p className={`font-medium ${isSkipped ? 'text-gray-400 line-through' : ''}`}>
                              {patient.patientName}
                            </p>
                            {patient.code && <p className="text-xs text-gray-400">{patient.code}</p>}
                          </td>
                          <td className="px-3 py-4 align-top">
                            <p className={isSkipped ? 'text-gray-400' : ''}>{patient.doctor}</p>
                            {patient.room && (
                              <p className="text-xs text-gray-400">
                                {patient.room} {patient.department && `(${patient.department})`}
                              </p>
                            )}
                          </td>
                          <td className="px-3 py-4 align-top">
                            <span className="flex items-center gap-1 text-gray-500 dark:text-slate-400">
                              <Clock size={14} /> {isSkipped ? '---' : `${patient.waitMinutes} phút`}
                            </span>
                          </td>
                          <td className="px-3 py-4 align-top">
                            {isInProgress ? (
                              <span className="inline-flex items-center rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-medium text-white">
                                Đang khám
                              </span>
                            ) : (
                              <Badge variant={STATUS_LABEL[patient.status].variant}>
                                {STATUS_LABEL[patient.status].label}
                              </Badge>
                            )}
                          </td>
                          <td className="px-3 py-4 align-top text-right pr-5">
                            {isSkipped ? (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleAction(patient, 'recall', `Gọi lại số ${patient.ticket}.`); }}
                                className="text-sm font-medium text-[#1a56db] hover:underline"
                              >
                                Gọi lại
                              </button>
                            ) : isInProgress ? (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleAction(patient, 'complete', `Hoàn thành khám cho số ${patient.ticket}.`); }}
                                className="text-sm font-medium text-emerald-600 hover:underline"
                              >
                                Hoàn thành
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleAction(patient, 'call', `Đang mời số ${patient.ticket} - ${patient.patientName}.`); }}
                                className="text-sm font-medium text-[#1a56db] hover:underline"
                              >
                                Gọi
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-gray-100 dark:border-slate-700">
            <p className="text-xs text-gray-400">
              Hiển thị {paginated.length} của {sorted.length} bệnh nhân
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
                      : 'border border-gray-200 dark:border-slate-600 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Trang sau"
              >
                ›
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom action bar */}
      <Card className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {ACTIVE_DOCTORS.slice(0, 2).map((doctor) => (
              <Avatar key={doctor} name={doctor} size="sm" className="ring-2 ring-white dark:ring-slate-800" />
            ))}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a56db] text-xs font-semibold text-white ring-2 ring-white dark:ring-slate-800">
              +4
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">6 Bác sĩ đang hoạt động</p>
            <p className="flex items-center gap-1.5 text-xs text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{' '}
              {paused ? 'Đã tạm dừng gọi số' : 'Ổn định'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            leftIcon={paused ? <Play size={16} /> : <Pause size={16} />}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? 'Tiếp tục gọi' : 'Tạm dừng gọi'}
          </Button>
          <Button
            leftIcon={<Volume2 size={16} />}
            loading={callNext.isPending}
            disabled={paused || !nextWaiting}
            onClick={handleCallNext}
          >
            {nextWaiting ? `GHI SỐ TIẾP THEO (${nextWaiting.ticket})` : 'HẾT SỐ CHỜ'}
          </Button>
        </div>
      </Card>

      {/* Add manual modal */}
      <Modal
        open={manualOpen}
        onClose={() => { setManualOpen(false); setManualError(null); }}
        title="Thêm bệnh nhân thủ công"
        description="Cấp số thứ tự và đưa vào hàng chờ."
        footer={
          <>
            <Button variant="ghost" onClick={() => { setManualOpen(false); setManualError(null); }}>
              Hủy
            </Button>
            <Button onClick={handleAddManual} loading={manualAdd.isPending} leftIcon={<UserPlus size={16} />}>
              Thêm vào hàng chờ
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
              value={manualForm.name}
              onChange={(e) => setManualForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="VD: Nguyễn Văn A"
              className={`w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm outline-none ${
                manualError ? 'border-red-400' : 'border-gray-200 dark:border-slate-600 focus:border-[#1a56db]'
              }`}
            />
            {manualError && <span className="mt-1 block text-xs text-red-500">{manualError}</span>}
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">Mã bệnh nhân</span>
            <input
              type="text"
              value={manualForm.code}
              onChange={(e) => setManualForm((f) => ({ ...f, code: e.target.value }))}
              placeholder="Để trống sẽ tự sinh mã"
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">Bác sĩ</span>
            <select
              value={manualForm.doctor}
              onChange={(e) => setManualForm((f) => ({ ...f, doctor: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
            >
              {ACTIVE_DOCTORS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-slate-300">Phòng</span>
            <select
              value={manualForm.roomKey}
              onChange={(e) => setManualForm((f) => ({ ...f, roomKey: e.target.value as RoomKey }))}
              className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#1a56db]"
            >
              <option value="P101">Phòng 101 ({ROOM_META.P101})</option>
              <option value="P102">Phòng 102 ({ROOM_META.P102})</option>
            </select>
          </label>
        </div>
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

export default ReceptionistQueuePage;
