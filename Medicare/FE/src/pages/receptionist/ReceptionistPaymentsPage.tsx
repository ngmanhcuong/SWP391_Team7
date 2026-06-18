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
  status: InvoiceStatus;
}

const INVOICES: Invoice[] = [
  {
    code: '#HĐ-00921',
    name: 'Trần Anh Tú',
    patientCode: 'BN-2023-081',
    date: '14/10/2023',
    time: '09:15',
    method: 'Chuyển khoản',
    amount: '1.250.000đ',
    status: 'paid',
  },
  {
    code: '#HĐ-00920',
    name: 'Lê Hoàng Nam',
    patientCode: 'BN-2023-112',
    date: '14/10/2023',
    time: '08:30',
    method: '---',
    amount: '450.000đ',
    status: 'cancelled',
  },
  {
    code: '#HĐ-00919',
    name: 'Phạm Minh Anh',
    patientCode: 'BN-2023-045',
    date: '13/10/2023',
    time: '16:45',
    method: 'Tiền mặt',
    amount: '2.800.000đ',
    status: 'paid',
  },
];

const ReceptionistPaymentsPage: React.FC = () => (
  <div className="max-w-[1200px] mx-auto">
    {/* Header */}
    <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lexend' }}>
          Quản lý hóa đơn
        </h1>
        <p className="text-gray-500 dark:text-slate-400">
          Theo dõi lịch sử giao dịch và doanh thu bệnh viện
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" leftIcon={<Download size={16} />} className="border border-gray-200 dark:border-slate-600">
          Xuất báo cáo (CSV)
        </Button>
        <Button leftIcon={<Plus size={16} />}>Tạo hóa đơn mới</Button>
      </div>
    </div>

    {/* Stats */}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
      {STATS.map(({ label, value, badge, badgeTone, icon: Icon, iconTone }) => (
        <Card key={label}>
          <div className="flex items-start justify-between">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconTone}`}>
              <Icon size={20} />
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${BADGE_TONE[badgeTone]}`}>
              {badge}
            </span>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </Card>
      ))}
    </div>

    {/* Filters */}
    <Card className="mb-6">
