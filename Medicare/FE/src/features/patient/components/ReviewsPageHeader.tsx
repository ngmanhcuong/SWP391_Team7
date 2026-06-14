import React from 'react';
import { Search, Star } from 'lucide-react';

interface ReviewsPageHeaderProps {
  pendingCount: number;
  averageRating: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const ReviewsPageHeader: React.FC<ReviewsPageHeaderProps> = ({
  pendingCount,
  averageRating,
  searchQuery,
  onSearchChange,
}) => (
  <header className="space-y-5">
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003d9b]/5 via-white to-amber-50/40 border border-[#c3c6d6]/60 p-6 sm:p-8 shadow-sm">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-200/20 blur-2xl" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#003d9b]">
            Đánh giá dịch vụ
          </h1>
          <p className="text-base text-[#434654] max-w-xl">
            Chia sẻ trải nghiệm sau khi hoàn tất khám và thanh toán. Phản hồi giúp MediCare cải thiện
            chất lượng phục vụ.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          {pendingCount > 0 && (
            <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-gradient-to-r from-[#fff8e6] to-amber-50 px-4 py-3 text-sm font-medium text-[#7a4f01] shadow-sm">
              <Star size={16} className="text-amber-500 fill-amber-400" />
              {pendingCount} lượt khám chờ đánh giá
            </div>
          )}
          {averageRating > 0 && (
            <div className="inline-flex items-center gap-2 rounded-xl border border-[#c3c6d6]/60 bg-white px-4 py-3 text-sm shadow-sm">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="text-[#434654]">
                Điểm TB của bạn:{' '}
                <span className="font-semibold text-[#191c1e]">{averageRating}/5</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="relative max-w-xl">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685]" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Tìm theo bác sĩ, chuyên khoa..."
        className="w-full rounded-full border border-[#c3c6d6] bg-[#f8f9fb] py-3 pl-11 pr-4 text-base text-[#191c1e] placeholder:text-[#737685] outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
      />
    </div>
  </header>
);

export default ReviewsPageHeader;
