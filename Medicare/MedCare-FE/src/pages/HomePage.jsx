import { Loading } from '../components/common';
import { useDashboardData } from '../features/dashboard/hooks/useDashboardData';
import {
  WelcomeHeader,
  StatCards,
  TodayAppointments,
  RecentPrescriptions,
  ExaminationStatus,
  NotificationsPanel,
  HealthReport,
} from '../features/dashboard/components';

const HomePage = () => {
  const { data, loading } = useDashboardData();

  if (loading || !data) {
    return <Loading message="Đang tải dashboard..." />;
  }

  return (
    <div className="space-y-8">
      <WelcomeHeader welcome={data.welcome} />
      <StatCards stats={data.stats} />

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <TodayAppointments appointments={data.appointments} />
          <div className="grid gap-4 md:grid-cols-2">
            <RecentPrescriptions prescriptions={data.prescriptions} />
            <ExaminationStatus steps={data.examinationSteps} />
          </div>
        </div>

        <div className="space-y-4 xl:col-span-4">
          <NotificationsPanel notifications={data.notifications} />
          <HealthReport report={data.healthReport} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
