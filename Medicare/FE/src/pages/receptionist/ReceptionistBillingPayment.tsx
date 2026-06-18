import React, { useState } from 'react';
import {
  Banknote,
  CheckCircle2,
  Landmark,
  ListFilter,
  LucideIcon,
  QrCode,
} from 'lucide-react';
import { Card } from '../../components/ui';

interface PendingInvoice {
  id: string;
  name: string;
  department: string;
  amount: string;
  updatedAt: string;
  urgent?: boolean;
}

const PENDING_INVOICES: PendingInvoice[] = [
  { id: 'HD2024052301', name: 'Trần Văn Hoàng', department: 'Khoa Nội tổng quát', amount: '1,250,000đ', updatedAt: 'Vừa cập nhật 2 phút trước', urgent: true },
  { id: 'HD2024052302', name: 'Nguyễn Thị Mai', department: 'Khoa Nhi', amount: '850,000đ', updatedAt: '15 phút trước' },
  { id: 'HD2024052303', name: 'Lê Minh Quân', department: 'Phòng Cấp cứu', amount: '3,420,000đ', updatedAt: '30 phút trước' },
  { id: 'HD2024052304', name: 'Phạm Tuyết Nhung', department: 'Khoa Da liễu', amount: '560,000đ', updatedAt: '45 phút trước' },
];

interface ServiceLine {
  service: string;
  qty: string;
  unit: string;
  total: string;
}

const SERVICES: ServiceLine[] = [
  { service: 'Phí khám nội tổng quát', qty: '1', unit: '200,000đ', total: '200,000đ' },
  { service: 'Xét nghiệm máu (CBC)', qty: '1', unit: '450,000đ', total: '450,000đ' },
  { service: 'Siêu âm bụng', qty: '1', unit: '600,000đ', total: '600,000đ' },
  { service: 'Thuốc điều trị (Kê đơn)', qty: '--', unit: '250,000đ', total: '250,000đ' },
];

type Method = 'cash' | 'transfer' | 'qr';

const METHODS: { id: Method; label: string; icon: LucideIcon }[] = [
  { id: 'cash', label: 'Tiền mặt', icon: Banknote },
  { id: 'transfer', label: 'Chuyển khoản', icon: Landmark },
  { id: 'qr', label: 'QR Banking', icon: QrCode },
];

const ReceptionistBillingPayment: React.FC = () => {
  const [selectedId, setSelectedId] = useState(PENDING_INVOICES[0].id);
  const [method, setMethod] = useState<Method>('qr');

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#1a56db]" style={{ fontFamily: 'Lexend' }}>
        Thanh toán viện phí
      </h1>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left: pending list */}
        <Card padding="none" className="overflow-hidden h-fit">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700">
            <p className="text-sm font-semibold">Chờ thanh toán ({PENDING_INVOICES.length})</p>
            <button type="button" className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#1a56db]">
              <ListFilter size={14} /> Lọc
            </button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {PENDING_INVOICES.map((inv) => {
              const active = inv.id === selectedId;
              return (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => setSelectedId(inv.id)}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    active
                      ? 'bg-blue-50/70 dark:bg-blue-950/20 border-l-4 border-[#1a56db]'
                      : 'border-l-4 border-transparent hover:bg-gray-50 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-gray-400">{inv.id}</span>
                    {inv.urgent && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:bg-red-950/40">
                        Khẩn
                      </span>
                    )}
                  </div>
                  <p className={`mt-0.5 font-semibold ${active ? 'text-[#1a56db]' : ''}`}>{inv.name}</p>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500 dark:text-slate-400">{inv.department}</span>
                    <span className="text-sm font-bold">{inv.amount}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] italic text-gray-400">{inv.updatedAt}</p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Right: detail */}
        <div className="space-y-6">
          {/* Patient info */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Thông tin bệnh nhân</h2>
              <span className="text-sm font-semibold text-[#1a56db]">{selectedId}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">Họ và tên</p>
                <p className="mt-1 font-medium">Trần Văn Hoàng</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">Mã BN</p>
                <p className="mt-1 font-medium">BN-99283</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">Ngày sinh</p>
                <p className="mt-1 font-medium">15/08/1985</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">Bảo hiểm</p>
                <p className="mt-1 font-medium text-emerald-600">Có (80%)</p>
              </div>
            </div>
          </Card>

          {/* Bill details */}
          <Card>
            <h2 className="text-base font-semibold mb-4">Chi tiết viện phí</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-100 dark:border-slate-700">
                    <th className="py-2">Dịch vụ</th>
                    <th className="py-2 text-center">Số lượng</th>
                    <th className="py-2 text-right">Đơn giá</th>
                    <th className="py-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {SERVICES.map((line) => (
                    <tr key={line.service}>
                      <td className="py-3">{line.service}</td>
                      <td className="py-3 text-center text-gray-500 dark:text-slate-400">{line.qty}</td>
                      <td className="py-3 text-right text-gray-500 dark:text-slate-400">{line.unit}</td>
                      <td className="py-3 text-right font-medium">{line.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between text-gray-500 dark:text-slate-400">
                  <span>Tạm tính:</span>
