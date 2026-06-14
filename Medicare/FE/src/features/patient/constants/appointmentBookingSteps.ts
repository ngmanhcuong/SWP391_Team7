import { AppointmentBookingStepInfo } from '../types';

export const APPOINTMENT_BOOKING_STEPS: AppointmentBookingStepInfo[] = [
  { step: 1, label: 'Triệu chứng' },
  { step: 2, label: 'Chuyên khoa' },
  { step: 3, label: 'Bác sĩ' },
  { step: 4, label: 'Thời gian' },
  { step: 5, label: 'Xác nhận' },
];

export const MIN_SYMPTOM_LENGTH = 10;
