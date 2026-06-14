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

export type NotificationType = 'lab' | 'appointment' | 'system' | 'payment' | 'prescription';

export type NotificationFilter = 'all' | 'unread' | NotificationType;

export interface PatientNotification {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  createdAt: string;
  type: NotificationType;
  isUnread: boolean;
  action?: { label: string; href: string };
}

export interface NotificationStat {
  id: string;
  label: string;
  value: number;
  filter: NotificationFilter;
  icon: 'calendar' | 'clock' | 'flask' | 'receipt' | 'bell';
  iconBg: string;
}

export interface PatientNotificationsData {
  notifications: PatientNotification[];
  stats: NotificationStat[];
  unreadCount: number;
}

export type PaymentInvoiceStatus = 'awaiting_visit' | 'pending_payment' | 'paid';

export type PaymentFilter = 'all' | 'unpaid' | 'paid' | 'awaiting_visit';

export interface PaymentLineItem {
  id: string;
  label: string;
  amount: number;
  type: 'charge' | 'credit';
}

export interface PaymentInvoice {
  id: string;
  invoiceCode: string;
  bookingReferenceCode?: string;
  visitDate: string;
  doctorName: string;
  specialtyName: string;
  status: PaymentInvoiceStatus;
  lineItems: PaymentLineItem[];
  subtotal: number;
  depositAmount: number;
  depositPaymentMethod?: DepositPaymentMethod;
  depositPaidAt?: string;
  totalDue: number;
  estimatedRemaining?: number;
  paidAt?: string;
  dueDate?: string;
  createdAt: string;
}

export interface PaymentStat {
  id: string;
  label: string;
  value: number | string;
  filter: PaymentFilter;
  icon: 'calendar' | 'clock' | 'flask' | 'receipt' | 'bell';
  iconBg: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
}

export interface PatientPaymentsData {
  invoices: PaymentInvoice[];
  stats: PaymentStat[];
  totalUnpaid: number;
  totalDepositHeld: number;
}

export type ReviewFilter = 'all' | 'pending' | 'submitted';

export interface ReviewableVisit {
  id: string;
  visitDate: string;
  doctorName: string;
  specialtyName: string;
  facility: string;
  invoiceCode?: string;
}

export interface ServiceReview {
  id: string;
  visitId: string;
  visitDate: string;
  doctorName: string;
  specialtyName: string;
  facility: string;
  overallRating: number;
  doctorRating: number;
  facilityRating: number;
  comment: string;
  tags: string[];
  submittedAt: string;
  isAnonymous: boolean;
}

export interface ReviewStat {
  id: string;
  label: string;
  value: number | string;
  filter: ReviewFilter;
  icon: 'calendar' | 'clock' | 'flask' | 'receipt' | 'bell';
  iconBg: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
}

export interface SubmitReviewPayload {
  visitId: string;
  overallRating: number;
  doctorRating: number;
  facilityRating: number;
  comment: string;
  tags: string[];
  isAnonymous: boolean;
}

export interface PatientReviewsData {
  pendingVisits: ReviewableVisit[];
  reviews: ServiceReview[];
  stats: ReviewStat[];
  pendingCount: number;
  averageRating: number;
}

export const REVIEW_TAG_OPTIONS = [
  'Giải thích rõ ràng',
  'Thái độ tận tâm',
  'Chờ đợi hợp lý',
  'Cơ sở vật chất tốt',
  'Thủ tục nhanh gọn',
  'Cần cải thiện thời gian chờ',
] as const;

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

export type HealthRecordTab = 'visits' | 'prescriptions' | 'labs' | 'history';

export interface VisitRecord {
  id: string;
  date: string;
  doctorName: string;
  specialty: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  prescriptions: Prescription[];
  status: 'completed' | 'ongoing';
  facility: string;
}

export interface LabResult {
  id: string;
  name: string;
  date: string;
  doctorName: string;
  status: 'normal' | 'abnormal' | 'pending';
  summary: string;
  visitId?: string;
}

export interface MedicalHistoryItem {
  id: string;
  type: 'allergy' | 'chronic' | 'surgery' | 'family';
  label: string;
  detail: string;
  since?: string;
}

export interface PrescriptionRecord extends Prescription {
  prescribedDate: string;
  doctorName: string;
  visitId: string;
  status: 'active' | 'completed';
  duration: string;
}

export interface HealthRecordStat extends DashboardStat {
  tab: HealthRecordTab;
}

export interface PatientHealthRecordsData {
  recordCode: string;
  updatedAt: string;
  stats: HealthRecordStat[];
  visits: VisitRecord[];
  prescriptions: PrescriptionRecord[];
  labResults: LabResult[];
  medicalHistory: MedicalHistoryItem[];
  patientSummary: {
    bloodType?: string;
    height?: string;
    weight?: string;
    lastCheckup?: string;
  };
}

export type AppointmentBookingStep = 1 | 2 | 3 | 4 | 5;

export interface AppointmentBookingStepInfo {
  step: AppointmentBookingStep;
  label: string;
}

export interface AiSymptomAnalysis {
  suggestedSpecialty: string;
  alternativeSpecialty?: string;
  summary: string;
  urgency: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface AppointmentBookingState {
  currentStep: AppointmentBookingStep;
  symptoms: string;
  aiAnalysis: AiSymptomAnalysis | null;
  isAnalyzing: boolean;
}

export type DoctorTagVariant = 'expert' | 'phd' | 'elite' | 'potential';

export interface BookingDoctor {
  id: string;
  name: string;
  specialtyId: string;
  departmentLabel: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  tag: {
    label: string;
    variant: DoctorTagVariant;
  };
  nextAvailableSlot: string | null;
  isAvailable: boolean;
  avatarBg: string;
}

export type TimeSlotPeriod = 'morning' | 'afternoon';

export interface AppointmentTimeSlot {
  id: string;
  time: string;
  period: TimeSlotPeriod;
  available: boolean;
}

export interface AppointmentScheduleDay {
  date: string;
  dayNumber: number;
  weekdayLabel: string;
  isPast: boolean;
  hasAvailableSlots: boolean;
  slots: AppointmentTimeSlot[];
}

export interface AppointmentBookingResult {
  referenceCode: string;
  submittedAt: string;
  depositAmount: number;
  depositPaymentMethod: DepositPaymentMethod;
  depositPaidAt: string;
  consultationFee: number;
  status: AppointmentConfirmationStatus;
}

export type DepositPaymentMethod = 'vnpay' | 'momo' | 'banking';

export type AppointmentConfirmationStatus =
  | 'pending_reception_deposit'
  | 'pending_doctor_confirm'
  | 'confirmed'
  | 'cancelled';

export interface StoredAppointmentBooking {
  id: string;
  referenceCode: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  symptoms: string;
  specialtyId: string;
  specialtyName: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  additionalNotes?: string;
  consultationFee: number;
  depositAmount: number;
  depositPaymentMethod: DepositPaymentMethod;
  depositPaidAt: string;
  submittedAt: string;
  receptionDepositConfirmed: boolean;
  doctorConfirmed: boolean;
  status: AppointmentConfirmationStatus;
}
