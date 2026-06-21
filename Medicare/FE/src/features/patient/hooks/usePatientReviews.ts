import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { User } from '../../../types';
import { PatientReviewsData, ReviewableVisit, SubmitReviewPayload } from '../types';
import { patientApi } from '../api/patientApi';

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
    queryFn: () => patientApi.getReviews(),
    enabled: !!user,
    staleTime: 30_000,
  });

  const submitMutation = useMutation({
    mutationFn: (payload: SubmitReviewPayload) => patientApi.submitReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientReviewsQueryKey(user?.id) });
    },
  });

  return {
    ...query,
    submitReview: async (_visit: ReviewableVisit, payload: SubmitReviewPayload) => {
      await submitMutation.mutateAsync(payload);
    },
    isSubmitting: submitMutation.isPending,
  };
};
