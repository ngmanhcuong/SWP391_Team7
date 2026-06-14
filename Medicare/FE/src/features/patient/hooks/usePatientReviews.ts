import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { User } from '../../../types';
import { PatientReviewsData, ReviewableVisit, SubmitReviewPayload } from '../types';
import { buildPatientReviewsData } from '../utils/buildPatientReviewsData';
import { saveSubmittedReview } from '../utils/serviceReviewStore';

export const patientReviewsQueryKey = (userId?: string) =>
  ['patient', 'reviews', userId] as const;

export const usePatientReviews = (
  user?: User | null,
): UseQueryResult<PatientReviewsData> & {
  submitReview: (visit: ReviewableVisit, payload: SubmitReviewPayload) => Promise<void>;
  isSubmitting: boolean;
} => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: patientReviewsQueryKey(user?.id),
    queryFn: async () => {
      if (!user) throw new Error('Chưa đăng nhập');
      return buildPatientReviewsData(user);
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  const submitMutation = useMutation({
    mutationFn: async ({
      visit,
      payload,
    }: {
      visit: ReviewableVisit;
      payload: SubmitReviewPayload;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      saveSubmittedReview(visit, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientReviewsQueryKey(user?.id) });
    },
  });

  return {
    ...query,
    submitReview: async (visit: ReviewableVisit, payload: SubmitReviewPayload) => {
      await submitMutation.mutateAsync({ visit, payload });
    },
    isSubmitting: submitMutation.isPending,
  };
};
