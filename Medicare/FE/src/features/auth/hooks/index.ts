import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi, LoginPayload, LoginResponse } from '../api';
import { ApiResponse } from '../../../types';
import { useAuthStore } from '../../../store/authStore';
import { normalizeUser } from '../utils/normalizeUser';
import { matchDemoAccount } from '../constants/demoAccounts';
import { getRoleDashboardPath } from '../../../pages/shared/roleConfig';

const getPostAuthPath = (
  role: string | undefined,
  fromPath?: string,
): string => {
  if (fromPath && fromPath !== '/' && fromPath !== '/dang-nhap' && fromPath !== '/dang-ky') {
    return fromPath;
  }
  return getRoleDashboardPath(role);
};

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  return useMutation({
    mutationFn: async (payload: LoginPayload): Promise<ApiResponse<LoginResponse>> => {
      const demoUser = matchDemoAccount(payload.email, payload.password);
      if (demoUser) {
        return {
          success: true,
          message: 'Đăng nhập demo',
          data: {
            user: demoUser,
            accessToken: `demo-${demoUser.role}-access-token`,
            refreshToken: `demo-${demoUser.role}-refresh-token`,
          },
        };
      }
      return authApi.login(payload);
    },
    onSuccess: (res) => {
      const { user, accessToken, refreshToken } = res.data;
      const normalized = normalizeUser(user as Parameters<typeof normalizeUser>[0]);
      setAuth(normalized, { accessToken, refreshToken });
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
      navigate(getPostAuthPath(normalized.role, from), { replace: true });
    },
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (res, variables) => {
      const data = res.data;
      if ('accessToken' in data && data.accessToken && data.user) {
        const normalized = normalizeUser(data.user as Parameters<typeof normalizeUser>[0]);
        setAuth(normalized, { accessToken: data.accessToken, refreshToken: data.refreshToken });
        navigate(getRoleDashboardPath(normalized.role), { replace: true });
        return;
      }
      navigate(`/xac-thuc-email?email=${encodeURIComponent(variables.email)}`);
    },
  });
};

export const useVerifyEmail = (token: string) => {
  return useQuery({
    queryKey: ['verify-email', token],
    queryFn: () => authApi.verifyEmail(token),
    enabled: !!token,
    retry: false,
  });
};

export const useResendVerification = () =>
  useMutation({ mutationFn: authApi.resendVerification });

export const useForgotPassword = () =>
  useMutation({ mutationFn: authApi.forgotPassword });

export const useVerifyOtp = () =>
  useMutation({ mutationFn: authApi.verifyOtp });

export const useResetPassword = () =>
  useMutation({ mutationFn: authApi.resetPassword });

export const useLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return async () => {
    try {
      await authApi.logout();
    } catch {
      // Token có thể đã hết hạn — vẫn xóa phiên local
    } finally {
      logout();
      navigate('/', { replace: true });
    }
  };
};
