import React, { useState } from 'react';
import { Building2, ChevronDown, ChevronUp, Stethoscope } from 'lucide-react';
import { Spinner } from '../../../components/ui';
import { REVIEW_TAG_OPTIONS, ReviewableVisit, SubmitReviewPayload } from '../types';
import StarRatingInput from './StarRatingInput';

interface ReviewPendingCardProps {
  visit: ReviewableVisit;
  isSubmitting: boolean;
  onSubmit: (visit: ReviewableVisit, payload: SubmitReviewPayload) => void;
}

const ReviewPendingCard: React.FC<ReviewPendingCardProps> = ({
  visit,
  isSubmitting,
  onSubmit,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [overallRating, setOverallRating] = useState(0);
  const [doctorRating, setDoctorRating] = useState(0);
  const [facilityRating, setFacilityRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState('');

  const toggleTag = (tag: string) => {
    setTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const handleSubmit = () => {
    if (overallRating === 0 || doctorRating === 0 || facilityRating === 0) {
      setError('Vui lòng chấm đủ 3 tiêu chí trước khi gửi.');
      return;
    }
    setError('');
    onSubmit(visit, {
      visitId: visit.id,
      overallRating,
      doctorRating,
      facilityRating,
      comment,
      tags,
      isAnonymous,
    });
  };

  return (
    <article className="bg-white border border-amber-200/80 rounded-2xl shadow-sm shadow-amber-100/50 overflow-hidden ring-1 ring-amber-100">
      <div className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 min-w-0 border-l-4 border-amber-400 pl-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                Chờ đánh giá
              </span>
              {visit.invoiceCode && (
                <span className="text-xs font-medium text-[#737685]">{visit.invoiceCode}</span>
              )}
            </div>
            <h3 className="text-base font-semibold text-[#191c1e]">
              {visit.specialtyName} · {visit.visitDate}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#434654]">
              <span className="inline-flex items-center gap-1.5">
                <Stethoscope size={14} className="text-[#003d9b]" />
                {visit.doctorName}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={14} className="text-[#003d9b]" />
                {visit.facility}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#003d9b] hover:underline shrink-0"
          >
            {expanded ? (
              <>
                Thu gọn
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                Viết đánh giá
                <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>

        {expanded && (
          <div className="mt-6 pt-6 border-t border-[#c3c6d6]/40 space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <StarRatingInput
                label="Tổng thể"
                value={overallRating}
                onChange={setOverallRating}
              />
              <StarRatingInput
                label="Bác sĩ"
                value={doctorRating}
                onChange={setDoctorRating}
              />
              <StarRatingInput
                label="Cơ sở & lễ tân"
                value={facilityRating}
                onChange={setFacilityRating}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-[#191c1e] mb-2">Điểm nổi bật (tuỳ chọn)</p>
              <div className="flex flex-wrap gap-2">
                {REVIEW_TAG_OPTIONS.map((tag) => {
                  const selected = tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        selected
                          ? 'bg-[#003d9b] text-white'
                          : 'bg-[#f8f9fb] text-[#434654] border border-[#c3c6d6] hover:border-[#003d9b]/40'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor={`comment-${visit.id}`} className="text-sm font-medium text-[#191c1e]">
                Nhận xét thêm (tuỳ chọn)
              </label>
              <textarea
                id={`comment-${visit.id}`}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
                placeholder="Chia sẻ trải nghiệm khám của bạn..."
                className="mt-2 w-full rounded-xl border border-[#c3c6d6] bg-[#f8f9fb] px-4 py-3 text-sm text-[#191c1e] placeholder:text-[#737685] outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10 resize-none"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-[#434654] cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(event) => setIsAnonymous(event.target.checked)}
                className="rounded border-[#c3c6d6] text-[#003d9b] focus:ring-[#003d9b]/30"
              />
              Gửi đánh giá ẩn danh
            </label>

            {error && <p className="text-sm text-[#ba1a1a]">{error}</p>}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#003d9b] px-6 py-3 text-sm font-semibold text-white hover:bg-[#002d75] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  Đang gửi...
                </>
              ) : (
                'Gửi đánh giá'
              )}
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default ReviewPendingCard;
