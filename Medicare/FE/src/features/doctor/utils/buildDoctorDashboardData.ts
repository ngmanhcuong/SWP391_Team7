import { User } from '../../../types';
import {
  AppointmentStatus,
  DoctorDashboardData,
  TodayAppointment,
  TodayAppointmentStatus,
} from '../types';
import { buildDoctorScheduleData } from './buildDoctorScheduleData';
import {
  DOCTOR_PATIENT_REGISTRY,
  getDefaultMedicalRecordPatientId,
  getDoctorPatientById,
  getDoctorPatientTotalCount,
  getPatientQueueNumber,
  getPatientsByHealthStatus,
} from './doctorPatientRegistry';
import { DOCTOR_PATHS } from './doctorPaths';
import {
  formatShortDateLabel,
  getActiveAppointments,
  getScheduleProgress,
  sortAppointmentsByTime,
} from './scheduleUtils';

const CHART_DATA: DoctorDashboardData['chartData'] = [
  { day: 'T2', count: 28 },
  { day: 'T3', count: 35 },
  { day: 'T4', count: 42 },
  { day: 'T5', count: 38 },
  { day: 'T6', count: 45 },
  { day: 'T7', count: 22 },
  { day: 'CN', count: 18 },
];

const getInitials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const mapScheduleStatus = (status: TodayAppointmentStatus): AppointmentStatus => {
  if (status === 'completed') return 'arrived';
  if (status === 'waiting') return 'waiting';
  return 'upcoming';
};

const toUpcomingAppointment = (appointment: TodayAppointment, isNext = false) => {
  const patient = appointment.patientId ? getDoctorPatientById(appointment.patientId) : undefined;

  return {
    id: appointment.id,
    patientId: appointment.patientId,
    patientCode: patient?.patientCode,
    patientName: appointment.patientName,
    patientInitials: getInitials(appointment.patientName),
    time: appointment.time,
    reason: appointment.patientNote ?? `Khám ${appointment.department}`,
    status: mapScheduleStatus(appointment.status),
    scheduleStatus: appointment.status,
    type: appointment.type,
    department: appointment.department,
    isNext,
  };
};

export const buildDoctorDashboardData = (user: User): DoctorDashboardData => {
  const schedule = buildDoctorScheduleData();
  const department = user.occupation || 'Khoa Nội tổng quát';
  const waitingPatients = getPatientsByHealthStatus('waiting');
  const progress = getScheduleProgress(schedule.appointments);
  const remainingCount = progress.pending;
  const defaultRecordId = getDefaultMedicalRecordPatientId();

  const activeAppointments = sortAppointmentsByTime(getActiveAppointments(schedule.appointments));
  const nextScheduleAppointment = activeAppointments.find(
    (appt) => appt.status === 'waiting' || appt.status === 'confirmed',
  );

  const pendingAppointments = activeAppointments
    .filter((appt) => appt.status === 'waiting' || appt.status === 'confirmed')
    .map((appt) => toUpcomingAppointment(appt, appt.id === nextScheduleAppointment?.id));

  const nextAppointment = nextScheduleAppointment
    ? toUpcomingAppointment(nextScheduleAppointment, true)
    : undefined;

  const waitingQueue = waitingPatients
    .map((patient) => ({
      id: patient.id,
      patientId: patient.id,
      name: patient.fullName,
      queueNumber: getPatientQueueNumber(patient.id) ?? 0,
      lastVisit: patient.lastVisit,
    }))
    .sort((a, b) => a.queueNumber - b.queueNumber);

  const newPatients = DOCTOR_PATIENT_REGISTRY.filter(
    (patient) => patient.lastVisit === 'Hôm nay' || patient.healthStatus === 'waiting',
  )
    .slice(0, 4)
    .map((patient) => ({
      id: patient.id,
      registryId: patient.id,
      name: patient.fullName,
      patientId: patient.patientCode,
      admittedAgo: patient.lastVisit === 'Hôm nay' ? 'Tiếp nhận hôm nay' : patient.lastVisit,
      department,
      healthStatus: patient.healthStatus,
    }));

  const chartAverage = `${Math.round(
    CHART_DATA.reduce((sum, point) => sum + point.count, 0) / CHART_DATA.length,
  )} ca/ngày`;

  const summaryParts = [
    `${progress.total} lịch hẹn hôm nay`,
    `${progress.completed} ca đã khám (${progress.percent}%)`,
    `${remainingCount} ca còn lại`,
  ];
  if (waitingQueue.length) {
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
        iconBg: 'bg-[#e8f0fe] text-[#003d9b]',
        trend: `${getDoctorPatientTotalCount()} hồ sơ`,
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
        trend: waitingQueue.length ? `${waitingQueue.length} trong hàng đợi` : undefined,
        trendType: 'neutral',
        href: defaultRecordId ? DOCTOR_PATHS.record(defaultRecordId) : DOCTOR_PATHS.records,
        hint: 'Mở hồ sơ bệnh nhân chờ tiếp theo',
      },
      {
        id: 'messages',
        label: 'Tin nhắn mới',
        value: '05',
        icon: 'message',
        iconBg: 'bg-indigo-50 text-indigo-600',
        href: DOCTOR_PATHS.settings,
        hint: 'Cài đặt thông báo',
      },
    ],
    upcomingAppointments: pendingAppointments,
    waitingQueue,
    chartData: CHART_DATA,
    chartAverage,
    chartTrend: `Hôm nay: ${progress.completed}/${progress.total} ca`,
    chartTrendType: progress.percent >= 50 ? 'positive' : 'neutral',
    newPatients,
    newMessageCount: 5,
    nextAppointment,
  };
};
