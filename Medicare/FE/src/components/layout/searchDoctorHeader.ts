import { DOCTOR_PATIENT_REGISTRY } from '../../features/doctor/utils/doctorPatientRegistry';
import { buildDoctorScheduleData } from '../../features/doctor/utils/buildDoctorScheduleData';
import { DOCTOR_PATHS } from '../../features/doctor/utils/doctorPaths';
import { DoctorSearchResult } from '../../features/doctor/types';

const normalize = (value: string): string => value.trim().toLowerCase();

export const searchDoctorHeader = (query: string, limit = 8): DoctorSearchResult[] => {
  const normalized = normalize(query);
  if (normalized.length < 2) return [];

  const patientResults: DoctorSearchResult[] = DOCTOR_PATIENT_REGISTRY.filter(
    (patient) =>
      normalize(patient.fullName).includes(normalized) ||
      normalize(patient.patientCode).includes(normalized) ||
      patient.phone.includes(normalized),
  )
    .slice(0, 5)
    .map((patient) => ({
      id: `patient-${patient.id}`,
      type: 'patient' as const,
      title: patient.fullName,
      subtitle: patient.patientCode,
      meta: `${patient.gender} · ${patient.age} tuổi`,
      href: DOCTOR_PATHS.record(patient.id),
    }));

  const schedule = buildDoctorScheduleData();
  const appointmentResults: DoctorSearchResult[] = schedule.appointments
    .filter(
      (appt) =>
        appt.status !== 'cancelled' &&
        (normalize(appt.patientName).includes(normalized) ||
          normalize(appt.department).includes(normalized) ||
          appt.time.includes(normalized)),
    )
    .slice(0, 4)
    .map((appt) => ({
      id: `appt-${appt.id}`,
      type: 'appointment' as const,
      title: appt.patientName,
      subtitle: `${appt.time} · ${appt.department}`,
      meta: appt.patientNote,
      href: appt.patientId ? DOCTOR_PATHS.record(appt.patientId) : DOCTOR_PATHS.schedule,
    }));

  return [...patientResults, ...appointmentResults].slice(0, limit);
};
