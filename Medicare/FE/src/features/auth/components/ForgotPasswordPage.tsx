import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, Lock } from 'lucide-react';
import AuthLayout from './AuthLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useForgotPassword, useVerifyOtp, useResetPassword } from '../hooks';
import { forgotPasswordSchema, resetPasswordSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../validations';
import { AuthStep } from '../types';

// Step indicator
const StepIndicator: React.FC<{ step: AuthStep }> = ({ step }) => {
  const steps = [
    { key: 'forgot', label: 'Email' },
    { key: 'verify-otp', label: 'Xác thực' },
    { key: 'reset-password', label: 'Mật khẩu' },
  ];
  const currentIdx = steps.findIndex(s => s.key === step);

  return (
    <div className="flex items-center gap-2 mb-7">
      {steps.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= currentIdx ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {i < currentIdx ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i <= currentIdx ? 'text-blue-600' : 'text-gray-400'}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < currentIdx ? 'bg-blue-600' : 'bg-gray-100'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};

// OTP Input — nhập 6 số, xác nhận bằng nút (tránh gọi API 2 lần)
const OtpInput: React.FC<{
  disabled?: boolean;
  onSubmit: (otp: string) => void;
}> = ({ disabled, onSubmit }) => {
  const [values, setValues] = useState(['', '', '', '', '', '']);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (disabled || !/^\d?$/.test(val)) return;
    const next = [...values];
    next[i] = val;
    setValues(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
    if (e.key === 'Enter' && values.every(Boolean)) {
      onSubmit(values.join(''));
    }
  };

  const otp = values.join('');
  const isComplete = /^\d{6}$/.test(otp);

  return (
    <div className="space-y-4">
      <div className="flex gap-2.5 justify-center">
        {values.map((v, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            value={v}
            maxLength={1}
            inputMode="numeric"
            disabled={disabled}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className="w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
          />
        ))}
      </div>
      <Button
        type="button"
        fullWidth
        disabled={!isComplete || disabled}
        onClick={() => onSubmit(otp)}
      >
        Xác nhận mã OTP
      </Button>
    </div>
  );
};

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<AuthStep>('forgot');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [otpFormKey, setOtpFormKey] = useState(0);
  const navigate = useNavigate();

  const forgotMutation = useForgotPassword();
  const verifyOtpMutation = useVerifyOtp();
  const resetMutation = useResetPassword();

  const forgotForm = useForm<ForgotPasswordSchema>({ resolver: zodResolver(forgotPasswordSchema) });
  const resetForm = useForm<ResetPasswordSchema>({ resolver: zodResolver(resetPasswordSchema) });

  const getErrorMessage = (error: unknown, fallback: string) =>
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message || fallback;

  const onForgotSubmit = (data: ForgotPasswordSchema) => {
    forgotMutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          setEmail(data.email);
          setOtpFormKey((k) => k + 1);
          verifyOtpMutation.reset();
          setStep('verify-otp');
        },
      }
    );
  };

  const onOtpSubmit = (otp: string) => {
    if (verifyOtpMutation.isPending) return;
    verifyOtpMutation.mutate(
      { email, otp },
      {
        onSuccess: (res) => {
          setResetToken(res.data.resetToken);
          setStep('reset-password');
        },
      }
    );
  };

  const handleResendOtp = () => {
    forgotMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setOtpFormKey((k) => k + 1);
          verifyOtpMutation.reset();
        },
      }
    );
  };

  const onResetSubmit = (data: ResetPasswordSchema) => {
    resetMutation.mutate(
      { token: resetToken, password: data.password },
      {
        onSuccess: () => navigate('/dang-nhap'),
      }
    );
  };

  return (
    <AuthLayout>
      <div className="fade-in">
        <Link to="/dang-nhap" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft size={14} /> Quay lại đăng nhập
        </Link>

        <StepIndicator step={step} />

        {step === 'forgot' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Lexend' }}>Quên mật khẩu?</h2>
              <p className="text-sm text-gray-500">Vui lòng nhập email đăng ký để nhận mã OTP xác thực qua email.</p>
            </div>
            <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4">
              {forgotMutation.isError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                  {getErrorMessage(forgotMutation.error, 'Không thể gửi mã OTP. Kiểm tra email và thử lại.')}
                </div>
              )}
              <Input
                label="Địa chỉ Email"
                type="email"
                placeholder="name@example.com"
                leftIcon={<Mail size={15} />}
                error={forgotForm.formState.errors.email?.message}
                {...forgotForm.register('email')}
              />
              <Button type="submit" fullWidth loading={forgotMutation.isPending} rightIcon={<span>→</span>}>
                Gửi mã xác thực
              </Button>
              <p className="text-xs text-gray-400 text-center">
                Mã OTP gửi qua email (hoặc xem log backend khi chạy dev)
              </p>
            </form>
          </>
        )}

        {step === 'verify-otp' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Lexend' }}>Xác thực OTP</h2>
              <p className="text-sm text-gray-500">
                Mã OTP đã được gửi tới <strong>{email}</strong>. Vui lòng kiểm tra hộp thư.
              </p>
            </div>
            <div className="space-y-4">
              <OtpInput
                key={otpFormKey}
                disabled={verifyOtpMutation.isPending || forgotMutation.isPending}
                onSubmit={onOtpSubmit}
              />
              {verifyOtpMutation.isPending && (
                <p className="text-center text-sm text-blue-600">Đang xác thực mã OTP...</p>
              )}
              {verifyOtpMutation.isError && (
                <p className="text-center text-sm text-red-500">
                  {getErrorMessage(verifyOtpMutation.error, 'Mã OTP không chính xác hoặc đã hết hạn')}
                </p>
              )}
              <p className="text-center text-xs text-gray-400">
                Mã có hiệu lực <strong>30 phút</strong>. Không nhận được mã?{' '}
                <button
                  type="button"
                  disabled={forgotMutation.isPending}
                  onClick={handleResendOtp}
                  className="text-blue-600 font-medium hover:underline disabled:opacity-50"
                >
                  Gửi lại OTP
                </button>
              </p>
            </div>
          </>
        )}

        {step === 'reset-password' && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Lexend' }}>Đặt lại mật khẩu</h2>
              <p className="text-sm text-gray-500">Vui lòng tạo mật khẩu mới. Đảm bảo mật khẩu đủ mạnh và chứa ký tự đặc biệt.</p>
            </div>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
              {resetMutation.isError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                  {getErrorMessage(resetMutation.error, 'Không thể đặt lại mật khẩu. Vui lòng thử lại.')}
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-2">Độ mạnh mật khẩu</p>
                <div className="space-y-1.5 mb-3">
                  {[{ label: 'Ít nhất 8 ký tự', check: (v: string) => v.length >= 8 },
                    { label: 'Chứa chữ hoa', check: (v: string) => /[A-Z]/.test(v) },
                    { label: 'Chứa số', check: (v: string) => /[0-9]/.test(v) }].map(r => (
                    <div key={r.label} className="flex items-center gap-1.5 text-xs">
                      <span className={r.check(resetForm.watch('password') || '') ? 'text-green-500' : 'text-gray-300'}>●</span>
                      <span className={r.check(resetForm.watch('password') || '') ? 'text-green-600' : 'text-gray-400'}>{r.label}</span>
                    </div>
                  ))}
                </div>
                <Input label="Mật khẩu mới" type="password" leftIcon={<Lock size={15} />}
                  error={resetForm.formState.errors.password?.message} {...resetForm.register('password')} />
              </div>
              <Input label="Xác nhận mật khẩu mới" type="password" leftIcon={<Lock size={15} />}
                error={resetForm.formState.errors.confirmPassword?.message} {...resetForm.register('confirmPassword')} />
              <Button type="submit" fullWidth loading={resetMutation.isPending} rightIcon={<span>→</span>}>
                Đặt lại mật khẩu
              </Button>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
