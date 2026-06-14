export type AppointmentStatus = 'arrived' | 'waiting' | 'completed' | 'cancelled';

export interface DashboardStat {
  id: string;
  label: string;
  value: string | number;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon: 'calendar' | 'clock' | 'flask' | 'receipt';
  iconBg: string;
}

export interface TodayAppointment {
  id: string;
  doctorName: string;
  doctorAvatar?: string;
  description: string;
  time: string;
  status: AppointmentStatus;
}

export interface DashboardNotification {
  id: string;
  title: string;
  timeAgo: string;
  type: 'lab' | 'appointment' | 'system';
  isUnread?: boolean;
}

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
}

export interface ExaminationStep {
  id: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'pending';
}

export interface HealthMetric {
  label: string;
  value: string;
  progress: number;
}

export interface PatientDashboardData {
  stats: DashboardStat[];
  todayAppointment: TodayAppointment | null;
  notifications: DashboardNotification[];
  prescriptions: Prescription[];
  examinationSteps: ExaminationStep[];
  healthMetrics: HealthMetric[];
  summaryMessage: string;
}
