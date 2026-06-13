import api from '../../../services/api';
import { User, SystemSettings, ProfileUpdateData } from '../../../types';

export const profileApi = {
  getProfile: () =>
    api.get<{ success: boolean; data: { user: User } }>('/profile').then(r => r.data.data.user),

  updateProfile: (data: ProfileUpdateData) =>
    api.put<{ success: boolean; data: { user: User } }>('/profile', data).then(r => r.data.data.user),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post<{ success: boolean; data: { avatarUrl: string; user: User } }>(
      '/profile/avatar',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ).then(r => r.data.data);
  },

  deleteAvatar: () =>
    api.delete('/profile/avatar').then(r => r.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api
      .put<{ success: boolean; message: string }>('/profile/change-password', {
        currentPassword,
        newPassword,
      })
      .then((r) => r.data),

  getSettings: async (): Promise<SystemSettings> => ({
    language: 'vi', dataSharing: true,
    emailNotifications: true, smsNotifications: false,
    subscriptionPlan: 'Free',
  }),

  updateSettings: async (data: Partial<SystemSettings>): Promise<SystemSettings> =>
    data as SystemSettings,
};
