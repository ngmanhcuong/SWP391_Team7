import React from 'react';
import { PaymentFilter } from '../types';

interface PaymentsFilterNavProps {
  activeFilter: PaymentFilter;
  onFilterChange: (filter: PaymentFilter) => void;
  counts: Record<PaymentFilter, number>;
}

const FILTERS: { id: PaymentFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'unpaid', label: 'Chưa thanh toán' },
  { id: 'awaiting_visit', label: 'Đã cọc · Chờ khám' },
  { id: 'paid', label: 'Đã thanh toán' },
];

const PaymentsFilterNav: React.FC<PaymentsFilterNavProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => (
  <div className="flex flex-wrap gap-2 p-1 bg-[#f8f9fb] border border-[#c3c6d6] rounded-lg">
    {FILTERS.map((filter) => {
      const isActive = activeFilter === filter.id;
      const count = counts[filter.id] ?? 0;

      return (
        <button
          key={filter.id}
          type="button"
          onClick={() => onFilterChange(filter.id)}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            isActive
              ? 'bg-white text-[#003d9b] shadow-sm border border-[#c3c6d6]'
              : 'text-[#434654] hover:text-[#003d9b]'
          }`}
        >
          {filter.label}
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              isActive ? 'bg-[#003d9b]/10 text-[#003d9b]' : 'bg-[#edeef0] text-[#434654]'
            }`}
          >
            {count}
          </span>
        </button>
      );
    })}
  </div>
);

export default PaymentsFilterNav;
