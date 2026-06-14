import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { User } from '../../../types';
import { PatientNotificationsData } from '../types';
import { buildPatientNotificationsData } from '../utils/buildPatientNotificationsData';
import {
  markAllNotificationsRead,
  markNotificationRead,
} from '../utils/notificationReadStore';

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
    queryFn: async () => {
      if (!user) throw new Error('Chưa đăng nhập');
      return buildPatientNotificationsData(user);
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: patientNotificationsQueryKey(user?.id) });
  };

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      markNotificationRead(id);
    },
    onSuccess: invalidate,
  });

  const markAllReadMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      markAllNotificationsRead(ids);
    },
    onSuccess: invalidate,
  });

  return {
    ...query,
    markRead: (id: string) => markReadMutation.mutate(id),
    markAllRead: () => {
      const ids = query.data?.notifications.map((item: { id: string }) => item.id) ?? [];
      markAllReadMutation.mutate(ids);
    },
  };
};

export const useUnreadNotificationCount = (user?: User | null): number => {
  const { data } = usePatientNotifications(user);
  return data?.unreadCount ?? 0;
};
