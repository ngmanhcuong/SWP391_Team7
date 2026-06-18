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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-slate-400">Thời gian</span>
          <input
            type="date"
            className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
          />
        </label>
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-slate-400">Phương thức</span>
          <select className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2 text-sm outline-none focus:border-[#1a56db]">
            <option>Tất cả</option>
            <option>Tiền mặt</option>
            <option>Chuyển khoản</option>
          </select>
        </label>
        <label className="flex-1">
          <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-slate-400">Trạng thái</span>
          <select className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-transparent px-3 py-2 text-sm outline-none focus:border-[#1a56db]">
            <option>Tất cả</option>
            <option>Đã thanh toán</option>
            <option>Đã hủy</option>
            <option>Chờ thanh toán</option>
          </select>
        </label>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 hover:text-[#1a56db] transition-colors"
        >
          <FilterX size={16} /> Xóa bộ lọc
        </button>
      </div>
    </Card>

    {/* Table */}
    <Card padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-100 dark:border-slate-700">
              <th className="px-5 py-3">Mã hóa đơn</th>
              <th className="px-3 py-3">Bệnh nhân</th>
              <th className="px-3 py-3">Ngày thanh toán</th>
              <th className="px-3 py-3">Phương thức</th>
              <th className="px-3 py-3">Tổng tiền</th>
              <th className="px-3 py-3">Trạng thái</th>
              <th className="px-3 py-3 text-right pr-5">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {INVOICES.map((inv) => {
              const cancelled = inv.status === 'cancelled';
              return (
                <tr key={inv.code} className="hover:bg-gray-50 dark:hover:bg-slate-700/40">
                  <td className="px-5 py-4 font-semibold text-[#1a56db]">{inv.code}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={inv.name} size="sm" />
                      <div>
                        <p className="font-medium">{inv.name}</p>
                        <p className="text-xs text-gray-400">{inv.patientCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-gray-500 dark:text-slate-400">
                    {inv.date}
                    <br />
                    <span className="text-xs">{inv.time}</span>
                  </td>
                  <td className="px-3 py-4 text-gray-500 dark:text-slate-400">{inv.method}</td>
                  <td className="px-3 py-4 font-semibold">{inv.amount}</td>
                  <td className="px-3 py-4">
                    {cancelled ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-600 dark:bg-red-950/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Đã hủy
                      </span>
                    ) : (
