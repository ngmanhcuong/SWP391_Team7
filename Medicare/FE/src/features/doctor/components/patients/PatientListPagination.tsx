import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PatientListPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const PatientListPagination: React.FC<PatientListPaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  const getVisiblePages = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 'ellipsis', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, 'ellipsis', currentPage, 'ellipsis', totalPages];
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
      <p className="text-sm text-[#737685]">
        Hiển thị {start} - {end} trong tổng số {totalCount} bệnh nhân
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg text-[#434654] hover:bg-[#f8f9fb] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Trang trước"
        >
          <ChevronLeft size={18} />
        </button>

        {getVisiblePages().map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-[#737685]">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-[#003d9b] text-white'
                  : 'text-[#434654] hover:bg-[#f8f9fb]'
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg text-[#434654] hover:bg-[#f8f9fb] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Trang sau"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PatientListPagination;
