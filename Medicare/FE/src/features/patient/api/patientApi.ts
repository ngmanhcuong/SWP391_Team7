import api from '../../../services/api';
import {
  AppointmentBookingResult,
  BookingDoctor,
  DepositPaymentMethod,
  PatientDashboardData,
  PatientHealthRecordsData,
  PatientNotificationsData,
  PatientPaymentsData,
  PatientReviewsData,
  ServiceReview,
  SubmitReviewPayload,
} from '../types';

const unwrap = <T>(res: { data: { data: T } }): T => res.data.data;

export interface PatientSpecialty {
  id: string;
  name: string;
  departmentLabel: string;
  consultationFee: number;
  depositAmount: number;
  doctorCount: number;
}

export interface CreateAppointmentInput {
  specialtyId: string;
  doctorId?: string;
  doctorName?: string;
  date: string;
  time: string;
  symptoms?: string;
  additionalNotes?: string;
  depositPaymentMethod: DepositPaymentMethod;
}

export const patientApi = {
  // Specialties & doctors
  getSpecialties: async (): Promise<PatientSpecialty[]> =>
    unwrap(await api.get('/patient/specialties')),
  getDoctors: async (specialtyId?: string): Promise<BookingDoctor[]> =>
    unwrap(await api.get('/patient/doctors', { params: { specialtyId } })),

  // Booking
  getAppointments: async (): Promise<unknown[]> => unwrap(await api.get('/patient/appointments')),
  createAppointment: async (input: CreateAppointmentInput): Promise<AppointmentBookingResult> =>
    unwrap(await api.post('/patient/appointments', input)),

  // Dashboard & hồ sơ
  getDashboard: async (): Promise<PatientDashboardData> =>
    unwrap(await api.get('/patient/dashboard')),
  getHealthRecords: async (): Promise<PatientHealthRecordsData> =>
    unwrap(await api.get('/patient/health-records')),

  // Payments
  getPayments: async (): Promise<PatientPaymentsData> => unwrap(await api.get('/patient/payments')),
  payInvoice: async (invoiceId: string, method: DepositPaymentMethod): Promise<void> => {
    await api.post(`/patient/payments/${invoiceId}/pay`, { method });
  },

  // Reviews
  getReviews: async (): Promise<PatientReviewsData> => unwrap(await api.get('/patient/reviews')),
  submitReview: async (payload: SubmitReviewPayload): Promise<ServiceReview> =>
    unwrap(await api.post('/patient/reviews', payload)),

  // Notifications
  getNotifications: async (): Promise<PatientNotificationsData> =>
    unwrap(await api.get('/patient/notifications')),
  markNotificationsRead: async (body?: { id?: string; ids?: string[] }): Promise<void> => {
    await api.patch('/patient/notifications/read', body ?? {});
  },
};
