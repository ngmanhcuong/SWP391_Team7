import api from '../../../services/api';
import {
  AiMedicationSuggestion,
  ExaminationHistoryEntry,
  MedicalRecordExamination,
  ParaclinicalTest,
  PatientListData,
  PrescriptionItem,
  ScheduledAppointment,
} from '../types';

const unwrap = <T>(res: { data: { data: T } }): T => res.data.data;

export const doctorApi = {
  getPatients: async (): Promise<PatientListData> => unwrap(await api.get('/doctor/patients')),
  getAppointments: async (params?: {
    fromDate?: string;
    toDate?: string;
  }): Promise<ScheduledAppointment[]> =>
    unwrap(await api.get('/doctor/appointments', { params })),
  getPatientHistory: async (patientId: string): Promise<ExaminationHistoryEntry[]> =>
    unwrap(await api.get(`/doctor/patients/${patientId}/history`)),
  suggestMedications: async (payload: {
    clinicalSymptoms: string;
    preliminaryDiagnosis: string;
    additionalNotes?: string;
    allergies?: string[];
    medicalHistory?: string[];
  }): Promise<AiMedicationSuggestion[]> =>
    unwrap<{ suggestions: AiMedicationSuggestion[] }>(
      await api.post('/ai/suggest-medications', payload),
    ).suggestions,
  saveAppointmentRecord: async (
    appointmentId: string,
    payload: {
      examination: MedicalRecordExamination;
      prescriptions: PrescriptionItem[];
      paraclinicalTests: ParaclinicalTest[];
      allergies: string[];
      medicalHistory: string[];
      complete?: boolean;
    },
  ): Promise<{ visitId: string; appointmentId: string; status: string }> =>
    unwrap(await api.post(`/doctor/appointments/${appointmentId}/record`, payload)),
  completeAppointment: async (appointmentId: string): Promise<{ id: string; status: string }> =>
    unwrap(await api.patch(`/doctor/appointments/${appointmentId}/complete`)),
};
