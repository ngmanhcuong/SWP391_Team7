import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import {
  DashboardWaitingQueue,
  DoctorDashboardWelcome,
  DoctorFloatingActionButton,
  DoctorStatCard,
  ExaminationFrequencyChart,
  NewPatientsSection,
  UpcomingAppointmentsTable,
} from '../../features/doctor/components';
import { useDoctorDashboard } from '../../features/doctor/hooks';
import { DOCTOR_PATHS } from '../../features/doctor/utils/doctorPaths';

export const DoctorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { data, isLoading, isError } = useDoctorDashboard(user);

  if (isAuthenticated && !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#434654]">Vui lòng đăng nhập để xem dashboard bác sĩ.</p>
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

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#434654]">Không thể tải dữ liệu dashboard. Vui lòng thử lại.</p>
      </div>
    );
  }

  const nextRecordId = data.nextAppointment?.patientId;

  return (
    <div className="relative space-y-6 pb-20">
      <DoctorDashboardWelcome
        userName={user.fullName}
        summary={data.summaryMessage}
        todayDateLabel={data.todayDateLabel}
        department={data.department}
        nextPatientName={data.nextAppointment?.patientName}
        nextPatientTime={data.nextAppointment?.time}
        nextPatientHref={nextRecordId ? DOCTOR_PATHS.record(nextRecordId) : undefined}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <DoctorStatCard
            key={stat.id}
            stat={stat}
            showNotificationDot={stat.id === 'messages' && data.newMessageCount > 0}
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-12 items-start">
        <div className="xl:col-span-7 min-w-0 self-start">
          <UpcomingAppointmentsTable
            appointments={data.upcomingAppointments}
            progress={data.scheduleProgress}
          />
        </div>
        <div className="xl:col-span-5 min-w-0 self-start flex flex-col gap-5">
          <DashboardWaitingQueue patients={data.waitingQueue} />
          <ExaminationFrequencyChart
            data={data.chartData}
            average={data.chartAverage}
            trend={data.chartTrend}
            trendType={data.chartTrendType}
          />
        </div>
      </div>

      <div className="relative isolate">
        <NewPatientsSection patients={data.newPatients} />
      </div>

      <DoctorFloatingActionButton onClick={() => navigate(DOCTOR_PATHS.patients)} />
    </div>
  );
};

export default DoctorDashboardPage;
