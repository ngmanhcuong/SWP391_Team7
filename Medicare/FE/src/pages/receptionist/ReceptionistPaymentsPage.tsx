import React, { useMemo, useState } from 'react';
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
import {
  RECEPTIONIST_INVOICE_RECORDS,
  ReceptionistInvoiceMethod,
  ReceptionistInvoiceStatus,
} from '../../features/receptionist/constants';

interface StatCard {
  label: string;
  value: string;
  badge: string;
  badgeTone: 'green' | 'gray' | 'red' | 'amber';
  icon: LucideIcon;
  iconTone: string;
}

const ITEMS_PER_PAGE = 5;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

const BADGE_TONE: Record<StatCard['badgeTone'], string> = {
  green: 'bg-emerald-100 text-emerald-700',
  gray: 'bg-gray-100 text-gray-500',
  red: 'bg-red-100 text-red-600',
  amber: 'bg-amber-100 text-amber-700',
};

const STATUS_META: Record<
  ReceptionistInvoiceStatus,
  { label: string; className: string; actionDisabled?: boolean }
> = {
  paid: {
    label: 'Đã thanh toán',
    className: 'bg-emerald-500 text-white',
  },
  cancelled: {
    label: 'Đã hủy',
    className: 'bg-red-100 text-red-600',
    actionDisabled: true,
  },
  pending: {
    label: 'Chờ thanh toán',
    className: 'bg-amber-100 text-amber-700',
  },
};

const ReceptionistPaymentsPage: React.FC = () => {
  const [dateFilter, setDateFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState<'Tất cả' | ReceptionistInvoiceMethod>('Tất cả');
  const [statusFilter, setStatusFilter] = useState<
    'Tất cả' | 'Đã thanh toán' | 'Đã hủy' | 'Chờ thanh toán'
  >('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredInvoices = useMemo(() => {
    return RECEPTIONIST_INVOICE_RECORDS.filter((invoice) => {
      const matchesDate = !dateFilter
        ? true
        : (() => {
            const [day, month, year] = invoice.date.split('/');
            return `${year}-${month}-${day}` === dateFilter;
          })();

      const matchesMethod = methodFilter === 'Tất cả' || invoice.method === methodFilter;
      const matchesStatus =
        statusFilter === 'Tất cả' || STATUS_META[invoice.status].label === statusFilter;

      return matchesDate && matchesMethod && matchesStatus;
    });
  }, [dateFilter, methodFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedInvoices = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredInvoices.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredInvoices, safeCurrentPage]);

  const stats = useMemo<StatCard[]>(() => {
    const totalRevenue = RECEPTIONIST_INVOICE_RECORDS.filter((invoice) => invoice.status === 'paid').reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );
    const paidInvoices = RECEPTIONIST_INVOICE_RECORDS.filter((invoice) => invoice.status === 'paid');
    const cancelledInvoices = RECEPTIONIST_INVOICE_RECORDS.filter((invoice) => invoice.status === 'cancelled');
    const pendingInvoices = RECEPTIONIST_INVOICE_RECORDS.filter((invoice) => invoice.status === 'pending');
    const paidRate = RECEPTIONIST_INVOICE_RECORDS.length
      ? (paidInvoices.length / RECEPTIONIST_INVOICE_RECORDS.length) * 100
      : 0;

    return [
      {
        label: 'Tổng doanh thu thực thu',
        value: formatCurrency(totalRevenue),
        badge: `${paidInvoices.length} HĐ`,
        badgeTone: 'green',
        icon: Banknote,
        iconTone: 'bg-blue-100 text-blue-600',
      },
      {
        label: 'Hóa đơn đã thanh toán',
        value: `${paidRate.toFixed(1)}%`,
        badge: `${paidInvoices.length} HĐ`,
        badgeTone: 'gray',
        icon: ReceiptText,
        iconTone: 'bg-emerald-100 text-emerald-600',
      },
      {
        label: 'Giao dịch đã hủy',
        value: formatCurrency(
          cancelledInvoices.reduce((sum, invoice) => sum + invoice.amount, 0),
        ),
        badge: `${cancelledInvoices.length} HĐ`,
        badgeTone: 'red',
        icon: XCircle,
        iconTone: 'bg-red-100 text-red-600',
      },
      {
        label: 'Chờ thanh toán',
        value: formatCurrency(pendingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)),
        badge: `${pendingInvoices.length} HĐ`,
        badgeTone: 'amber',
        icon: Clock,
        iconTone: 'bg-amber-100 text-amber-600',
      },
    ];
  }, []);

  const resetFilters = () => {
    setDateFilter('');
    setMethodFilter('Tất cả');
    setStatusFilter('Tất cả');
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold" style={{ fontFamily: 'Lexend' }}>
            Quản lý hóa đơn
          </h1>
          <p className="text-gray-500">Theo dõi lịch sử giao dịch và doanh thu bệnh viện</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            leftIcon={<Download size={16} />}
            className="border border-gray-200"
          >
            Xuất báo cáo (CSV)
          </Button>
          <Button leftIcon={<Plus size={16} />}>Tạo hóa đơn mới</Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, badge, badgeTone, icon: Icon, iconTone }) => (
          <Card key={label}>
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconTone}`}>
                <Icon size={20} />
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${BADGE_TONE[badgeTone]}`}
              >
                {badge}
              </span>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="flex-1">
            <span className="mb-1 block text-xs font-medium text-gray-500">Thời gian</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => {
                setDateFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
            />
          </label>
          <label className="flex-1">
            <span className="mb-1 block text-xs font-medium text-gray-500">Phương thức</span>
            <select
              value={methodFilter}
              onChange={(event) => {
                setMethodFilter(event.target.value as typeof methodFilter);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
            >
              <option>Tất cả</option>
              <option>Tiền mặt</option>
              <option>Chuyển khoản BIDV</option>
              <option>MoMo QR</option>
            </select>
          </label>
          <label className="flex-1">
            <span className="mb-1 block text-xs font-medium text-gray-500">Trạng thái</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as typeof statusFilter);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-[#1a56db]"
            >
              <option>Tất cả</option>
              <option>Đã thanh toán</option>
              <option>Đã hủy</option>
              <option>Chờ thanh toán</option>
            </select>
          </label>
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#1a56db]"
          >
            <FilterX size={16} /> Xóa bộ lọc
          </button>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-5 py-3">Mã hóa đơn</th>
                <th className="px-3 py-3">Bệnh nhân</th>
                <th className="px-3 py-3">Ngày thanh toán</th>
                <th className="px-3 py-3">Phương thức</th>
                <th className="px-3 py-3">Tổng tiền</th>
                <th className="px-3 py-3">Trạng thái</th>
                <th className="px-3 py-3 text-right pr-5">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((invoice) => {
                  const meta = STATUS_META[invoice.status];
                  return (
                    <tr key={invoice.code} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-semibold text-[#1a56db]">{invoice.code}</td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={invoice.name} size="sm" />
                          <div>
                            <p className="font-medium">{invoice.name}</p>
                            <p className="text-xs text-gray-400">{invoice.patientId}</p>
                            <p className="text-xs text-gray-400">
                              {invoice.department} · {invoice.doctor}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-gray-500">
                        {invoice.date}
                        <br />
                        <span className="text-xs">{invoice.time}</span>
                      </td>
                      <td className="px-3 py-4 text-gray-500">{invoice.method}</td>
                      <td className="px-3 py-4 font-semibold">{formatCurrency(invoice.amount)}</td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              invoice.status === 'paid'
                                ? 'bg-white'
                                : invoice.status === 'cancelled'
                                  ? 'bg-red-500'
                                  : 'bg-amber-500'
                            }`}
                          />
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-3 py-4 pr-5">
                        <div
                          className={`flex items-center justify-end gap-3 ${
                            meta.actionDisabled ? 'text-gray-300' : 'text-gray-400'
                          }`}
                        >
                          <button type="button" className="hover:text-[#1a56db]" aria-label="Xem">
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            className={meta.actionDisabled ? 'cursor-not-allowed' : 'hover:text-[#1a56db]'}
                            aria-label="In"
                            disabled={meta.actionDisabled}
                          >
                            <Printer size={16} />
                          </button>
                          <button
                            type="button"
                            className={meta.actionDisabled ? 'cursor-not-allowed' : 'hover:text-[#1a56db]'}
                            aria-label="Sao chép"
                            disabled={meta.actionDisabled}
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-500">
                    Không có hóa đơn phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-3">
          <p className="text-xs text-gray-400">
            Hiển thị {filteredInvoices.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
            {' - '}
            {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredInvoices.length)} của {filteredInvoices.length} hóa đơn
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="h-8 w-8 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50"
              aria-label="Trang trước"
            >
              ‹
            </button>
            {visiblePages.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`h-8 min-w-8 rounded-lg px-2 text-sm font-medium ${
                  page === safeCurrentPage
                    ? 'bg-[#1a56db] text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="h-8 w-8 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50"
              aria-label="Trang sau"
            >
              ›
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReceptionistPaymentsPage;
