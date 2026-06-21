import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, IdCard, Mail, MapPin, Phone, UserPen } from 'lucide-react';
import { Spinner } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { FloatingChatButton, PatientHealthSummaryCard } from '../../features/patient/components';
import { useProfile } from '../../features/profile/hooks';

export const PatientProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: profile, isLoading } = useProfile();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#434654]">Vui lòng đăng nhập để xem thông tin bệnh nhân.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const displayUser = profile ?? user;

  return (
    <div className="relative space-y-6 pb-16">
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003d9b]/5 via-white to-[#82f9be]/10 border border-[#c3c6d6]/60 p-6 sm:p-8 shadow-sm">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#003d9b]/5 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#003d9b]/10 px-3 py-1 text-xs font-medium text-[#003d9b]">
              <IdCard size={14} />
              Hồ sơ định danh
            </div>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#003d9b]">
              Thông tin bệnh nhân
            </h1>
            <p className="text-base text-[#434654] max-w-xl">
              Thông tin cá nhân và hồ sơ định danh của bạn tại MedCare Clinic.
            </p>
          </div>
          <Link
            to="/ho-so"
            state={{ from: '/patient/benh-nhan' }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003d9b] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#002d75] transition-colors shrink-0 shadow-sm shadow-[#003d9b]/20"
          >
            <UserPen size={16} />
            Chỉnh sửa hồ sơ
          </Link>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
          <div className="border-b border-[#c3c6d6]/60 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#191c1e]">Thông tin liên hệ</h2>
          </div>
          <div className="p-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-[#737685]">Họ và tên</p>
              <p className="text-base text-[#191c1e]">{displayUser.fullName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-[#737685]">Giới tính</p>
              <p className="text-base text-[#191c1e]">
                {displayUser.gender === 'male'
                  ? 'Nam'
                  : displayUser.gender === 'female'
                    ? 'Nữ'
                    : displayUser.gender === 'other'
                      ? 'Khác'
                      : '—'}
              </p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-[#737685] flex items-center gap-1.5">
                <Mail size={12} />
                Email
              </p>
              <p className="text-base text-[#191c1e]">{displayUser.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-[#737685] flex items-center gap-1.5">
                <Phone size={12} />
                Số điện thoại
              </p>
              <p className="text-base text-[#191c1e]">{displayUser.phone ?? '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-[#737685]">SĐT khẩn cấp</p>
              <p className="text-base text-[#191c1e]">{displayUser.emergencyPhone ?? '—'}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-[#737685] flex items-center gap-1.5">
                <MapPin size={12} />
                Địa chỉ
              </p>
              <p className="text-base text-[#191c1e]">{displayUser.address ?? '—'}</p>
            </div>
            {displayUser.bio && (
              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-[#737685]">Bệnh lịch / Ghi chú</p>
                <p className="text-base text-[#191c1e] whitespace-pre-wrap">{displayUser.bio}</p>
              </div>
            )}
          </div>
        </div>

        <PatientHealthSummaryCard
          user={displayUser}
          summary={{
            height: displayUser.height ? `${displayUser.height} cm` : undefined,
            weight: displayUser.weight ? `${displayUser.weight} kg` : undefined,
            lastCheckup: '28/05/2026',
            bloodType: 'O+',
          }}
          allergyCount={2}
        />
      </div>

      <div className="rounded-2xl border border-[#c3c6d6]/60 bg-gradient-to-r from-[#f8f9fb] to-[#003d9b]/[0.03] px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#434654]">
          Cần cập nhật ảnh đại diện, CCCD hoặc thông tin y tế chi tiết?
        </p>
        <Link
          to="/patient/lich-hen"
          className="inline-flex items-center justify-center gap-2 text-sm font-medium text-[#003d9b] hover:underline shrink-0"
        >
          <Calendar size={16} />
          Đặt lịch khám mới
        </Link>
      </div>

      <FloatingChatButton />
    </div>
  );
};

export default PatientProfilePage;
