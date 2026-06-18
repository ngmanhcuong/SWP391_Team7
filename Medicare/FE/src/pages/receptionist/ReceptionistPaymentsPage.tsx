import React from 'react';
import {
  Banknote,
  Clock,
  Copy,
  Download,
  Eye,
  FilterX,
  LucideIcon,
  Plus,
  Printer,
  ReceiptText,
  XCircle,
} from 'lucide-react';
import { Avatar, Card } from '../../components/ui';
import Button from '../../components/ui/Button';

interface StatCard {
  label: string;
  value: string;
  badge: string;
  badgeTone: 'green' | 'gray' | 'red';
  icon: LucideIcon;
  iconTone: string;
}

const STATS: StatCard[] = [
  {
    label: 'Tổng doanh thu (tháng)',
    value: '1.250.000.000đ',
    badge: '+12.5%',
    badgeTone: 'green',
    icon: Banknote,
    iconTone: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40',
  },
  {
    label: 'Hóa đơn đã thanh toán',
    value: '98.2%',
    badge: '342 HĐ',
    badgeTone: 'gray',
    icon: ReceiptText,
    iconTone: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40',
  },
  {
    label: 'Giao dịch đã hủy',
    value: '15.400.000đ',
    badge: '5 HĐ',
    badgeTone: 'gray',
    icon: XCircle,
    iconTone: 'bg-red-100 text-red-600 dark:bg-red-950/40',
  },
  {
    label: 'Chờ thanh toán',
    value: '42.800.000đ',
    badge: '12 HĐ',
    badgeTone: 'gray',
    icon: Clock,
    iconTone: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40',
  },
];

const BADGE_TONE: Record<StatCard['badgeTone'], string> = {
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40',
  gray: 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-300',
  red: 'bg-red-100 text-red-600 dark:bg-red-950/40',
};

type InvoiceStatus = 'paid' | 'cancelled';

interface Invoice {
  code: string;
  name: string;
  patientCode: string;
  date: string;
  time: string;
  method: string;
  amount: string;
