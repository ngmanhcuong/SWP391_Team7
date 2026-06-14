import React from 'react';
import { ReviewFilter } from '../types';

interface ReviewsFilterNavProps {
  activeFilter: ReviewFilter;
  onFilterChange: (filter: ReviewFilter) => void;
  counts: Record<ReviewFilter, number>;
}

const FILTERS: { id: ReviewFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ đánh giá' },
  { id: 'submitted', label: 'Đã đánh giá' },
];

const ReviewsFilterNav: React.FC<ReviewsFilterNavProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => (
  <div className="flex flex-wrap gap-2 p-1 bg-[#f8f9fb] border border-[#c3c6d6] rounded-xl">
    {FILTERS.map((filter) => {
      const isActive = activeFilter === filter.id;
      return (
        <button
          key={filter.id}
          type="button"
          onClick={() => onFilterChange(filter.id)}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
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
            {counts[filter.id]}
          </span>
        </button>
      );
    })}
  </div>
);

export default ReviewsFilterNav;
