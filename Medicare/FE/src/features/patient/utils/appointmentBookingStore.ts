import { StoredAppointmentBooking } from '../types';

const STORAGE_KEY = 'medicare_pending_appointments';

export const savePendingAppointment = (booking: StoredAppointmentBooking): void => {
  const existing = getPendingAppointments();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([booking, ...existing]));
};

export const getPendingAppointments = (): StoredAppointmentBooking[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredAppointmentBooking[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getPendingDepositConfirmations = (): StoredAppointmentBooking[] =>
  getPendingAppointments().filter(
    (item) => item.status === 'pending_reception_deposit' && !item.receptionDepositConfirmed,
  );

export const getPendingDoctorConfirmations = (): StoredAppointmentBooking[] =>
  getPendingAppointments().filter(
    (item) => item.status === 'pending_doctor_confirm' && !item.doctorConfirmed,
  );
