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
