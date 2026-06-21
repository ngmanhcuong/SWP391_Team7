import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { User } from '../../../types';
import { PatientNotificationsData } from '../types';
import { patientApi } from '../api/patientApi';

export const patientNotificationsQueryKey = (userId?: string) =>
  ['patient', 'notifications', userId] as const;

export const usePatientNotifications = (
  user?: User | null,
): UseQueryResult<PatientNotificationsData> & {
  markRead: (id: string) => void;
  markAllRead: () => void;
} => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: patientNotificationsQueryKey(user?.id),
    queryFn: () => patientApi.getNotifications(),
    enabled: !!user,
    staleTime: 30_000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: patientNotificationsQueryKey(user?.id) });
  };

  const markReadMutation = useMutation({
    mutationFn: (id: string) => patientApi.markNotificationsRead({ id }),
    onSuccess: invalidate,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => patientApi.markNotificationsRead(),
    onSuccess: invalidate,
  });

  return {
    ...query,
    markRead: (id: string) => markReadMutation.mutate(id),
    markAllRead: () => markAllReadMutation.mutate(),
  };
};

export const useUnreadNotificationCount = (user?: User | null): number => {
  const { data } = usePatientNotifications(user);
  return data?.unreadCount ?? 0;
};
