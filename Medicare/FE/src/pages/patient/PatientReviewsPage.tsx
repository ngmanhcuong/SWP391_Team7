import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import {
  FloatingChatButton,
  ReviewPendingCard,
  ReviewSubmittedCard,
  ReviewsEmptyState,
  ReviewsFilterNav,
  ReviewsGuidelinesPanel,
  ReviewsPageHeader,
  ReviewsStatCard,
} from '../../features/patient/components';
import { usePatientReviews } from '../../features/patient/hooks';
import { ReviewableVisit, ReviewFilter, ServiceReview } from '../../features/patient/types';

const VALID_FILTERS: ReviewFilter[] = ['all', 'pending', 'submitted'];

const isReviewFilter = (value: string | null): value is ReviewFilter =>
  value !== null && VALID_FILTERS.includes(value as ReviewFilter);

const matchesSearch = (query: string, ...values: string[]): boolean => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return values.some((value) => value.toLowerCase().includes(normalized));
};

const visitMatchesSearch = (query: string, visit: ReviewableVisit): boolean =>
  matchesSearch(query, visit.doctorName, visit.specialtyName, visit.facility, visit.invoiceCode ?? '');

const reviewMatchesSearch = (query: string, review: ServiceReview): boolean =>
  matchesSearch(
    query,
    review.doctorName,
    review.specialtyName,
    review.facility,
    review.comment,
    ...review.tags,
  );

export const PatientReviewsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data, isLoading, isError, submitReview, isSubmitting } = usePatientReviews(user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [submittingVisitId, setSubmittingVisitId] = useState<string | null>(null);

  const filterParam = searchParams.get('filter');
  const activeFilter: ReviewFilter = isReviewFilter(filterParam) ? filterParam : 'all';

  const setActiveFilter = useCallback(
    (filter: ReviewFilter) => {
      setSearchParams(filter === 'all' ? {} : { filter }, { replace: true });
    },
    [setSearchParams],
  );

  const filteredPending = useMemo(() => {
    if (!data) return [];
    return data.pendingVisits.filter((visit) => visitMatchesSearch(searchQuery, visit));
  }, [data, searchQuery]);

  const filteredReviews = useMemo(() => {
    if (!data) return [];
    return data.reviews.filter((review) => reviewMatchesSearch(searchQuery, review));
  }, [data, searchQuery]);

  const filterCounts = useMemo((): Record<ReviewFilter, number> => {
    if (!data) return { all: 0, pending: 0, submitted: 0 };
    return {
      all: filteredPending.length + filteredReviews.length,
      pending: filteredPending.length,
      submitted: filteredReviews.length,
    };
  }, [data, filteredPending.length, filteredReviews.length]);

  const showPending = activeFilter === 'all' || activeFilter === 'pending';
  const showSubmitted = activeFilter === 'all' || activeFilter === 'submitted';
  const isEmpty =
    (showPending ? filteredPending.length : 0) + (showSubmitted ? filteredReviews.length : 0) === 0;

  const handleSubmit = async (
    visit: ReviewableVisit,
    payload: Parameters<typeof submitReview>[1],
  ) => {
    setSubmittingVisitId(visit.id);
    try {
      await submitReview(visit, payload);
    } finally {
      setSubmittingVisitId(null);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#434654]">Vui lòng đăng nhập để đánh giá dịch vụ.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#434654]">Không thể tải dữ liệu đánh giá. Vui lòng thử lại.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 pb-16">
      <ReviewsPageHeader
        pendingCount={data.pendingCount}
        averageRating={data.averageRating}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <ReviewsStatCard
            key={stat.id}
            stat={stat}
            isActive={activeFilter === stat.filter || (stat.id === 'average' && activeFilter === 'submitted')}
            onSelect={setActiveFilter}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 p-4 sm:p-6 space-y-4 min-w-0">
          <ReviewsFilterNav
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={filterCounts}
          />

          {isEmpty ? (
            <ReviewsEmptyState filter={activeFilter} />
          ) : (
            <div className="space-y-4">
              {showPending &&
                filteredPending.map((visit) => (
                  <ReviewPendingCard
                    key={visit.id}
                    visit={visit}
                    isSubmitting={isSubmitting && submittingVisitId === visit.id}
                    onSubmit={handleSubmit}
                  />
                ))}
              {showSubmitted &&
                filteredReviews.map((review) => (
                  <ReviewSubmittedCard key={review.id} review={review} />
                ))}
            </div>
          )}
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <ReviewsGuidelinesPanel />
        </div>
      </div>

      <FloatingChatButton unreadCount={0} />
    </div>
  );
};

export default PatientReviewsPage;
