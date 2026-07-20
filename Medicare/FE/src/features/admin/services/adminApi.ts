import api from '../../../services/api';
import {
  AdminAppointment,
  AdminDepartment,
  AdminDoctor,
  AdminRoom,
  AdminReview,
  AuditLogEntry,
  PatientTrendPoint,
  SpecialtyShare,
  SupplyItem,
  AdminUser,
  AppointmentStatus,
  ReviewStatus,
  AdminUserStatus,
} from '../types';

// Input shapes (định nghĩa cục bộ để tránh phụ thuộc vòng với hooks)
export type AdminDoctorInput = Omit<AdminDoctor, 'id'>;
export type AdminDepartmentInput = Omit<AdminDepartment, 'id'>;
export type AdminUserInput = Omit<AdminUser, 'id' | 'createdAt' | 'lastActiveAt'>;
export type AdminAppointmentInput = Omit<AdminAppointment, 'id' | 'patientInitials' | 'status'> & {
  status?: AppointmentStatus;
};

const unwrap = <T>(res: { data: { data: T } }): T => res.data.data;

export interface AdminDashboardStats {
  patients: number;
  doctors: number;
  appointments: number;
  specialties: number;
  rooms: number;
  revenue: number;
  revenueLabel: string;
}

export interface AdminDashboardResponse {
  stats: AdminDashboardStats;
  newUsersToday: number;
  monthlyTrend: { month: string; patients: number; appointments: number }[];
  topDepartments: { id: string; rank: number; name: string; revenue: number; revenueLabel: string }[];
  newAppointments: {
    id: string;
    patientName: string;
    service: string;
    time: string;
    status: 'confirmed' | 'pending';
  }[];
}

export interface AdminAppointmentsResponse {
  items: AdminAppointment[];
  stats: { today: number; pending: number; confirmed: number; completed: number; cancelled: number };
  total: number;
}

export interface AdminReviewsResponse {
  items: AdminReview[];
  total: number;
  departments: string[];
  stats: {
    total: number;
    averageRating: number;
    hiddenCount: number;
    monthlyDelta: string;
  };
}

export interface AdminReportsResponse {
  period: 'day' | 'week' | 'month' | 'year';
  anchorDate: string;
  rangeLabel: string;
  stats: {
    patients: number;
    revenue: number;
    suppliesUsed: number;
    completionRate: number;
  };
  patientTrend: PatientTrendPoint[];
  specialtyShare: SpecialtyShare[];
  specialtyTotal: number;
  supplies: SupplyItem[];
  suppliesTotal: number;
  generatedAt: string;
}

export interface AdminReportsQuery {
  period: 'day' | 'week' | 'month' | 'year';
  anchorDate: string;
}

export interface AdminAuditLogsResponse {
  items: AuditLogEntry[];
  total: number;
  actors: string[];
  summary: {
    newAccounts: number;
    bookings: number;
    payments: number;
    updates: number;
  };
}

export interface AdminRoomsResponse {
  items: AdminRoom[];
  total: number;
  stats: {
    total: number;
    available: number;
    inUse: number;
    maintenance: number;
    departments: number;
  };
}

export const adminApi = {
  // Dashboard
  getDashboard: async (): Promise<AdminDashboardResponse> =>
    unwrap(await api.get('/admin/dashboard')),
  getReports: async (params: AdminReportsQuery): Promise<AdminReportsResponse> =>
    unwrap(await api.get('/admin/reports', { params })),
  getAuditLogs: async (): Promise<AdminAuditLogsResponse> =>
    unwrap(await api.get('/admin/audit-logs')),

  // Doctors
  getDoctors: async (): Promise<AdminDoctor[]> => unwrap(await api.get('/admin/doctors')),
  getRooms: async (): Promise<AdminRoomsResponse> => unwrap(await api.get('/admin/rooms')),
  syncDoctorAccounts: async (): Promise<{ total: number }> =>
    unwrap(await api.post('/admin/doctors/sync-accounts')),
  createDoctor: async (input: AdminDoctorInput): Promise<AdminDoctor> =>
    unwrap(await api.post('/admin/doctors', input)),
  updateDoctor: async (id: string, input: Partial<AdminDoctorInput>): Promise<AdminDoctor> =>
    unwrap(await api.put(`/admin/doctors/${id}`, input)),
  deleteDoctor: async (id: string): Promise<void> => {
    await api.delete(`/admin/doctors/${id}`);
  },

  // Specialties
  getSpecialties: async (): Promise<AdminDepartment[]> =>
    unwrap(await api.get('/admin/specialties')),
  createSpecialty: async (input: AdminDepartmentInput): Promise<AdminDepartment> =>
    unwrap(await api.post('/admin/specialties', input)),
  updateSpecialty: async (id: string, input: AdminDepartmentInput): Promise<AdminDepartment> =>
    unwrap(await api.put(`/admin/specialties/${id}`, input)),
  deleteSpecialty: async (id: string): Promise<void> => {
    await api.delete(`/admin/specialties/${id}`);
  },

  // Appointments
  getAppointments: async (): Promise<AdminAppointmentsResponse> =>
    unwrap(await api.get('/admin/appointments')),
  createAppointment: async (input: AdminAppointmentInput): Promise<AdminAppointment> =>
    unwrap(await api.post('/admin/appointments', input)),
  updateAppointmentStatus: async (id: string, status: AppointmentStatus): Promise<AdminAppointment> =>
    unwrap(await api.patch(`/admin/appointments/${encodeURIComponent(id)}/status`, { status })),

  // Reviews
  getReviews: async (): Promise<AdminReviewsResponse> =>
    unwrap(await api.get('/admin/reviews')),
  updateReviewStatus: async (id: string, status: ReviewStatus): Promise<AdminReview> =>
    unwrap(await api.patch(`/admin/reviews/${id}/status`, { status })),

  // Users
  getUsers: async (): Promise<AdminUser[]> => unwrap(await api.get('/admin/users')),
  syncAllAccounts: async (): Promise<{ usersSynced: number; doctorAccountsSynced: number; counts: Record<string, number> }> =>
    unwrap(await api.post('/admin/users/sync-all')),
  createUser: async (input: AdminUserInput): Promise<AdminUser> =>
    unwrap(await api.post('/admin/users', input)),
  updateUserStatus: async (id: string, status: AdminUserStatus): Promise<AdminUser> =>
    unwrap(await api.patch(`/admin/users/${id}/status`, { status })),
  updateUserRole: async (id: string, role: string): Promise<AdminUser> =>
    unwrap(await api.patch(`/admin/users/${id}/role`, { role })),
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};
