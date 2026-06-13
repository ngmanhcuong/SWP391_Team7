export interface User {
  id: string;
  _id?: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  nationalId?: string;
  emergencyPhone?: string;
  occupation?: string;
  bio?: string;
  height?: number;
  weight?: number;
  isEmailVerified?: boolean;
  healthScore?: number;
  role: 'patient' | 'doctor' | 'admin';
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  experience: string;
  hospital?: string;
  price?: number;
  isAvailable?: boolean;
}

export interface Specialty {
  id: string;
  name: string;
  icon: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  type: 'online' | 'offline';
  notes?: string;
  doctor?: Doctor;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileUpdateData {
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  nationalId?: string;
  bio?: string;
  occupation?: string;
  emergencyPhone?: string;
  height?: number | string;
  weight?: number | string;
}

export interface SystemSettings {
  language: string;
  dataSharing: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  subscriptionPlan: string;
}
