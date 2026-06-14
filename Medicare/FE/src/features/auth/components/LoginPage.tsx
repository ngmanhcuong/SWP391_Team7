import React, { useEffect } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react';
import AuthLayout from './AuthLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Divider } from '../../../components/ui';
import { useLogin } from '../hooks';
import { authApi } from '../api';
import { loginSchema, LoginSchema } from '../validations';
import { useAuthStore } from '../../../store/authStore';
import { getRoleDashboardPath } from '../../../pages/shared/roleConfig';

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_failed: 'Đăng nhập Google thất bại. Vui lòng thử lại.',
  server_error: 'Lỗi server khi đăng nhập Google. Vui lòng thử lại sau.',
};

const LoginPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const login = useLogin();
  const googleError = searchParams.get('error');
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!googleError) return;
    const t = setTimeout(() => {
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }, 8000);
    return () => clearTimeout(t);
  }, [googleError, searchParams, setSearchParams]);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema) => login.mutate(data);

  if (isAuthenticated && user) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }

  return (
    <AuthLayout>
      <div className="fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Lexend' }}>Đăng nhập tài khoản</h1>
          <p className="text-sm text-gray-500">Chào mừng bạn quay lại! Vui lòng đăng nhập để tiếp tục.</p>
        </div>

        {(login.isError || googleError) && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
            {googleError
              ? GOOGLE_ERROR_MESSAGES[googleError] || 'Đăng nhập Google thất bại.'
              : (login.error as { response?: { data?: { message?: string } } })?.response?.data?.message
                || 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.'}
          </div>
        )}

        {/* Google login */}
        <button
          type="button"
          onClick={() => authApi.loginWithGoogle()}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-5"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Tiếp tục với Google
        </button>

        <Divider label="HOẶC DÙNG EMAIL" className="mb-5" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Địa chỉ Email"
            type="email"
            placeholder="example@email.com"
            leftIcon={<Mail size={16} />}
            error={errors.email?.message}
            {...register('email')}
          />
          <div>
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="flex justify-end mt-1">
              <Link to="/quen-mat-khau" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <Button type="submit" fullWidth loading={login.isPending} size="lg" className="mt-2">
            Đăng nhập
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" className="text-blue-600 font-semibold hover:text-blue-800">Đăng ký ngay</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
