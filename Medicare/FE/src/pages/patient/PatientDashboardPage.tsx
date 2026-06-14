import React from 'react';
import { Spinner } from '../../components/ui';
import DashboardSearchBar from '../../components/layout/DashboardSearchBar';
import { useAuthStore } from '../../store/authStore';
import {
  DashboardWelcome,
  ExaminationStatusSection,
  FloatingChatButton,
  HealthReportSection,
  NotificationsSection,
  RecentPrescriptionsSection,
  StatCard,
  TodayAppointmentsSection,
} from '../../features/patient/components';
import { usePatientDashboard } from '../../features/patient/hooks';

export const PatientDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data, isLoading, isError } = usePatientDashboard(user);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#434654]">Vui lòng đăng nhập để xem dashboard cá nhân.</p>
      </div>
    );
  }

  const firstName = user.fullName.trim().split(/\s+/).slice(-1)[0] || user.fullName;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#434654]">Không thể tải dữ liệu dashboard. Vui lòng thử lại.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 pb-16">
      <DashboardSearchBar
        title="Tìm kiếm nhanh"
        placeholder="Nhập chuyên khoa, tên bác sĩ..."
        searchHref="/patient/lich-hen"
        buttonLabel="Tìm bác sĩ"
      />

      <DashboardWelcome
        userName={user.fullName}
        summary={data.summaryMessage}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-4">
          <TodayAppointmentsSection appointment={data.todayAppointment} />

          <div className="grid gap-4 md:grid-cols-2">
            <RecentPrescriptionsSection prescriptions={data.prescriptions} />
            <ExaminationStatusSection steps={data.examinationSteps} />
          </div>
        </div>

        <div className="xl:col-span-4 space-y-4">
          <NotificationsSection notifications={data.notifications} />
          <HealthReportSection metrics={data.healthMetrics} patientName={firstName} />
        </div>
      </div>

      <FloatingChatButton unreadCount={2} />
    </div>
  );
};

export default PatientDashboardPage;
