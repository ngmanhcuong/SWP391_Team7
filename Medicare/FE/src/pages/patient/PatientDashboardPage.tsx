import React from 'react';
import { Spinner } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import {
  AiHealthAssistantCard,
  DashboardWelcome,
  ExaminationStatusSection,
  FloatingChatButton,
  HealthReportSection,
  MedicalRemindersCard,
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
        <p className="text-slate-500">Vui lòng đăng nhập để xem dashboard cá nhân.</p>
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
        <p className="text-slate-500">Không thể tải dữ liệu dashboard. Vui lòng thử lại.</p>
      </div>
    );
  }

  const healthScore = data.healthMetrics.length
    ? Math.round(
        data.healthMetrics.reduce((sum, metric) => sum + metric.progress, 0) /
          data.healthMetrics.length,
      )
    : 0;

  return (
    <div className="relative space-y-6 pb-16">
      <div className="animate-fade-up">
        <DashboardWelcome
          userName={user.fullName}
          summary={data.summaryMessage}
          appointment={data.todayAppointment}
          healthScore={healthScore}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat, index) => (
          <div key={stat.id} className={`animate-fade-up stagger-${index + 1}`}>
            <StatCard stat={stat} />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-6">
          <div className="animate-fade-up stagger-2">
            <AiHealthAssistantCard />
          </div>

          <div className="animate-fade-up stagger-3">
            <TodayAppointmentsSection appointment={data.todayAppointment} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="animate-fade-up stagger-4">
              <RecentPrescriptionsSection prescriptions={data.prescriptions} />
            </div>
            <div className="animate-fade-up stagger-5">
              <ExaminationStatusSection steps={data.examinationSteps} />
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="animate-fade-up stagger-3">
            <HealthReportSection metrics={data.healthMetrics} patientName={firstName} />
          </div>
          <div className="animate-fade-up stagger-4">
            <MedicalRemindersCard prescriptions={data.prescriptions} appointment={data.todayAppointment} />
          </div>
          <div className="animate-fade-up stagger-5">
            <NotificationsSection notifications={data.notifications} onMarkAllRead={markAllRead} />
          </div>
        </div>
      </div>

      <FloatingChatButton />
    </div>
  );
};

export default PatientDashboardPage;
