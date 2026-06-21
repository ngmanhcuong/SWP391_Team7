import api from '../../../services/api';
import {
  Appointment,
  AppointmentFilters,
  CreateAppointmentInput,
  CreatePatientInput,
  Overview,
  Patient,
  QueueAction,
  QueueResponse,
  QueueTicket,
} from '../types';

const unwrap = <T>(res: { data: { data: T } }): T => res.data.data;

export const receptionistApi = {
  getOverview: async (): Promise<Overview> => unwrap(await api.get('/receptionist/overview')),

  // Patients
  listPatients: async (q?: string): Promise<Patient[]> =>
    unwrap(await api.get('/receptionist/patients', { params: { q } })),
  createPatient: async (input: CreatePatientInput): Promise<Patient> =>
    unwrap(await api.post('/receptionist/patients', input)),

  // Appointments
  listAppointments: async (filters?: AppointmentFilters): Promise<Appointment[]> =>
    unwrap(await api.get('/receptionist/appointments', { params: filters })),
  createAppointment: async (input: CreateAppointmentInput): Promise<Appointment> =>
    unwrap(await api.post('/receptionist/appointments', input)),
  updateAppointmentStatus: async (id: string, status: string): Promise<Appointment> =>
    unwrap(await api.patch(`/receptionist/appointments/${id}/status`, { status })),
  checkinAppointment: async (id: string): Promise<{ appointment: Appointment; ticket: number }> =>
    unwrap(await api.post(`/receptionist/appointments/${id}/checkin`)),

  // Queue
  getQueue: async (roomKey?: string): Promise<QueueResponse> =>
    unwrap(await api.get('/receptionist/queue', { params: { roomKey } })),
  manualAddQueue: async (input: {
    patientName: string;
    code?: string;
    doctor?: string;
    roomKey?: string;
  }): Promise<QueueTicket> => unwrap(await api.post('/receptionist/queue/manual', input)),
  callNext: async (): Promise<QueueTicket> => unwrap(await api.post('/receptionist/queue/call-next')),
  updateTicket: async (id: string, action: QueueAction): Promise<QueueTicket> =>
    unwrap(await api.patch(`/receptionist/queue/${id}`, { action })),
};
