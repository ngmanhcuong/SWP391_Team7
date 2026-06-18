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
