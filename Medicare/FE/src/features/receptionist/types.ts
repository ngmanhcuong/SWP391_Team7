export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'checked-in' | 'done';
export type QueueStatus = 'waiting' | 'in-progress' | 'skipped' | 'done';
export type RoomKey =
  | 'P101'
  | 'P102'
  | 'P201'
  | 'P202'
  | 'P301'
  | 'P302'
  | 'P401'
  | 'P402';

export interface PatientInsurance {
  code: string;
  expiry: string | null;
  place: string;
}

export interface Patient {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  nationalId?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  email?: string;
  avatar?: string | null;
  insurance?: PatientInsurance;
  createdAt?: string;
}

export interface Appointment {
  id: string;
  code: string;
  patient?: string | null;
  patientName: string;
  patientCode?: string;
  phone?: string;
  doctor: string;
  department: string;
  room?: string;
  date: string;
  time: string;
  service?: string;
  insured?: boolean;
  status: AppointmentStatus;
  checkedInAt?: string | null;
  queueTicket?: number | null;
}

export interface QueueTicket {
  id: string;
  ticket: number;
  patientName: string;
  code?: string;
  doctor?: string;
  room?: string;
  department?: string;
  roomKey: RoomKey;
  status: QueueStatus;
  appointment?: string | null;
  calledAt?: string | null;
  completedAt?: string | null;
  waitMinutes: number;
  createdAt?: string;
}

export interface OverviewStats {
  appointmentsToday: number;
  checkedInToday: number;
  confirmedToday: number;
  pendingToday: number;
  cancelledToday: number;
  waitingCount: number;
  completedCount: number;
}

export interface Overview {
  stats: OverviewStats;
  queuePreview: QueueTicket[];
  upcoming: Appointment[];
}

export interface QueueResponse {
  tickets: QueueTicket[];
  completedCount: number;
}

export interface CreatePatientInput {
  fullName: string;
  phone: string;
  nationalId?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  email?: string;
  insurance?: { code?: string; expiry?: string | null; place?: string };
}

export interface CreateAppointmentInput {
  patientId?: string | null;
  patientName: string;
  phone?: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  service?: string;
}

export interface AppointmentFilters {
  status?: 'all' | AppointmentStatus;
  department?: string;
  q?: string;
}

export type QueueAction = 'call' | 'recall' | 'skip' | 'complete';
