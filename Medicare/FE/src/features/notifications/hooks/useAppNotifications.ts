import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { User } from '../../../types';

export type AppNotificationType =
  | 'appointment'
  | 'lab'
  | 'prescription'
  | 'payment'
  | 'system'
  | 'queue'
  | 'patient';

export interface AppNotificationItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  createdAt: string;
  type: AppNotificationType;
  isUnread: boolean;
  action?: { label: string; href: string };
}

interface AppNotificationsResponse {
  notifications: AppNotificationItem[];
  unreadCount: number;
}

const notificationsQueryKey = (userId?: string) => ['profile', 'notifications', userId] as const;

const getNotifications = async (): Promise<AppNotificationsResponse> => {
  const response = await api.get('/profile/notifications');
  return response.data.data;
};

const markNotificationsRead = async (body?: { id?: string; ids?: string[] }) => {
  await api.patch('/profile/notifications/read', body ?? {});
};

export const useAppNotifications = (user?: User | null) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: notificationsQueryKey(user?.id),
    queryFn: getNotifications,
    enabled: Boolean(user),
    staleTime: 20_000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: notificationsQueryKey(user?.id) });
  };

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationsRead({ id }),
    onSuccess: invalidate,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markNotificationsRead(),
    onSuccess: invalidate,
  });

  return {
    ...query,
    notifications: query.data?.notifications ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    markRead: (id: string) => markReadMutation.mutate(id),
    markAllRead: () => markAllReadMutation.mutate(),
  };
};
