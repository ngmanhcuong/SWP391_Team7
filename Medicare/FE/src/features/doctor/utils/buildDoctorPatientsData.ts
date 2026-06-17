import {
  DoctorPatientListItem,
  PatientListData,
  PatientListFilters,
} from '../types';
import { DOCTOR_PATIENT_REGISTRY, getDoctorPatientTotalCount } from './doctorPatientRegistry';

export { DOCTOR_PATIENT_REGISTRY };

export const buildDoctorPatientsData = (): PatientListData => ({
  patients: [...DOCTOR_PATIENT_REGISTRY],
  totalCount: getDoctorPatientTotalCount(),
  summary: {
    totalManaged: 1248,
    totalTrend: '+12% so với tháng trước',
    newThisWeek: 42,
    weeklyChart: [4, 7, 5, 9, 6, 8, 3],
    waitingReExam: 15,
  },
});

export const filterPatients = (
  patients: DoctorPatientListItem[],
  filters: PatientListFilters,
): DoctorPatientListItem[] => {
  const code = filters.patientCode.trim().toLowerCase();
  const name = filters.fullName.trim().toLowerCase();
  const phone = filters.phone.trim();

  return patients.filter((patient) => {
    const matchCode = !code || patient.patientCode.toLowerCase().includes(code);
    const matchName = !name || patient.fullName.toLowerCase().includes(name);
    const matchPhone = !phone || patient.phone.includes(phone);
    return matchCode && matchName && matchPhone;
  });
};

export const PAGE_SIZE = 10;

export const paginatePatients = (
  patients: DoctorPatientListItem[],
  page: number,
  pageSize = PAGE_SIZE,
): DoctorPatientListItem[] => {
  const start = (page - 1) * pageSize;
  return patients.slice(start, start + pageSize);
};

export const getTotalPages = (totalItems: number, pageSize = PAGE_SIZE): number =>
  Math.max(1, Math.ceil(totalItems / pageSize));
