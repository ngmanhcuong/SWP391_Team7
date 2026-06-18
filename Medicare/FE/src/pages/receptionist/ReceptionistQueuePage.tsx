import React, { useMemo, useState } from 'react';
import {
  Clock,
  Megaphone,
  Pause,
  TrendingUp,
  UserPlus,
  Volume2,
} from 'lucide-react';
import { Avatar, Badge, Card } from '../../components/ui';
import Button from '../../components/ui/Button';

type QueueStatus = 'waiting' | 'in-progress' | 'skipped';

interface QueuePatient {
  ticket: number;
  name: string;
  code: string;
  doctor: string;
  room: string;
  department: string;
  waitTime: string;
  status: QueueStatus;
  roomKey: 'P101' | 'P102';
}

const ROOM_FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'P101', label: 'Phòng 101' },
  { key: 'P102', label: 'Phòng 102' },
] as const;

type RoomFilter = (typeof ROOM_FILTERS)[number]['key'];

const NOW_SERVING = {
  ticket: 1024,
  name: 'Lê Hoàng Nam',
  room: 'Nội 01 - P.204',
  doctor: 'BS. Phan Minh Hưng',
};

const QUEUE: QueuePatient[] = [
  {
    ticket: 1025,
    name: 'Trần Văn Tú',
    code: 'BN-2024-0582',
    doctor: 'BS. Nguyễn Lan Anh',
    room: 'P.205',
    department: 'Sản khoa',
    waitTime: '22 phút',
    status: 'waiting',
    roomKey: 'P101',
  },
  {
    ticket: 1023,
    name: 'Phạm Thúy Hạnh',
    code: 'BN-2024-0911',
    doctor: 'BS. Lê Quang',
    room: 'P.108',
    department: 'Ngoại khoa',
    waitTime: '12 phút',
    status: 'in-progress',
    roomKey: 'P102',
  },
  {
    ticket: 1026,
    name: 'Hoàng Anh Quân',
    code: 'BN-2024-1102',
    doctor: 'BS. Phan Minh Hưng',
    room: 'P.204',
    department: 'Nội khoa',
    waitTime: '8 phút',
    status: 'waiting',
    roomKey: 'P101',
  },
  {
    ticket: 1027,
    name: 'Vũ Thị Mỹ Linh',
    code: 'BN-2024-1244',
    doctor: 'BS. Nguyễn Lan Anh',
    room: 'P.205',
    department: 'Sản khoa',
    waitTime: '5 phút',
    status: 'waiting',
    roomKey: 'P102',
  },
  {
    ticket: 1022,
    name: 'Đỗ Duy Mạnh',
    code: '',
    doctor: 'BS. Lê Quang',
    room: '',
    department: '',
    waitTime: '---',
    status: 'skipped',
    roomKey: 'P102',
  },
];

const STATUS_LABEL: Record<QueueStatus, { label: string; variant: 'gray' | 'success' | 'danger' }> = {
  waiting: { label: 'Đang chờ', variant: 'gray' },
  'in-progress': { label: 'Đang khám', variant: 'success' },
  skipped: { label: 'Bỏ qua', variant: 'danger' },
};

const ACTIVE_DOCTORS = [
  'BS. Phan Minh Hưng',
  'BS. Nguyễn Lan Anh',
  'BS. Lê Quang',
  'BS. Trần Thu Hà',
];

const ReceptionistQueuePage: React.FC = () => {
  const [roomFilter, setRoomFilter] = useState<RoomFilter>('all');
  const [selectedTicket, setSelectedTicket] = useState<number>(1023);

  const filteredQueue = useMemo(
    () => (roomFilter === 'all' ? QUEUE : QUEUE.filter((p) => p.roomKey === roomFilter)),
    [roomFilter],
  );

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
          <Button leftIcon={<UserPlus size={16} />}>Thêm thủ công</Button>
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
            <p className="mt-4 text-6xl font-bold leading-none" style={{ fontFamily: 'Lexend' }}>
              {NOW_SERVING.ticket}
            </p>
            <p className="mt-3 text-lg font-medium text-blue-50">{NOW_SERVING.name}</p>

            <div className="mt-6 space-y-1.5 border-t border-white/20 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-100">Phòng khám:</span>
                <span className="font-semibold">{NOW_SERVING.room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Bác sĩ:</span>
                <span className="font-semibold">{NOW_SERVING.doctor}</span>
              </div>
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card padding="sm">
              <p className="text-sm text-gray-500 dark:text-slate-400">Đang chờ</p>
              <p className="mt-1 text-3xl font-bold">12</p>
              <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp size={13} /> +2 BN mới
              </p>
            </Card>
            <Card padding="sm">
              <p className="text-sm text-gray-500 dark:text-slate-400">Đã hoàn thành</p>
              <p className="mt-1 text-3xl font-bold">48</p>
              <p className="mt-2 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-slate-400">
                <Clock size={13} /> TB 15p/ca
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
              <select className="rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent px-2.5 py-1.5 text-sm font-medium text-[#1a56db] focus:outline-none focus:ring-2 focus:ring-[#1a56db]/30">
                <option>Theo số thứ tự</option>
                <option>Theo thời gian chờ</option>
              </select>
            </div>
          </div>

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
                {filteredQueue.map((patient) => {
                  const isSelected = patient.ticket === selectedTicket;
                  const isSkipped = patient.status === 'skipped';
                  const isInProgress = patient.status === 'in-progress';
                  return (
                    <tr
                      key={patient.ticket}
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
                          {patient.status === 'waiting' && (
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                          )}
                          <span
                            className={`font-semibold ${
                              isSkipped ? 'text-gray-400' : 'text-[#1a56db]'
                            }`}
                          >
                            {patient.ticket}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 align-top">
                        <p
                          className={`font-medium ${
                            isSkipped ? 'text-gray-400 line-through' : ''
                          }`}
                        >
                          {patient.name}
                        </p>
                        {patient.code && (
                          <p className="text-xs text-gray-400">{patient.code}</p>
                        )}
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
                          <Clock size={14} /> {patient.waitTime}
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
                            className="text-sm font-medium text-[#1a56db] hover:underline"
                          >
                            Gọi lại
                          </button>
                        ) : patient.status === 'in-progress' ? (
                          <button
                            type="button"
                            className="text-sm font-medium text-emerald-600 hover:underline"
                          >
                            Hoàn thành
                          </button>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-gray-100 dark:border-slate-700">
            <p className="text-xs text-gray-400">
              Hiển thị {filteredQueue.length} của 12 bệnh nhân đang chờ
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="h-8 w-8 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-400 hover:bg-gray-50 disabled:opacity-50"
                aria-label="Trang trước"
              >
                ‹
              </button>
              <button
                type="button"
                className="h-8 w-8 rounded-lg bg-[#1a56db] text-sm font-medium text-white"
              >
                1
              </button>
              <button
                type="button"
                className="h-8 w-8 rounded-lg border border-gray-200 dark:border-slate-600 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                2
              </button>
              <button
                type="button"
                className="h-8 w-8 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-400 hover:bg-gray-50"
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
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ổn định
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Pause size={16} />}>
            Tạm dừng gọi
          </Button>
          <Button leftIcon={<Volume2 size={16} />}>GHI SỐ TIẾP THEO (1025)</Button>
        </div>
      </Card>
    </div>
  );
};

export default ReceptionistQueuePage;
