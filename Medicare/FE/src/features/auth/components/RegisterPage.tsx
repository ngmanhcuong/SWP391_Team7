import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Lock } from 'lucide-react';
import AuthLayout from './AuthLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useRegister } from '../hooks';
import { registerSchema, RegisterSchema } from '../validations';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';

const RegisterPage: React.FC = () => {
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ['', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981', '#059669'];

  const onSubmit = (data: RegisterSchema) => {
    registerMutation.mutate({
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      password: data.password,
    });
  };

  return (
    <AuthLayout>
      <div className="fade-in">
        <div className="mb-7">
          <h1 className="mb-1 text-2xl font-bold text-gray-900" style={{ fontFamily: 'Lexend' }}>
            Tạo Tài Khoản
          </h1>
          <p className="text-sm text-gray-500">
            Tham gia cộng đồng chăm sóc sức khỏe thông minh cùng chúng tôi.
          </p>
        </div>

        {registerMutation.isError && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-600">
            {getApiErrorMessage(
              registerMutation.error,
              'Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.',
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Họ tên"
              placeholder="Nguyễn Văn A"
              leftIcon={<User size={15} />}
              error={errors.fullName?.message}
              {...register('fullName')}
            />
            <Input
              label="Số điện thoại"
              placeholder="0901234567"
              leftIcon={<Phone size={15} />}
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <Input
            label="Địa chỉ Email"
            type="email"
            placeholder="example@email.com"
            leftIcon={<Mail size={15} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div>
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              leftIcon={<Lock size={15} />}
              error={errors.password?.message}
              {...register('password')}
            />
            {password && (
              <div className="mt-2">
                <div className="mb-1 flex gap-1">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{
                        background: item <= strength ? strengthColors[strength] : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </p>
              </div>
            )}
          </div>

          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            leftIcon={<Lock size={15} />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="agreeTerms"
              className="mt-0.5 h-4 w-4 rounded text-blue-600 accent-blue-600"
              {...register('agreeTerms')}
            />
            <label htmlFor="agreeTerms" className="text-xs leading-relaxed text-gray-600">
              Tôi đồng ý với{' '}
              <a href="/" className="text-blue-600 hover:underline">
                Điều khoản dịch vụ
              </a>{' '}
              và{' '}
              <a href="/" className="text-blue-600 hover:underline">
                Chính sách bảo mật
              </a>
            </label>
          </div>
          {errors.agreeTerms && <p className="text-xs text-red-500">{errors.agreeTerms.message}</p>}

          <Button type="submit" fullWidth loading={registerMutation.isPending} size="lg">
            Đăng ký tài khoản
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Đã có tài khoản?{' '}
          <Link to="/dang-nhap" className="font-semibold text-blue-600 hover:text-blue-800">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
