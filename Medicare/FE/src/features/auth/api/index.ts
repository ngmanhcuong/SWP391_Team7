import api from '../../../services/api';
import { ApiResponse, User } from '../../../types';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { fullName: string; email: string; phone: string; password: string; }
export interface ForgotPayload { email: string; }
export interface VerifyOtpPayload { email: string; otp: string; }
export interface ResetPasswordPayload { token: string; password: string; }
export interface LoginResponse { user: User; accessToken: string; refreshToken: string; }
export type RegisterResponse =
  | (LoginResponse & { requiresVerification?: false })
  | { user: User; requiresVerification: true };

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<ApiResponse<RegisterResponse>>('/auth/register', payload).then(r => r.data),

  verifyEmail: (token: string) =>
    api.get<ApiResponse<{}>>(`/auth/verify-email?token=${token}`).then(r => r.data),

  resendVerification: (email: string) =>
    api.post<ApiResponse<{}>>('/auth/resend-verification', { email }).then(r => r.data),

  login: (payload: LoginPayload) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', payload).then(r => r.data),

  loginWithGoogle: () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/auth/google`;
  },

  forgotPassword: (payload: ForgotPayload) =>
    api.post<ApiResponse<{}>>('/auth/forgot-password', payload).then(r => r.data),

  verifyOtp: (payload: VerifyOtpPayload) =>
    api.post<ApiResponse<{ resetToken: string }>>('/auth/verify-otp', payload).then(r => r.data),

  resetPassword: (payload: ResetPasswordPayload) =>
    api.post<ApiResponse<{}>>('/auth/reset-password', payload).then(r => r.data),

  logout: () =>
    api.post<ApiResponse<{}>>('/auth/logout').then(r => r.data),

  getMe: () =>
    api.get<ApiResponse<{ user: User }>>('/auth/me').then((r) => r.data.data.user),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh-token', { refreshToken }).then(r => r.data),
};
