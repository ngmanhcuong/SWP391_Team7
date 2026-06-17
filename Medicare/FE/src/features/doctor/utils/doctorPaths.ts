export const DOCTOR_PATHS = {
  dashboard: '/doctor',
  schedule: '/doctor/lich-kham',
  patients: '/doctor/benh-nhan',
  records: '/doctor/benh-an',
  record: (patientId: string) => `/doctor/benh-an/${patientId}`,
  settings: '/doctor/cai-dat',
} as const;
