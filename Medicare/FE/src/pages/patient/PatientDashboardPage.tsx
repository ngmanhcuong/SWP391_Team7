import React from 'react';
import { Spinner } from '../../components/ui';
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
import { usePatientDashboard, usePatientNotifications } from '../../features/patient/hooks';

export const PatientDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data, isLoading, isError } = usePatientDashboard(user);
  const { markAllRead } = usePatientNotifications(user);

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
      <DashboardWelcome userName={user.fullName} summary={data.summaryMessage} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-5">
          <TodayAppointmentsSection appointment={data.todayAppointment} />

          <div className="grid gap-5 md:grid-cols-2">
            <RecentPrescriptionsSection prescriptions={data.prescriptions} />
            <ExaminationStatusSection steps={data.examinationSteps} />
          </div>
        </div>

        <div className="xl:col-span-4 space-y-5">
          <NotificationsSection notifications={data.notifications} onMarkAllRead={markAllRead} />
          <HealthReportSection metrics={data.healthMetrics} patientName={firstName} />
        </div>
      </div>

      <FloatingChatButton unreadCount={2} />
    </div>
  );
};

export default PatientDashboardPage;
