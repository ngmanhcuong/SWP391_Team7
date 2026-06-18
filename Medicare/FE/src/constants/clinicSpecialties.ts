export const CLINIC_SPECIALTIES = [
  { id: 'cardiology', name: 'Tim mạch', departmentLabel: 'Khoa Tim mạch' },
  { id: 'musculoskeletal', name: 'Cơ xương khớp', departmentLabel: 'Khoa Cơ xương khớp' },
  { id: 'obstetrics-pediatrics', name: 'Sản & Nhi', departmentLabel: 'Khoa Sản & Nhi' },
  { id: 'ophthalmology', name: 'Mắt', departmentLabel: 'Khoa Mắt' },
] as const;

export type ClinicSpecialtyId = (typeof CLINIC_SPECIALTIES)[number]['id'];
export type ClinicSpecialtyName = (typeof CLINIC_SPECIALTIES)[number]['name'];

export const CLINIC_SPECIALTY_NAMES: ClinicSpecialtyName[] = CLINIC_SPECIALTIES.map(
  (item) => item.name,
);

export const DEFAULT_CLINIC_SPECIALTY: ClinicSpecialtyName = 'Tim mạch';

export const DOCTOR_SPECIALTY_OPTIONS = [...CLINIC_SPECIALTY_NAMES];

const LEGACY_SPECIALTY_MAP: Record<string, ClinicSpecialtyName> = {
  'Nội tổng quát': 'Tim mạch',
  'Khoa Nội tổng quát': 'Tim mạch',
  'Khoa Nội': 'Tim mạch',
  'Nội tim mạch': 'Tim mạch',
  'Khoa Tim Mạch': 'Tim mạch',
  'Nội tiết': 'Tim mạch',
  'Ngoại tổng quát': 'Cơ xương khớp',
  'Khoa Ngoại': 'Cơ xương khớp',
  'Nhi khoa': 'Sản & Nhi',
  'Da liễu': 'Mắt',
  'Thần kinh': 'Tim mạch',
};

export const getClinicSpecialtyById = (id: string) =>
  CLINIC_SPECIALTIES.find((item) => item.id === id);

export const getClinicSpecialtyByName = (name: string) =>
  CLINIC_SPECIALTIES.find((item) => item.name === name);

export const normalizeSpecialtyName = (value?: string | null): ClinicSpecialtyName => {
  if (!value?.trim()) return DEFAULT_CLINIC_SPECIALTY;

  const trimmed = value.trim();
  const direct = getClinicSpecialtyByName(trimmed);
  if (direct) return direct.name;

  const legacy = LEGACY_SPECIALTY_MAP[trimmed];
  if (legacy) return legacy;

  const stripped = trimmed.replace(/^khoa\s+/i, '').trim();
  const fromLabel = getClinicSpecialtyByName(stripped);
  if (fromLabel) return fromLabel.name;

  const legacyStripped = LEGACY_SPECIALTY_MAP[stripped];
  if (legacyStripped) return legacyStripped;

  return DEFAULT_CLINIC_SPECIALTY;
};

export const getDepartmentLabel = (value?: string | null): string => {
  const specialtyName = normalizeSpecialtyName(value);
  return getClinicSpecialtyByName(specialtyName)?.departmentLabel ?? `Khoa ${specialtyName}`;
};

export const formatDoctorDepartment = (occupation?: string | null): string =>
  getDepartmentLabel(occupation);

export const pickClinicSpecialtyByIndex = (index: number): ClinicSpecialtyName =>
  CLINIC_SPECIALTY_NAMES[index % CLINIC_SPECIALTY_NAMES.length];

export const getDepartmentLabelByIndex = (index: number): string =>
  getDepartmentLabel(pickClinicSpecialtyByIndex(index));
