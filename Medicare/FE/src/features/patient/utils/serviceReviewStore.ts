import { ServiceReview, SubmitReviewPayload } from '../types';

const STORAGE_KEY = 'medicare_service_reviews';

export const getSubmittedReviews = (): ServiceReview[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ServiceReview[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveSubmittedReview = (
  visit: {
    id: string;
    visitDate: string;
    doctorName: string;
    specialtyName: string;
    facility: string;
    invoiceCode?: string;
  },
  payload: SubmitReviewPayload,
): ServiceReview => {
  const review: ServiceReview = {
    id: `review-${visit.id}-${Date.now()}`,
    visitId: visit.id,
    visitDate: visit.visitDate,
    doctorName: visit.doctorName,
    specialtyName: visit.specialtyName,
    facility: visit.facility,
    overallRating: payload.overallRating,
    doctorRating: payload.doctorRating,
    facilityRating: payload.facilityRating,
    comment: payload.comment.trim(),
    tags: payload.tags,
    submittedAt: new Date().toISOString(),
    isAnonymous: payload.isAnonymous,
  };

  const existing = getSubmittedReviews().filter((item) => item.visitId !== visit.id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([review, ...existing]));
  return review;
};

export const hasReviewForVisit = (visitId: string): boolean =>
  getSubmittedReviews().some((review) => review.visitId === visitId);
