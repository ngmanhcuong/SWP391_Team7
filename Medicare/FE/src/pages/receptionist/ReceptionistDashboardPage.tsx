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
