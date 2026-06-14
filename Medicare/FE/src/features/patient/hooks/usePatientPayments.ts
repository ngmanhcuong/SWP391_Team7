import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { User } from '../../../types';
import { DepositPaymentMethod, PatientPaymentsData } from '../types';
import { buildPatientPaymentsData } from '../utils/buildPatientPaymentsData';
import { markInvoicePaid } from '../utils/paymentInvoiceStore';

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
    queryFn: async () => {
      if (!user) throw new Error('Chưa đăng nhập');
      return buildPatientPaymentsData(user);
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  const payMutation = useMutation({
    mutationFn: async ({
      invoiceId,
    }: {
      invoiceId: string;
      method: DepositPaymentMethod;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 900));
      markInvoicePaid(invoiceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientPaymentsQueryKey(user?.id) });
      queryClient.invalidateQueries({ queryKey: ['patient', 'dashboard', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['patient', 'notifications', user?.id] });
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
