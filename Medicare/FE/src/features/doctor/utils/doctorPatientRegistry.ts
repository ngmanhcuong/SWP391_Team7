import { DoctorPatientListItem, DoctorPatientExtendedInfo, NewPatientFormData, PatientHealthStatus, WaitingPatient } from '../types';
import { calculateAgeFromDob, parseCommaSeparatedList } from './newPatientForm';

export const DOCTOR_PATIENT_REGISTRY: DoctorPatientListItem[] = [
  {
    id: '1',
    patientCode: 'BN2024-001',
    fullName: 'Trần Văn Phong',
    gender: 'Nam',
    age: 45,
    phone: '0901234567',
    lastVisit: 'Hôm nay',
    healthStatus: 'waiting',
  },
  {
    id: '2',
    patientCode: 'BN2024-002',
    fullName: 'Nguyễn Thị Lan',
    gender: 'Nữ',
    age: 32,
    phone: '0912345678',
    lastVisit: 'Hôm nay',
    healthStatus: 'stable',
  },
  {
    id: '3',
    patientCode: 'BN2024-003',
    fullName: 'Lê Minh Tuấn',
    gender: 'Nam',
    age: 58,
    phone: '0923456789',
    lastVisit: '22/05/2024',
    healthStatus: 'monitoring',
  },
  {
    id: '4',
    patientCode: 'BN2024-004',
    fullName: 'Phạm Thị Hoa',
    gender: 'Nữ',
    age: 41,
    phone: '0934567890',
    lastVisit: '20/05/2024',
    healthStatus: 'stable',
  },
  {
    id: '5',
    patientCode: 'BN2024-005',
    fullName: 'Hoàng Văn Đức',
    gender: 'Nam',
    age: 67,
    phone: '0945678901',
    lastVisit: '18/05/2024',
    healthStatus: 'monitoring',
  },
  {
    id: '6',
    patientCode: 'BN2024-006',
    fullName: 'Võ Thị Mai',
    gender: 'Nữ',
    age: 29,
    phone: '0956789012',
    lastVisit: '15/05/2024',
    healthStatus: 'stable',
  },
  {
    id: '7',
    patientCode: 'BN2024-007',
    fullName: 'Đặng Văn Hùng',
    gender: 'Nam',
    age: 52,
    phone: '0967890123',
    lastVisit: '12/05/2024',
    healthStatus: 'waiting',
  },
  {
    id: '8',
    patientCode: 'BN2024-008',
    fullName: 'Bùi Thị Ngọc',
    gender: 'Nữ',
    age: 36,
    phone: '0978901234',
    lastVisit: '10/05/2024',
    healthStatus: 'stable',
  },
  {
    id: '9',
    patientCode: 'BN2024-009',
    fullName: 'Ngô Văn Thành',
    gender: 'Nam',
    age: 44,
    phone: '0989012345',
    lastVisit: '08/05/2024',
    healthStatus: 'monitoring',
  },
  {
    id: '10',
    patientCode: 'BN2024-010',
    fullName: 'Đinh Thị Thu',
    gender: 'Nữ',
    age: 55,
    phone: '0990123456',
    lastVisit: '05/05/2024',
    healthStatus: 'stable',
  },
  {
    id: '11',
    patientCode: 'BN2024-011',
    fullName: 'Phan Văn Khoa',
    gender: 'Nam',
    age: 38,
    phone: '0901122334',
    lastVisit: '03/05/2024',
    healthStatus: 'waiting',
  },
  {
    id: '12',
    patientCode: 'BN2024-012',
    fullName: 'Trương Thị Hằng',
    gender: 'Nữ',
    age: 48,
    phone: '0902233445',
    lastVisit: '01/05/2024',
    healthStatus: 'stable',
  },
];

const DOCTOR_PATIENT_EXTENDED_REGISTRY = new Map<string, DoctorPatientExtendedInfo>();

const BASE_REGISTRY_SIZE = 12;
const BASE_TOTAL_COUNT = 248;

export const getDoctorPatientExtendedInfo = (
  patientId: string,
): DoctorPatientExtendedInfo | undefined =>
  DOCTOR_PATIENT_EXTENDED_REGISTRY.get(patientId);

const generateNextPatientId = (): string => {
  const maxId = DOCTOR_PATIENT_REGISTRY.reduce(
    (max, patient) => Math.max(max, Number(patient.id)),
    0,
  );
  return String(maxId + 1);
};

const generateNextPatientCode = (): string => {
  const year = new Date().getFullYear();
  const nextNumber = DOCTOR_PATIENT_REGISTRY.length + 1;
  return `BN${year}-${nextNumber.toString().padStart(3, '0')}`;
};

const normalizePhone = (phone: string): string => phone.replace(/\D/g, '');

export const registerDoctorPatient = (form: NewPatientFormData): DoctorPatientListItem => {
  const id = generateNextPatientId();
  const patientCode = generateNextPatientCode();
  const age = calculateAgeFromDob(form.dateOfBirth) ?? 0;

  const patient: DoctorPatientListItem = {
    id,
    patientCode,
    fullName: form.fullName.trim(),
    gender: form.gender as 'Nam' | 'Nữ',
    age,
    phone: normalizePhone(form.phone),
    lastVisit: 'Hôm nay',
    healthStatus: form.healthStatus,
  };

  DOCTOR_PATIENT_REGISTRY.push(patient);

  DOCTOR_PATIENT_EXTENDED_REGISTRY.set(id, {
    patientId: id,
    dateOfBirth: form.dateOfBirth.trim(),
    nationalId: form.nationalId.trim(),
    email: form.email.trim(),
    address: form.address.trim(),
    province: form.province.trim(),
    emergencyContactName: form.emergencyContactName.trim(),
    emergencyContactPhone: normalizePhone(form.emergencyContactPhone),
    insuranceNumber: form.insuranceNumber.trim(),
    insuranceStatus: form.insuranceStatus === 'active' ? 'active' : 'inactive',
    allergies: parseCommaSeparatedList(form.allergies),
    medicalHistory: parseCommaSeparatedList(form.medicalHistory),
    clinicalNotes: form.clinicalNotes.trim(),
    bloodType: form.bloodType.trim(),
  });

  if (form.healthStatus === 'waiting' && !WAITING_QUEUE_ORDER.includes(id)) {
    WAITING_QUEUE_ORDER.push(id);
  }

  return patient;
};

export const getDoctorPatientTotalCount = (): number =>
  BASE_TOTAL_COUNT + (DOCTOR_PATIENT_REGISTRY.length - BASE_REGISTRY_SIZE);

const WAITING_QUEUE_ORDER = ['1', '7', '11'];
const QUEUE_NUMBER_BASE = 11;

export const getPatientQueueNumber = (patientId: string): number | undefined => {
  const index = WAITING_QUEUE_ORDER.indexOf(patientId);
  return index >= 0 ? QUEUE_NUMBER_BASE + index : undefined;
};

export const getDoctorPatientById = (patientId: string): DoctorPatientListItem | undefined =>
  DOCTOR_PATIENT_REGISTRY.find((patient) => patient.id === patientId);

export const findDoctorPatientByName = (name: string): DoctorPatientListItem | undefined => {
  const normalized = name.trim().toLowerCase();
  return DOCTOR_PATIENT_REGISTRY.find(
    (patient) => patient.fullName.toLowerCase() === normalized,
  );
};

export const resolveDoctorPatientId = (
  patientId?: string,
  patientName?: string,
): string | undefined => {
  if (patientId) {
    return patientId;
  }
  if (patientName) {
    return findDoctorPatientByName(patientName)?.id;
  }
  return undefined;
};

export const getDefaultMedicalRecordPatientId = (): string | undefined => {
  for (const id of WAITING_QUEUE_ORDER) {
    const patient = getDoctorPatientById(id);
    if (patient?.healthStatus === 'waiting') {
      return id;
    }
  }
  return DOCTOR_PATIENT_REGISTRY.find((patient) => patient.healthStatus === 'waiting')?.id;
};

export const getNextWaitingPatientId = (currentPatientId: string): string | undefined => {
  const currentIndex = WAITING_QUEUE_ORDER.indexOf(currentPatientId);
  const searchOrder =
    currentIndex >= 0
      ? [...WAITING_QUEUE_ORDER.slice(currentIndex + 1), ...WAITING_QUEUE_ORDER.slice(0, currentIndex)]
      : WAITING_QUEUE_ORDER;

  for (const id of searchOrder) {
    if (id === currentPatientId) continue;
    const patient = getDoctorPatientById(id);
    if (patient?.healthStatus === 'waiting') {
      return id;
    }
  }

  return DOCTOR_PATIENT_REGISTRY.find(
    (patient) => patient.id !== currentPatientId && patient.healthStatus === 'waiting',
  )?.id;
};

export const buildWaitingPatientsForRecord = (currentPatientId: string): WaitingPatient[] =>
  WAITING_QUEUE_ORDER.filter((id) => id !== currentPatientId)
    .map((id) => getDoctorPatientById(id))
    .filter((patient): patient is DoctorPatientListItem => Boolean(patient))
    .filter((patient) => patient.healthStatus === 'waiting')
    .map((patient) => ({
      id: `queue-${patient.id}`,
      patientId: patient.id,
      name: patient.fullName,
      queueNumber: getPatientQueueNumber(patient.id) ?? 0,
    }));

export const getPatientsByHealthStatus = (
  status: PatientHealthStatus,
): DoctorPatientListItem[] =>
  DOCTOR_PATIENT_REGISTRY.filter((patient) => patient.healthStatus === status);
