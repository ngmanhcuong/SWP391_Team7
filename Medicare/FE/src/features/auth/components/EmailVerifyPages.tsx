import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, RefreshCw, Loader } from 'lucide-react';
import AuthLayout from './AuthLayout';
import Button from '../../../components/ui/Button';
import { useVerifyEmail, useResendVerification } from '../hooks';

// Router: ?token=... → verify | ?email=... → waiting screen
export const CheckEmailPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  if (token) return <VerifyEmailPage />;
  return <CheckEmailWaitingPage />;
};

const CheckEmailWaitingPage: React.FC = () => {
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const resend = useResendVerification();

  return (
    <AuthLayout>
      <div className="fade-in text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={36} className="text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Lexend' }}>
          Kiểm tra email của bạn
        </h1>
        <p className="text-gray-500 text-sm mb-2">Chúng tôi đã gửi link xác thực đến</p>
        {email && (
          <p className="font-semibold text-gray-800 mb-6 bg-gray-50 px-4 py-2 rounded-xl inline-block">
            {decodeURIComponent(email)}
          </p>
        )}
        <div className="bg-blue-50 rounded-2xl p-5 text-left mb-6 space-y-3">
          {['Mở email của bạn', 'Tìm email từ MediCare AI Clinic', 'Nhấn vào link "Xác thực Email"'].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <span className="text-sm text-gray-700">{step}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mb-3">Không nhận được email?</p>
        <Button
          variant="outline"
          fullWidth
          loading={resend.isPending}
          leftIcon={<RefreshCw size={14} />}
          onClick={() => resend.mutate(decodeURIComponent(email))}
        >
          Gửi lại email xác thực
        </Button>
        {resend.isSuccess && (
          <p className="mt-3 text-sm text-green-600">✓ Email đã được gửi lại!</p>
        )}
        <Link to="/dang-nhap" className="block mt-4">
          <Button fullWidth size="lg">Đăng nhập ngay (không cần xác thực email)</Button>
        </Link>
        <p className="mt-4 text-xs text-gray-400">
          Nhớ kiểm tra hộp thư Spam nếu không thấy email.
        </p>
      </div>
    </AuthLayout>
  );
};

// Page visited when clicking the link in the email (?token=...)
export const VerifyEmailPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const { isLoading, isSuccess, isError } = useVerifyEmail(token);

  return (
    <AuthLayout>
      <div className="fade-in text-center py-8">
        {isLoading && (
          <>
            <Loader size={48} className="text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Đang xác thực...</h2>
            <p className="text-gray-500 text-sm">Vui lòng chờ trong giây lát</p>
          </>
        )}
        {isSuccess && (
          <>
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Xác thực thành công!</h2>
            <p className="text-gray-500 text-sm mb-8">
              Email của bạn đã được xác thực. Bạn có thể đăng nhập ngay bây giờ.
            </p>
            <Link to="/dang-nhap">
              <Button fullWidth size="lg">Đăng nhập ngay</Button>
            </Link>
          </>
        )}
        {isError && (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={40} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Link không hợp lệ</h2>
            <p className="text-gray-500 text-sm mb-8">
              Link xác thực đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu gửi lại email.
            </p>
            <Link to="/dang-nhap">
              <Button variant="outline" fullWidth>Quay lại đăng nhập</Button>
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
};
