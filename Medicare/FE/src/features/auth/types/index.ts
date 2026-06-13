export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface VerifyOtpFormData {
  email: string;
  otp: string[];
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export type AuthStep = 'forgot' | 'verify-otp' | 'reset-password';
export type PasswordStrength = 'weak' | 'medium' | 'strong';
