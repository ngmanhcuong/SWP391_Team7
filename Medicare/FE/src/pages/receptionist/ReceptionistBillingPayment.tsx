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
  { id: 'HD2024052301', name: 'Trần Văn Hoàng', department: 'Khoa Nội', amount: '1,250,000đ', updatedAt: 'Vừa cập nhật 2 phút trước', urgent: true },
  { id: 'HD2024052302', name: 'Nguyễn Thị Mai', department: 'Khoa Nhi', amount: '850,000đ', updatedAt: '15 phút trước' },
  { id: 'HD2024052303', name: 'Lê Minh Quân', department: 'Khoa Ngoại', amount: '3,420,000đ', updatedAt: '30 phút trước' },
  { id: 'HD2024052304', name: 'Phạm Tuyết Nhung', department: 'Khoa Sản', amount: '560,000đ', updatedAt: '45 phút trước' },
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
                  <span className="font-medium text-gray-700 dark:text-slate-200">1,500,000đ</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-slate-400">
                  <span>BHYT giảm trừ:</span>
                  <span className="font-medium text-emerald-600">- 250,000đ</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-slate-400">
                  <span>Tiền đặt cọc (Khấu trừ):</span>
                  <span className="font-medium text-emerald-600">- 100,000đ</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 dark:border-slate-700 pt-2 text-base">
                  <span className="font-semibold">Tổng tiền:</span>
                  <span className="font-bold text-[#1a56db]">1,150,000đ</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment method */}
          <Card>
            <h2 className="text-base font-semibold mb-4">Phương thức thanh toán</h2>
            <div className="grid grid-cols-3 gap-3">
              {METHODS.map(({ id, label, icon: Icon }) => {
                const active = method === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMethod(id)}
                    className={`relative flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 transition-colors ${
                      active
                        ? 'border-[#1a56db] bg-blue-50/60 dark:bg-blue-950/20'
                        : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute right-2 top-2 h-3.5 w-3.5 rounded-full border ${
                        active ? 'border-[#1a56db] bg-[#1a56db]' : 'border-gray-300'
                      }`}
                    />
                    <Icon size={24} className={active ? 'text-[#1a56db]' : 'text-gray-500'} />
                    <span className={`text-sm font-medium ${active ? 'text-[#1a56db]' : ''}`}>{label}</span>
                  </button>
                );
              })}
            </div>

            {method === 'qr' && (
              <div className="mt-4 flex gap-4 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 p-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600">
                  <QrCode size={56} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold">Quét mã VietQR</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    Mã QR này chứa thông tin số tiền và nội dung chuyển khoản tự động.
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="rounded-md bg-emerald-100 px-2 py-1 font-semibold text-emerald-700 dark:bg-emerald-950/40">VietinBank</span>
                    <span className="text-gray-500 dark:text-slate-400">STK: 1028374921</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e293b] px-5 py-3.5 font-semibold text-white transition-colors hover:bg-[#0f172a]"
            >
              <CheckCircle2 size={18} /> Xác nhận thanh toán (1,150,000đ)
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistBillingPayment;
