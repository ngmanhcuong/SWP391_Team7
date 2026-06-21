import React from 'react';
import { Receipt, Search } from 'lucide-react';
import { formatCurrencyVnd } from '../constants/consultationFees';

interface PaymentsPageHeaderProps {
  totalUnpaid: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const PaymentsPageHeader: React.FC<PaymentsPageHeaderProps> = ({
  totalUnpaid,
  searchQuery,
  onSearchChange,
}) => (
  <header className="space-y-5">
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#06b6d4] p-6 sm:p-8 shadow-soft-lg">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-white/15 blur-3xl" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
            Thanh toán
          </h1>
          <p className="text-base text-blue-50/90 max-w-xl">
            Quản lý hóa đơn sau khám. Tiền cọc khi đặt lịch sẽ được trừ vào tổng chi phí cuối cùng.
          </p>
        </div>
        {totalUnpaid > 0 && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-amber-700 shrink-0 shadow-lg shadow-blue-900/20">
            <Receipt size={18} className="text-amber-500" />
            Còn {formatCurrencyVnd(totalUnpaid)} cần thanh toán
          </div>
        )}
      </div>
    </div>

    <div className="relative max-w-xl">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Tìm theo mã hóa đơn, bác sĩ, chuyên khoa..."
        className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-colors"
      />
    </div>
  </header>
);

export default PaymentsPageHeader;
