export type AppointmentStatus = 'arrived' | 'waiting' | 'upcoming';

export interface DoctorDashboardStat {
  id: string;
  label: string;
  value: string;
  icon: 'users' | 'check' | 'clipboard' | 'message';
  iconBg: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  href?: string;
  hint?: string;
}

export interface UpcomingAppointment {
  id: string;
  patientId?: string;
  patientCode?: string;
  patientName: string;
  patientInitials: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  scheduleStatus?: TodayAppointmentStatus;
  type?: TodayAppointmentType;
  department?: string;
  isNext?: boolean;
}

export interface ChartDataPoint {
  day: string;
  count: number;
}

export interface NewPatient {
  id: string;
  registryId?: string;
  name: string;
  patientId: string;
  admittedAgo: string;
  department: string;
  healthStatus?: PatientHealthStatus;
  avatar?: string;
}

export interface DashboardWaitingItem {
  id: string;
  patientId: string;
  name: string;
  queueNumber: number;
  lastVisit: string;
}

export interface DoctorDashboardData {
  summaryMessage: string;
  department: string;
  todayDateLabel: string;
  scheduleProgress: {
    completed: number;
    total: number;
    pending: number;
    percent: number;
  };
  stats: DoctorDashboardStat[];
  upcomingAppointments: UpcomingAppointment[];
  waitingQueue: DashboardWaitingItem[];
  chartData: ChartDataPoint[];
  chartAverage: string;
  chartTrend: string;
  chartTrendType: 'positive' | 'negative' | 'neutral';
  newPatients: NewPatient[];
  newMessageCount: number;
  nextAppointment?: UpcomingAppointment;
}

export type DoctorNotificationType = 'appointment' | 'patient' | 'message' | 'system';

export interface DoctorNotification {
  id: string;
  type: DoctorNotificationType;
  title: string;
  message: string;
  timeAgo: string;
  href?: string;
}

export type DoctorSearchResultType = 'patient' | 'appointment';

export interface DoctorSearchResult {
  id: string;
  type: DoctorSearchResultType;
  title: string;
  subtitle: string;
  meta?: string;
  href: string;
}

export type TimeSlotKey = 'morning' | 'afternoon' | 'evening';

export interface DaySchedule {
  day: string;
  dayLabel: string;
  slots: Record<TimeSlotKey, boolean>;
}

export type HolidayLeaveType = 'holiday' | 'leave';

export interface HolidayEntry {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  type: HolidayLeaveType;
}

export interface DoctorWorkScheduleSettings {
  applyToAllWeeks: boolean;
  weeklySchedule: DaySchedule[];
  consultationMinutes: number;
  customConsultationMinutes: string;
  holidays: HolidayEntry[];
}

export interface DoctorNotificationSettings {
  email: boolean;
  sms: boolean;
  pushNotifications: boolean;
  newAppointment: boolean;
  patientCancelAppointment: boolean;
  newMessage: boolean;
  shiftReminder: boolean;
}

export interface DoctorProfileSettings {
  fullName: string;
  specialty: string;
  phone: string;
  email: string;
  biography: string;
  doctorId: string;
  status: 'active' | 'inactive';
}

export interface DoctorSettingsData {
  profile: DoctorProfileSettings;
  workSchedule: DoctorWorkScheduleSettings;
  notifications: DoctorNotificationSettings;
}

export type DoctorSettingsTab = 'professional' | 'schedule' | 'notifications' | 'security';

export type TodayAppointmentStatus = 'waiting' | 'confirmed' | 'completed' | 'cancelled';

export type TodayAppointmentType = 'new' | 'followup';

export type ScheduleTimeFilter = 'all' | 'morning' | 'afternoon' | 'evening';

export type ScheduleViewMode = 'list' | 'week' | 'month';

export interface TodayAppointment {
  id: string;
  patientId?: string;
  patientCode?: string;
  time: string;
  patientName: string;
  patientNote?: string;
  department: string;
  type: TodayAppointmentType;
  status: TodayAppointmentStatus;
  timeSlot: ScheduleTimeFilter;
}

export interface ScheduledAppointment extends TodayAppointment {
  date: string;
}

export interface TodayScheduleStats {
  total: number;
  completed: number;
  waiting: number;
  waitingPatientNames: string[];
}

export interface TodayScheduleData {
  dateLabel: string;
  appointments: TodayAppointment[];
  stats: TodayScheduleStats;
  alertNote: string;
  statusCounts: Record<TodayAppointmentStatus | 'all', number>;
}

export type LabResultStatus = 'high' | 'upper' | 'normal';

export interface LabResult {
  id: string;
  name: string;
  value: string;
  status: LabResultStatus;
  statusLabel: string;
}

export interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  quantity: string;
  instructions: string;
}

export interface AiMedicationSuggestion {
  id: string;
  name: string;
  reason: string;
  dosage?: string;
  quantity?: string;
  instructions?: string;
  warning?: string;
}

export interface ParaclinicalTest {
  id: string;
  name: string;
  checked: boolean;
  priority?: boolean;
}

export interface ExaminationHistoryEntry {
  id: string;
  date: string;
  doctor: string;
  diagnosis: string;
}

export interface WaitingPatient {
  id: string;
  patientId: string;
  name: string;
  queueNumber: number;
}

export interface MedicalRecordExamination {
  startTime: string;
  room: string;
  status: 'examining' | 'waiting' | 'completed';
  clinicalSymptoms: string;
  preliminaryDiagnosis: string;
  additionalNotes: string;
}

export interface MedicalRecordPatient {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  insuranceStatus: 'active' | 'inactive';
  allergies: string[];
  medicalHistory: string[];
}

export interface MedicalRecordData {
  patient: MedicalRecordPatient;
  examination: MedicalRecordExamination;
  examinationHistory: ExaminationHistoryEntry[];
  paraclinicalTests: ParaclinicalTest[];
  labResults: LabResult[];
  prescriptions: PrescriptionItem[];
  aiSuggestions: AiMedicationSuggestion[];
  waitingPatients: WaitingPatient[];
}

export type PatientHealthStatus = 'stable' | 'monitoring' | 'waiting';

export interface DoctorPatientListItem {
  id: string;
  patientCode: string;
  fullName: string;
  gender: 'Nam' | 'Nữ';
  age: number;
  phone: string;
  lastVisit: string;
  healthStatus: PatientHealthStatus;
  department?: string;
}

export interface PatientListFilters {
  patientCode: string;
  fullName: string;
  phone: string;
}

export interface PatientListSummary {
  totalManaged: number;
  totalTrend: string;
  newThisWeek: number;
  weeklyChart: number[];
  waitingReExam: number;
}

export interface PatientListData {
  patients: DoctorPatientListItem[];
  totalCount: number;
  summary: PatientListSummary;
}

export interface NewPatientFormData {
  fullName: string;
  gender: 'Nam' | 'Nữ' | '';
  dateOfBirth: string;
  nationalId: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceNumber: string;
  insuranceStatus: 'active' | 'inactive' | 'none';
  allergies: string;
  medicalHistory: string;
  clinicalNotes: string;
  healthStatus: PatientHealthStatus;
}

export type NewPatientFormErrors = Partial<Record<keyof NewPatientFormData, string>>;

export interface DoctorPatientExtendedInfo {
  patientId: string;
  dateOfBirth: string;
  nationalId: string;
  email: string;
  address: string;
  province: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceNumber: string;
  insuranceStatus: 'active' | 'inactive';
  allergies: string[];
  medicalHistory: string[];
  clinicalNotes: string;
  bloodType: string;
}

export interface AddPatientResult {
  patient: DoctorPatientListItem;
  openRecord?: boolean;
}
