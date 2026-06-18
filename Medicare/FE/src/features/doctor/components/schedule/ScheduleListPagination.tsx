import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScheduleListPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const ScheduleListPagination: React.FC<ScheduleListPaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const start = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 sm:px-6 py-4 border-t border-[#c3c6d6]/40 bg-[#f8f9fb]/40">
      <p className="text-sm text-[#737685]">
        Hiển thị {start}–{end} / {totalCount} lịch hẹn
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg border border-[#c3c6d6]/60 text-[#434654] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Trang trước"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="min-w-[88px] text-center text-sm font-semibold text-[#191c1e]">
          Trang {currentPage}/{totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg border border-[#c3c6d6]/60 text-[#434654] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Trang sau"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ScheduleListPagination;
