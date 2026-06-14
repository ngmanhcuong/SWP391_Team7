import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { User } from '../../../types';
import { authApi } from '../api';
import { normalizeUser } from '../utils/normalizeUser';
import { getRoleDashboardPath } from '../../../pages/shared/roleConfig';

const GoogleSuccessPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const refreshToken = params.get('refreshToken') || '';
    const error = params.get('error');

    if (error || !token) {
      navigate('/dang-nhap?error=google_failed', { replace: true });
      return;
    }

    localStorage.setItem('accessToken', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

    authApi
      .getMe()
      .then((user) => {
        const normalized = normalizeUser(user as User & { _id?: string });
        setAuth(normalized, {
          accessToken: token,
          refreshToken,
        });
        navigate(getRoleDashboardPath(normalized.role), { replace: true });
      })
      .catch(() => {
        navigate('/dang-nhap?error=google_failed', { replace: true });
      });
  }, [params, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader size={40} className="text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Đang đăng nhập với Google...</p>
      </div>
    </div>
  );
};

export default GoogleSuccessPage;
