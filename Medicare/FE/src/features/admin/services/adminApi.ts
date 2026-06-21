import api from '../../../services/api';
import {
  AdminAppointment,
  AdminDepartment,
  AdminDoctor,
  AdminUser,
  AppointmentStatus,
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

export const adminApi = {
  // Dashboard
  getDashboard: async (): Promise<AdminDashboardResponse> =>
    unwrap(await api.get('/admin/dashboard')),

  // Doctors
  getDoctors: async (): Promise<AdminDoctor[]> => unwrap(await api.get('/admin/doctors')),
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

  // Users
  getUsers: async (): Promise<AdminUser[]> => unwrap(await api.get('/admin/users')),
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
