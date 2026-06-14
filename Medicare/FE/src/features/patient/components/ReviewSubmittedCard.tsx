import React from 'react';
import { Building2, Stethoscope, UserX } from 'lucide-react';
import { ServiceReview } from '../types';
import StarRatingDisplay from './StarRatingDisplay';

interface ReviewSubmittedCardProps {
  review: ServiceReview;
}

const formatSubmittedDate = (isoDate: string): string =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoDate));

const ReviewSubmittedCard: React.FC<ReviewSubmittedCardProps> = ({ review }) => (
  <article className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2 min-w-0 border-l-4 border-[#006c47] pl-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              Đã đánh giá
            </span>
            {review.isAnonymous && (
              <span className="inline-flex items-center gap-1 text-xs text-[#737685]">
                <UserX size={12} />
                Ẩn danh
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-[#191c1e]">
            {review.specialtyName} · {review.visitDate}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#434654]">
            <span className="inline-flex items-center gap-1.5">
              <Stethoscope size={14} className="text-[#003d9b]" />
              {review.doctorName}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Building2 size={14} className="text-[#003d9b]" />
              {review.facility}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <StarRatingDisplay rating={review.overallRating} size={18} />
          <p className="text-xs text-[#737685] mt-1">
            Gửi ngày {formatSubmittedDate(review.submittedAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 rounded-xl bg-[#f8f9fb] border border-[#c3c6d6]/50 p-4 text-sm">
        <div>
          <p className="text-xs text-[#737685]">Bác sĩ</p>
          <StarRatingDisplay rating={review.doctorRating} size={14} showValue={false} />
        </div>
        <div>
          <p className="text-xs text-[#737685]">Cơ sở</p>
          <StarRatingDisplay rating={review.facilityRating} size={14} showValue={false} />
        </div>
        <div>
          <p className="text-xs text-[#737685]">Tổng thể</p>
          <p className="font-semibold text-[#191c1e]">{review.overallRating}/5</p>
        </div>
      </div>

      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#003d9b]/10 px-3 py-1 text-xs font-medium text-[#003d9b]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {review.comment && (
        <p className="text-sm text-[#434654] leading-relaxed border-t border-[#c3c6d6]/40 pt-4">
          {review.comment}
        </p>
      )}
    </div>
  </article>
);

export default ReviewSubmittedCard;
