export const DOCTOR_PATHS = {
  dashboard: '/doctor',
  schedule: '/doctor/lich-kham',
  patients: '/doctor/benh-nhan',
  records: '/doctor/benh-an',
  record: (patientId: string) => `/doctor/benh-an/${patientId}`,
  recordAppointment: (patientId: string, appointmentId: string) =>
    `/doctor/benh-an/${patientId}?appointmentId=${encodeURIComponent(appointmentId)}`,
  settings: '/doctor/cai-dat',
} as const;
