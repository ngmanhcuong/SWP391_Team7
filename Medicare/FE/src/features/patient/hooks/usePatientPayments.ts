import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { User } from '../../../types';
import { DepositPaymentMethod, PatientPaymentsData } from '../types';
import { patientApi } from '../api/patientApi';

export const patientPaymentsQueryKey = (userId?: string) =>
  ['patient', 'payments', userId] as const;

export const usePatientPayments = (
  user?: User | null,
): UseQueryResult<PatientPaymentsData> & {
  payInvoice: (invoiceId: string, method: DepositPaymentMethod) => Promise<void>;
  isPaying: boolean;
} => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: patientPaymentsQueryKey(user?.id),
    queryFn: () => patientApi.getPayments(),
    enabled: !!user,
    staleTime: 30_000,
  });

  const payMutation = useMutation({
    mutationFn: ({ invoiceId, method }: { invoiceId: string; method: DepositPaymentMethod }) =>
      patientApi.payInvoice(invoiceId, method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientPaymentsQueryKey(user?.id) });
      queryClient.invalidateQueries({ queryKey: ['patient', 'dashboard', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'notifications', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'reviews', user?.id] });
    },
  });

  return {
    ...query,
    payInvoice: async (invoiceId: string, method: DepositPaymentMethod) => {
      await payMutation.mutateAsync({ invoiceId, method });
    },
    isPaying: payMutation.isPending,
  };
};
