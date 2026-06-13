import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api';
import { useAuthStore } from '../../../store/authStore';

export const useProfile = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      setUser({ ...data, id: data.id || (data as { _id?: string })._id || '' });
      queryClient.setQueryData(['profile'], data);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: profileApi.uploadAvatar,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['profile'], data.user);
    },
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      profileApi.changePassword(currentPassword, newPassword),
  });

export const useSettings = () =>
  useQuery({ queryKey: ['settings'], queryFn: profileApi.getSettings });

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.updateSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });
};
