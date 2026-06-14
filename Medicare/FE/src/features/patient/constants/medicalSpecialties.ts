import { Baby, Bone, Eye, Heart, LucideIcon } from 'lucide-react';

export interface MedicalSpecialty {
  id: string;
  name: string;
  doctorCount: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export const MEDICAL_SPECIALTIES: MedicalSpecialty[] = [
  {
    id: 'cardiology',
    name: 'Tim mạch',
    doctorCount: 12,
    icon: Heart,
    iconColor: '#ef4444',
    iconBg: '#fef2f2',
  },
  {
    id: 'musculoskeletal',
    name: 'Cơ xương khớp',
    doctorCount: 8,
    icon: Bone,
    iconColor: '#8b5cf6',
    iconBg: '#f5f3ff',
  },
  {
    id: 'obstetrics-pediatrics',
    name: 'Sản & Nhi',
    doctorCount: 15,
    icon: Baby,
    iconColor: '#ec4899',
    iconBg: '#fdf2f8',
  },
  {
    id: 'ophthalmology',
    name: 'Mắt',
    doctorCount: 6,
    icon: Eye,
    iconColor: '#0ea5e9',
    iconBg: '#f0f9ff',
  },
];

export const getSpecialtyByName = (name: string): MedicalSpecialty | undefined =>
  MEDICAL_SPECIALTIES.find((item) => item.name === name);

export const getSpecialtyById = (id: string): MedicalSpecialty | undefined =>
  MEDICAL_SPECIALTIES.find((item) => item.id === id);
