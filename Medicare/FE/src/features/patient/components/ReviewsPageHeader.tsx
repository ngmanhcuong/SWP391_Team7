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
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#06b6d4] p-6 shadow-soft-lg sm:p-8">
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
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">Đánh giá dịch vụ</h1>
          <p className="max-w-xl text-base text-blue-50/90">
            Chia sẻ trải nghiệm sau khi hoàn tất khám bệnh. Phản hồi của bạn giúp MediCare cải thiện
            chất lượng phục vụ.
          </p>
        </div>
        <div className="shrink-0 flex flex-wrap gap-3">
          {pendingCount > 0 && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-amber-700 shadow-lg shadow-blue-900/20">
              <Star size={16} className="fill-amber-400 text-amber-500" />
              {pendingCount} lượt khám chờ đánh giá
            </div>
          )}
          {averageRating > 0 && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm backdrop-blur-sm ring-1 ring-white/20">
              <Star size={16} className="fill-amber-300 text-amber-300" />
              <span className="text-blue-50/90">
                Điểm TB của bạn: <span className="font-semibold text-white">{averageRating}/5</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="relative max-w-xl">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Tìm theo bác sĩ, chuyên khoa..."
        className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
      />
    </div>
  </header>
);

export default ReviewsPageHeader;
