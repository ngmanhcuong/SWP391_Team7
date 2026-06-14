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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003d9b]/5 via-white to-[#82f9be]/5 border border-[#c3c6d6]/60 p-6 sm:p-8 shadow-sm">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#003d9b]/5 blur-2xl" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#003d9b]">
            Thanh toán
          </h1>
          <p className="text-base text-[#434654] max-w-xl">
            Quản lý hóa đơn sau khám. Tiền cọc khi đặt lịch sẽ được trừ vào tổng chi phí cuối cùng.
          </p>
        </div>
        {totalUnpaid > 0 && (
          <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-gradient-to-r from-[#fff8e6] to-amber-50 px-5 py-3.5 text-sm font-medium text-[#7a4f01] shrink-0 shadow-sm">
            <Receipt size={18} className="text-amber-600" />
            Còn {formatCurrencyVnd(totalUnpaid)} cần thanh toán
          </div>
        )}
      </div>
    </div>

    <div className="relative max-w-xl">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685]" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Tìm theo mã hóa đơn, bác sĩ, chuyên khoa..."
        className="w-full rounded-full border border-[#c3c6d6] bg-[#f8f9fb] py-3 pl-11 pr-4 text-base text-[#191c1e] placeholder:text-[#737685] outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
      />
    </div>
  </header>
);

export default PaymentsPageHeader;
