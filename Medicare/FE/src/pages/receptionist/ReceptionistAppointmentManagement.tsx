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
