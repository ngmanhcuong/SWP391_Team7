import { Baby, Bone, Eye, Heart, LucideIcon } from 'lucide-react';
import {
  CLINIC_SPECIALTIES,
  getClinicSpecialtyById,
  getClinicSpecialtyByName,
} from '../../../constants/clinicSpecialties';

export interface MedicalSpecialty {
  id: string;
  name: string;
  departmentLabel: string;
  doctorCount: number;
  consultationFee?: number;
  depositAmount?: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

const SPECIALTY_PRESENTATION: Record<
  string,
  Pick<MedicalSpecialty, 'icon' | 'iconColor' | 'iconBg' | 'doctorCount'>
> = {
  cardiology: {
    doctorCount: 0,
    icon: Heart,
    iconColor: '#ef4444',
    iconBg: '#fef2f2',
  },
  musculoskeletal: {
    doctorCount: 0,
    icon: Bone,
    iconColor: '#8b5cf6',
    iconBg: '#f5f3ff',
  },
  'obstetrics-pediatrics': {
    doctorCount: 0,
    icon: Baby,
    iconColor: '#ec4899',
    iconBg: '#fdf2f8',
  },
  ophthalmology: {
    doctorCount: 0,
    icon: Eye,
    iconColor: '#0ea5e9',
    iconBg: '#f0f9ff',
  },
};

export const MEDICAL_SPECIALTIES: MedicalSpecialty[] = CLINIC_SPECIALTIES.map((item) => ({
  id: item.id,
  name: item.name,
  departmentLabel: item.departmentLabel,
  ...SPECIALTY_PRESENTATION[item.id],
}));

export const getSpecialtyByName = (name: string): MedicalSpecialty | undefined =>
  MEDICAL_SPECIALTIES.find((item) => item.name === name)
  ?? (() => {
    const normalized = getClinicSpecialtyByName(name);
    return normalized
      ? MEDICAL_SPECIALTIES.find((item) => item.id === normalized.id)
      : undefined;
  })();

export const getSpecialtyById = (id: string): MedicalSpecialty | undefined => {
  const base = getClinicSpecialtyById(id);
  if (!base) return undefined;
  return MEDICAL_SPECIALTIES.find((item) => item.id === base.id);
};

export const getSpecialtyPresentation = (id: string) =>
  SPECIALTY_PRESENTATION[id] ?? {
    doctorCount: 0,
    icon: Heart,
    iconColor: '#ef4444',
    iconBg: '#fef2f2',
  };
