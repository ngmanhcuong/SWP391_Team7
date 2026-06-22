import api from '../../../services/api';
import { ExaminationHistoryEntry, PatientListData, ScheduledAppointment } from '../types';

const unwrap = <T>(res: { data: { data: T } }): T => res.data.data;

export const doctorApi = {
  getPatients: async (): Promise<PatientListData> => unwrap(await api.get('/doctor/patients')),
  getAppointments: async (): Promise<ScheduledAppointment[]> =>
    unwrap(await api.get('/doctor/appointments')),
  getPatientHistory: async (patientId: string): Promise<ExaminationHistoryEntry[]> =>
    unwrap(await api.get(`/doctor/patients/${patientId}/history`)),
  completeAppointment: async (appointmentId: string): Promise<{ id: string; status: string }> =>
    unwrap(await api.patch(`/doctor/appointments/${appointmentId}/complete`)),
};
