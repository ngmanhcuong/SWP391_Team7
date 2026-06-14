import { User } from '../../../types';
import {
  PatientReviewsData,
  ReviewableVisit,
  ReviewStat,
  ServiceReview,
} from '../types';
import { buildPatientPaymentsData } from './buildPatientPaymentsData';
import { getSubmittedReviews, hasReviewForVisit } from './serviceReviewStore';

const FACILITY_NAME = 'MediCare Clinic Q.1';

const MOCK_SUBMITTED_REVIEWS: ServiceReview[] = [
  {
    id: 'review-mock-ophthalmology',
    visitId: 'visit-ophthalmology-2026-03',
    visitDate: '15/03/2026',
    doctorName: 'BS. Phạm Minh Tuấn',
    specialtyName: 'Mắt',
    facility: FACILITY_NAME,
    overallRating: 5,
    doctorRating: 5,
    facilityRating: 4,
    comment: 'Bác sĩ giải thích kỹ quy trình điều trị, nhân viên hướng dẫn rất nhiệt tình.',
    tags: ['Giải thích rõ ràng', 'Thái độ tận tâm'],
    submittedAt: '2026-03-15T18:00:00.000Z',
    isAnonymous: false,
  },
];

const invoiceToReviewableVisit = (invoice: {
  id: string;
  visitDate: string;
  doctorName: string;
  specialtyName: string;
  invoiceCode: string;
}): ReviewableVisit => ({
  id: invoice.id,
  visitDate: invoice.visitDate,
  doctorName: invoice.doctorName,
  specialtyName: invoice.specialtyName,
  facility: FACILITY_NAME,
  invoiceCode: invoice.invoiceCode,
});

export const buildPatientReviewsData = (user: User): PatientReviewsData => {
  const paymentData = buildPatientPaymentsData(user);
  const storedReviews = getSubmittedReviews();

  const paidReviewable = paymentData.invoices
    .filter((invoice) => invoice.status === 'paid')
    .map(invoiceToReviewableVisit)
    .filter((visit) => !hasReviewForVisit(visit.id));

  const pendingVisits = paidReviewable.sort(
    (a, b) => new Date(b.visitDate.split('/').reverse().join('-')).getTime()
      - new Date(a.visitDate.split('/').reverse().join('-')).getTime(),
  );

  const mockReviews = MOCK_SUBMITTED_REVIEWS.filter(
    (review) => !storedReviews.some((item) => item.visitId === review.visitId),
  );

  const reviews = [...storedReviews, ...mockReviews].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );

  const averageRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length) * 10,
        ) / 10
      : 0;

  const stats: ReviewStat[] = [
    {
      id: 'pending',
      label: 'Chờ đánh giá',
      value: pendingVisits.length,
      filter: 'pending',
      icon: 'calendar',
      iconBg: 'bg-[rgba(255,218,214,0.3)]',
      trend: pendingVisits.length > 0 ? 'Sau khám & thanh toán' : undefined,
      trendType: pendingVisits.length > 0 ? 'negative' : 'positive',
    },
    {
      id: 'submitted',
      label: 'Đã đánh giá',
      value: reviews.length,
      filter: 'submitted',
      icon: 'receipt',
      iconBg: 'bg-[rgba(130,249,190,0.2)]',
      trendType: 'positive',
    },
    {
      id: 'average',
      label: 'Điểm trung bình',
      value: reviews.length > 0 ? averageRating : '—',
      filter: 'submitted',
      icon: 'bell',
      iconBg: 'bg-[rgba(0,82,204,0.1)]',
      trend: reviews.length > 0 ? '/ 5 sao' : undefined,
      trendType: 'neutral',
    },
    {
      id: 'all',
      label: 'Tổng lượt khám',
      value: pendingVisits.length + reviews.length,
      filter: 'all',
      icon: 'clock',
      iconBg: 'bg-[#edeef0]',
      trendType: 'neutral',
    },
  ];

  return {
    pendingVisits,
    reviews,
    stats,
    pendingCount: pendingVisits.length,
    averageRating,
  };
};
