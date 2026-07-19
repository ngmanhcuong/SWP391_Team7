import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Camera, Save, RotateCcw, Loader } from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, Avatar, HealthScoreBadge } from '../../../components/ui';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { User } from '../../../types';
import { useAuthStore } from '../../../store/authStore';
import { getRoleDashboardPath } from '../../../pages/shared/roleConfig';
import { useProfile, useUpdateProfile, useUploadAvatar } from '../hooks';
import { profileSchema, type ProfileSchema } from '../validations';

interface ProfileLocationState {
  from?: string;
}

type FormData = ProfileSchema;

const RedAsterisk: React.FC = () => <span className="ml-1 text-red-500">*</span>;

const formatDateForInput = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const profileToForm = (profile: User): FormData => ({
  fullName: profile.fullName || '',
  phone: profile.phone || '',
  dateOfBirth: formatDateForInput(profile.dateOfBirth),
  gender: profile.gender || '',
  address: profile.address || '',
  nationalId: profile.nationalId || '',
  emergencyPhone: profile.emergencyPhone || '',
  occupation: profile.occupation || '',
  bio: profile.bio || '',
  height: profile.height != null ? String(profile.height) : '',
  weight: profile.weight != null ? String(profile.weight) : '',
});

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const returnPath =
    (location.state as ProfileLocationState | null)?.from ??
    (user?.role ? getRoleDashboardPath(user.role) : null);

  const returnLabel = 'Quay lại bảng điều khiển';

  useEffect(() => {
    if (profile) reset(profileToForm(profile));
  }, [profile, reset]);

  const onSubmit = (data: FormData) => {
    updateProfile.mutate({
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
      nationalId: data.nationalId,
      emergencyPhone: data.emergencyPhone,
      occupation: data.occupation,
      bio: data.bio,
      height: Number(data.height),
      ...(data.weight ? { weight: Number(data.weight) } : {}),
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn, tối đa 5MB');
      return;
    }
    uploadAvatar.mutate(file);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-32">
          <Loader size={32} className="animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-4xl">
          {returnPath && (
            <Link
              to={returnPath}
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#003d9b] hover:underline"
            >
              <ArrowLeft size={16} />
              {returnLabel}
            </Link>
          )}

          <Card className="mb-6 overflow-hidden" padding="none">
            <div className="relative h-28 overflow-hidden sm:h-36">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a56db] via-[#1e40af] to-[#312e81]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(255,255,255,0.18),transparent)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_0%_100%,rgba(96,165,250,0.25),transparent)]" />
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -left-4 bottom-0 h-20 w-20 rounded-full bg-indigo-400/20 blur-xl" />
            </div>
            <div className="bg-white px-5 pb-6 pt-4 sm:px-6">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="relative -mt-14 flex-shrink-0 sm:-mt-16">
                  {uploadAvatar.isPending ? (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gray-100 shadow-md ring-1 ring-gray-200/80 sm:h-24 sm:w-24">
                      <Loader size={24} className="animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <Avatar
                      name={profile?.fullName}
                      src={profile?.avatar}
                      size="xl"
                      className="!h-20 !w-20 !text-xl border-4 border-white shadow-md ring-1 ring-gray-200/80 sm:!h-24 sm:!w-24"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0.5 right-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shadow-md ring-2 ring-white transition-colors hover:bg-blue-700"
                  >
                    <Camera size={13} className="text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between sm:pt-2">
                  <div className="min-w-0">
                    <h1
                      className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl"
                      style={{ fontFamily: 'Lexend' }}
                    >
                      {profile?.fullName}
                    </h1>
                    <p className="mt-1 truncate text-sm text-gray-500">{profile?.email}</p>
                    {!profile?.isEmailVerified && (
                      <span className="mt-2 inline-block rounded-full border border-amber-100 bg-amber-50 px-2.5 py-0.5 text-xs text-amber-700">
                        Email chưa xác thực
                      </span>
                    )}
                  </div>
                  <div className="self-start sm:self-center">
                    <HealthScoreBadge score={profile?.healthScore || 0} />
                  </div>
                </div>
              </div>
              {uploadAvatar.isSuccess && (
                <p className="mt-3 pl-[5.5rem] text-xs text-green-600 sm:pl-[6.5rem]">
                  Đã cập nhật ảnh đại diện
                </p>
              )}
            </div>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="mb-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900" style={{ fontFamily: 'Lexend' }}>
                    Thông tin cá nhân
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">Cập nhật thông tin hồ sơ của bạn</p>
                </div>
                <button type="button" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  Chỉnh sửa thông tin
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Họ tên đầy đủ"
                  placeholder="Nguyễn Văn A"
                  error={errors.fullName?.message}
                  required
                  {...register('fullName')}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Ngày tháng năm sinh
                    <RedAsterisk />
                  </label>
                  <input
                    type="date"
                    required
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    {...register('dateOfBirth')}
                  />
                  {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>}
                </div>
                <Input
                  label="Mã bảo hiểm"
                  placeholder="0079134567080"
                  error={errors.nationalId?.message}
                  required
                  {...register('nationalId')}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Giới tính</label>
                  <select
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    {...register('gender')}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Chiều cao / Cân nặng (cm / kg)
                    <RedAsterisk />
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Cao (cm)"
                      required
                      {...register('height')}
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Nặng (kg)"
                      {...register('weight')}
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  {errors.height && <p className="text-xs text-red-500">{errors.height.message}</p>}
                </div>
                <Input label="Nghề nghiệp" placeholder="VD: Kỹ sư phần mềm" {...register('occupation')} />
                <Input
                  label="Số điện thoại"
                  placeholder="VD: 0901234567"
                  error={errors.phone?.message}
                  required
                  {...register('phone')}
                />
                <Input label="SĐT khẩn cấp" placeholder="VD: 0901234567" {...register('emergencyPhone')} />
                <div className="col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Bệnh lịch</label>
                  <textarea
                    rows={3}
                    placeholder="Liệt kê các bệnh lý đang điều trị hoặc tiền sử bệnh..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    {...register('bio')}
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <textarea
                    rows={2}
                    placeholder="Địa chỉ hiện tại của bạn"
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    {...register('address')}
                  />
                </div>
              </div>
            </Card>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                leftIcon={<RotateCcw size={14} />}
                onClick={() => profile && reset(profileToForm(profile))}
              >
                Đặt lại
              </Button>
              <Button type="submit" loading={updateProfile.isPending} leftIcon={<Save size={14} />}>
                Lưu thay đổi
              </Button>
            </div>
            {updateProfile.isError && (
              <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3 text-center text-sm text-red-600">
                {(updateProfile.error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                  'Không thể lưu hồ sơ. Vui lòng thử lại.'}
              </div>
            )}
            {updateProfile.isSuccess && (
              <div className="mt-3 flex flex-col gap-3 rounded-xl border border-green-100 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-green-700">Cập nhật thông tin thành công!</p>
                {returnPath && (
                  <Link
                    to={returnPath}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#003d9b] px-4 py-2 text-sm text-white transition-colors hover:bg-[#002d75]"
                  >
                    <ArrowLeft size={14} />
                    {returnLabel}
                  </Link>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
