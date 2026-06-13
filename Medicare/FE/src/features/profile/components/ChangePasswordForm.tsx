import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, X, CheckCircle2 } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useChangePassword } from '../hooks';
import { changePasswordSchema, type ChangePasswordSchema } from '../validations';

type ChangePasswordFormProps = {
  onClose: () => void;
};

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onClose }) => {
  const changePassword = useChangePassword();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ChangePasswordSchema) => {
    setSuccessMessage('');
    changePassword.mutate(
      {
        currentPassword: data.currentPassword ?? '',
        newPassword: data.newPassword,
      },
      {
        onSuccess: (res) => {
          setSuccessMessage(res.message || 'Đổi mật khẩu thành công');
          reset();
        },
      },
    );
  };

  const apiError =
    (changePassword.error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message;

  return (
    <div className="mt-2 rounded-2xl border border-blue-100 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/30 p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Thay đổi mật khẩu</h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
            Mật khẩu mới cần ít nhất 8 ký tự, gồm chữ hoa và số. Nếu bạn đăng ký bằng Google, có
            thể bỏ trống mật khẩu hiện tại.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white dark:hover:bg-slate-700 hover:text-gray-600 dark:hover:text-slate-200"
          aria-label="Đóng form đổi mật khẩu"
        >
          <X size={16} />
        </button>
      </div>

      {successMessage ? (
        <div className="flex items-start gap-2 rounded-xl border border-green-100 bg-green-50 px-3.5 py-3 text-sm text-green-700">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError ? (
            <div className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-600">
              {apiError}
            </div>
          ) : null}

          <Input
            label="Mật khẩu hiện tại"
            type="password"
            placeholder="Nhập mật khẩu hiện tại"
            leftIcon={<Lock size={16} />}
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />

          <Input
            label="Mật khẩu mới"
            type="password"
            placeholder="Nhập mật khẩu mới"
            leftIcon={<Lock size={16} />}
            error={errors.newPassword?.message}
            hint="Ít nhất 8 ký tự, 1 chữ hoa và 1 số"
            {...register('newPassword')}
          />

          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            leftIcon={<Lock size={16} />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" size="sm" loading={changePassword.isPending}>
              Cập nhật mật khẩu
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChangePasswordForm;
