import { User } from '../../../types';
import {
  ExaminationStep,
  HealthMetric,
  PatientDashboardData,
  TodayAppointment,
} from '../types';
import { buildPatientNotificationsData, toDashboardNotifications } from './buildPatientNotificationsData';
import { buildPatientPaymentsData, getDashboardBillStat } from './buildPatientPaymentsData';

/** Một bệnh nhân thường có 0–1 lịch khám trong ngày */
const getTodayAppointment = (): TodayAppointment | null => ({
  id: '1',
  doctorName: 'BS. Trần Văn Hùng',
  description: 'Kiểm tra tim mạch',
  time: '10:15',
  status: 'waiting',
});

const PERSONAL_PRESCRIPTIONS = [
  { id: '1', name: 'Paracetamol 500mg', dosage: '2 viên/ngày - Sau ăn' },
  { id: '2', name: 'Amoxicillin 250mg', dosage: '3 viên/ngày - 7 ngày' },
  { id: '3', name: 'Vitamin C', dosage: '1 viên/sáng - Sủi bọt' },
];

const getFirstName = (fullName: string): string =>
  fullName.trim().split(/\s+/).slice(-1)[0] || fullName;

const calculateBmi = (heightCm: number, weightKg: number): { value: string; progress: number } => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = bmi.toFixed(1);

  let label = 'Bình thường';
  let progress = 65;
  if (bmi < 18.5) {
    label = 'Thiếu cân';
    progress = 35;
  } else if (bmi >= 25 && bmi < 30) {
    label = 'Thừa cân';
    progress = 78;
  } else if (bmi >= 30) {
    label = 'Béo phì';
    progress = 90;
  }

  return { value: `${rounded} (${label})`, progress };
};

const buildExaminationSteps = (appointment: TodayAppointment | null): ExaminationStep[] => {
  if (!appointment) return [];

  if (appointment.status === 'arrived') {
    return [
      { id: '1', title: 'Bạn đã check-in', subtitle: `${appointment.time} · Quầy tiếp nhận`, status: 'completed' },
      { id: '2', title: 'Đang chờ khám', subtitle: appointment.doctorName, status: 'active' },
      { id: '3', title: 'Nhận kết quả', subtitle: 'Sau khi bác sĩ kết luận', status: 'pending' },
    ];
  }

  if (appointment.status === 'waiting') {
    return [
      { id: '1', title: 'Sắp đến giờ khám', subtitle: `${appointment.time} · ${appointment.description}`, status: 'active' },
      { id: '2', title: 'Check-in tại quầy', subtitle: 'Đến trước 15 phút', status: 'pending' },
      { id: '3', title: 'Khám với bác sĩ', subtitle: appointment.doctorName, status: 'pending' },
    ];
  }

  return [];
};

const buildHealthMetrics = (user: User): HealthMetric[] => {
  const metrics: HealthMetric[] = [];

  if (user.height && user.weight) {
    const bmi = calculateBmi(user.height, user.weight);
    metrics.push({ label: 'Chỉ số BMI của bạn', value: bmi.value, progress: bmi.progress });
  }

  if (user.healthScore != null) {
    metrics.push({
      label: 'Điểm sức khỏe',
      value: `${user.healthScore}/100`,
      progress: user.healthScore,
    });
  }

  if (metrics.length === 0) {
    metrics.push(
      { label: 'Chỉ số BMI của bạn', value: '22.5 (Bình thường)', progress: 65 },
      { label: 'Huyết áp tham chiếu', value: '120/80 mmHg', progress: 80 },
    );
  } else if (metrics.length === 1) {
    metrics.push({ label: 'Huyết áp tham chiếu', value: '120/80 mmHg', progress: 80 });
  }

  return metrics;
};

const buildSummary = (
  firstName: string,
  appointment: TodayAppointment | null,
  newLabCount: number,
): string => {
  if (!appointment) {
    return `${firstName}, hôm nay bạn chưa có lịch khám. Hãy đặt lịch khi cần gặp bác sĩ.`;
  }

  const timePart = `lúc ${appointment.time} với ${appointment.doctorName}`;
  const labPart = newLabCount > 0 ? ` Bạn cũng có ${newLabCount} kết quả xét nghiệm mới cần xem.` : '';

  return `${firstName}, hôm nay bạn có lịch ${appointment.description.toLowerCase()} ${timePart}.${labPart}`;
};

export const buildPatientDashboardData = (user: User): PatientDashboardData => {
  const firstName = getFirstName(user.fullName);
  const todayAppointment = getTodayAppointment();
  const newLabCount = 2;
  const notificationData = buildPatientNotificationsData(user);
  const paymentData = buildPatientPaymentsData(user);
  const billStat = getDashboardBillStat(paymentData);
  const hasAppointment = !!todayAppointment;

  return {
    summaryMessage: buildSummary(firstName, todayAppointment, newLabCount),
    stats: [
      {
        id: 'upcoming',
        label: 'Lịch khám hôm nay',
        value: hasAppointment ? 1 : 0,
        trend: hasAppointment ? todayAppointment!.time : 'Trống lịch',
        trendType: hasAppointment ? 'neutral' : 'positive',
        icon: 'calendar',
        iconBg: 'bg-[rgba(0,82,204,0.1)]',
      },
      {
        id: 'visits',
        label: 'Lần khám của bạn',
        value: 12,
        trend: 'Trong năm nay',
        trendType: 'positive',
        icon: 'clock',
        iconBg: 'bg-[rgba(130,249,190,0.2)]',
      },
      {
        id: 'lab',
        label: 'Kết quả xét nghiệm',
        value: 5,
        trend: newLabCount > 0 ? `${newLabCount} mới` : undefined,
        trendType: newLabCount > 0 ? 'negative' : 'neutral',
        icon: 'flask',
        iconBg: 'bg-[rgba(176,35,0,0.1)]',
      },
      {
        id: 'bills',
        label: 'Hóa đơn chưa thanh toán',
        value: billStat.value,
        trend: billStat.trend,
        trendType: billStat.value > 0 ? 'negative' : 'positive',
        icon: 'receipt',
        iconBg: 'bg-[rgba(255,218,214,0.2)]',
      },
    ],
    todayAppointment,
    notifications: toDashboardNotifications(notificationData),
    prescriptions: PERSONAL_PRESCRIPTIONS,
    examinationSteps: buildExaminationSteps(todayAppointment),
    healthMetrics: buildHealthMetrics(user),
  };
};
