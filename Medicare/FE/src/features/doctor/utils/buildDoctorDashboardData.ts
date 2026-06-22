import { formatDoctorDepartment } from '../../../constants/clinicSpecialties';
import { User } from '../../../types';
import {
  DoctorDashboardData,
  DoctorPatientListItem,
  ScheduledAppointment,
  TodayAppointment,
  TodayAppointmentStatus,
} from '../types';
import { DOCTOR_PATHS } from './doctorPaths';
import {
  formatShortDateLabel,
  getActiveAppointments,
  getScheduleProgress,
  sortAppointmentsByTime,
} from './scheduleUtils';

const CHART_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const;

const getInitials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const mapScheduleStatus = (status: TodayAppointmentStatus) => {
  if (status === 'completed') return 'arrived' as const;
  if (status === 'waiting') return 'waiting' as const;
  return 'upcoming' as const;
};

const getAppointmentPatient = (
  appointment: TodayAppointment,
  patients: DoctorPatientListItem[],
): DoctorPatientListItem | undefined =>
  patients.find(
    (patient) =>
      patient.id === appointment.patientId ||
      (!!appointment.patientCode && patient.patientCode === appointment.patientCode) ||
      patient.fullName === appointment.patientName,
  );

const toUpcomingAppointment = (appointment: TodayAppointment, isNext = false) => ({
  id: appointment.id,
  patientId: appointment.patientId,
  patientCode: appointment.patientCode,
  patientName: appointment.patientName,
  patientInitials: getInitials(appointment.patientName),
  time: appointment.time,
  reason: appointment.patientNote ?? `Khám ${appointment.department}`,
  status: mapScheduleStatus(appointment.status),
  scheduleStatus: appointment.status,
  type: appointment.type,
  department: appointment.department,
  isNext,
});

const buildChartData = (
  appointments: ScheduledAppointment[],
): DoctorDashboardData['chartData'] => {
  const counts = new Map<string, number>();

  appointments.forEach((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const weekdayIndex = (appointmentDate.getDay() + 6) % 7;
    const weekdayLabel = CHART_LABELS[weekdayIndex];
    counts.set(weekdayLabel, (counts.get(weekdayLabel) ?? 0) + 1);
  });

  return CHART_LABELS.map((day) => ({
    day,
    count: counts.get(day) ?? 0,
  }));
};

export const buildDoctorDashboardData = (
  user: User,
  patients: DoctorPatientListItem[],
  appointments: ScheduledAppointment[],
): DoctorDashboardData => {
  const department = formatDoctorDepartment(user.occupation);
  const sortedAppointments = sortAppointmentsByTime(appointments);
  const activeAppointments = sortAppointmentsByTime(getActiveAppointments(sortedAppointments));
  const progress = getScheduleProgress(sortedAppointments);
  const waitingOrConfirmedAppointments = activeAppointments.filter(
    (appointment) =>
      appointment.status === 'waiting' || appointment.status === 'confirmed',
  );

  const nextScheduleAppointment = waitingOrConfirmedAppointments[0];
  const nextAppointment = nextScheduleAppointment
    ? toUpcomingAppointment(nextScheduleAppointment, true)
    : undefined;

  const upcomingAppointments = waitingOrConfirmedAppointments.map((appointment) =>
    toUpcomingAppointment(appointment, appointment.id === nextScheduleAppointment?.id),
  );

  const waitingQueue = waitingOrConfirmedAppointments.slice(0, 3).map((appointment, index) => {
    const patient = getAppointmentPatient(appointment, patients);

    return {
      id: appointment.id,
      patientId: patient?.id ?? appointment.patientId ?? appointment.id,
      name: appointment.patientName,
      queueNumber: index + 1,
      lastVisit: appointment.status === 'waiting' ? 'Hôm nay' : 'Đã xác nhận',
    };
  });

  const newPatients = activeAppointments
    .filter(
      (appointment, index, list) =>
        list.findIndex(
          (candidate) =>
            candidate.patientId === appointment.patientId &&
            candidate.patientName === appointment.patientName,
        ) === index,
    )
    .slice(0, 4)
    .map((appointment) => {
      const patient = getAppointmentPatient(appointment, patients);

      return {
        id: appointment.id,
        registryId: patient?.id ?? appointment.patientId,
        name: appointment.patientName,
        patientId: patient?.patientCode ?? appointment.patientCode ?? 'Chưa có mã BN',
        admittedAgo:
          appointment.status === 'completed'
            ? 'Đã khám hôm nay'
            : appointment.status === 'waiting'
              ? 'Đang chờ khám hôm nay'
              : 'Đã xác nhận hôm nay',
        department: appointment.department || patient?.department || department,
        healthStatus: patient?.healthStatus,
      };
    });

  const chartData = buildChartData(appointments);
  const chartAverage = `${Math.round(
    chartData.reduce((sum, point) => sum + point.count, 0) / chartData.length,
  )} ca/ngày`;

  const messageCount = 0;
  const remainingCount = progress.pending;
  const summaryParts = [
    `${progress.total} lịch hẹn hôm nay`,
    `${progress.completed} ca đã khám (${progress.percent}%)`,
    `${remainingCount} ca còn lại`,
  ];

  if (waitingQueue.length > 0) {
    summaryParts.push(`${waitingQueue.length} bệnh nhân trong hàng chờ khám`);
  }

  return {
    summaryMessage: summaryParts.join(' · '),
    department,
    todayDateLabel: formatShortDateLabel(new Date()),
    scheduleProgress: progress,
    stats: [
      {
        id: 'total-patients',
        label: 'Lịch hẹn hôm nay',
        value: String(progress.total),
        icon: 'users',
        iconBg: 'bg-blue-50 text-[#2563eb]',
        trend: `${patients.length} hồ sơ`,
        trendType: 'neutral',
        href: DOCTOR_PATHS.schedule,
        hint: 'Xem lịch khám chi tiết',
      },
      {
        id: 'examined',
        label: 'Đã khám xong',
        value: String(progress.completed),
        icon: 'check',
        iconBg: 'bg-emerald-50 text-emerald-600',
        trend: `${progress.percent}% tiến độ`,
        trendType: 'positive',
        href: DOCTOR_PATHS.schedule,
        hint: 'Theo dõi tiến độ trong lịch khám',
      },
      {
        id: 'remaining',
        label: 'Còn lại / chờ khám',
        value: String(remainingCount),
        icon: 'clipboard',
        iconBg: 'bg-amber-50 text-amber-600',
        trend: waitingQueue.length > 0 ? `${waitingQueue.length} trong hàng đợi` : undefined,
        trendType: 'neutral',
        href: nextAppointment?.patientId
          ? DOCTOR_PATHS.record(nextAppointment.patientId)
          : DOCTOR_PATHS.records,
        hint: 'Mở hồ sơ bệnh nhân chờ tiếp theo',
      },
      {
        id: 'messages',
        label: 'Tin nhắn mới',
        value: String(messageCount).padStart(2, '0'),
        icon: 'message',
        iconBg: 'bg-indigo-50 text-indigo-600',
        hint: 'Chưa có dữ liệu tin nhắn từ hệ thống',
      },
    ],
    upcomingAppointments,
    waitingQueue,
    chartData,
    chartAverage,
    chartTrend: `Hôm nay: ${progress.completed}/${progress.total} ca`,
    chartTrendType: progress.percent >= 50 ? 'positive' : 'neutral',
    newPatients,
    newMessageCount: messageCount,
    nextAppointment,
  };
};
