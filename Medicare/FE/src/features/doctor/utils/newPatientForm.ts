import { NewPatientFormData, NewPatientFormErrors } from '../types';

export const EMPTY_NEW_PATIENT_FORM: NewPatientFormData = {
  fullName: '',
  gender: '',
  dateOfBirth: '',
  nationalId: '',
  bloodType: '',
  phone: '',
  email: '',
  address: '',
  province: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  insuranceNumber: '',
  insuranceStatus: 'none',
  allergies: '',
  medicalHistory: '',
  clinicalNotes: '',
  healthStatus: 'waiting',
};

const DOB_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export const calculateAgeFromDob = (dateOfBirth: string): number | null => {
  const match = dateOfBirth.trim().match(DOB_PATTERN);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - (month - 1);
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age -= 1;
  }
  return age >= 0 ? age : null;
};

export const parseCommaSeparatedList = (value: string): string[] =>
  value
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter(Boolean);

export const validateNewPatientForm = (form: NewPatientFormData): NewPatientFormErrors => {
  const errors: NewPatientFormErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên bệnh nhân';
  } else if (form.fullName.trim().split(/\s+/).length < 2) {
    errors.fullName = 'Nhập đầy đủ họ và tên (ít nhất 2 từ)';
  }

  if (!form.gender) {
    errors.gender = 'Vui lòng chọn giới tính';
  }

  if (!form.dateOfBirth.trim()) {
    errors.dateOfBirth = 'Vui lòng nhập ngày sinh (DD/MM/YYYY)';
  } else if (calculateAgeFromDob(form.dateOfBirth) === null) {
    errors.dateOfBirth = 'Ngày sinh không hợp lệ (định dạng DD/MM/YYYY)';
  }

  const phoneDigits = form.phone.replace(/\D/g, '');
  if (!phoneDigits) {
    errors.phone = 'Vui lòng nhập số điện thoại';
  } else if (phoneDigits.length < 9 || phoneDigits.length > 11) {
    errors.phone = 'Số điện thoại phải có 9–11 chữ số';
  }

  if (!form.address.trim()) {
    errors.address = 'Vui lòng nhập địa chỉ liên hệ';
  }

  if (form.nationalId.trim() && !/^\d{9,12}$/.test(form.nationalId.replace(/\s/g, ''))) {
    errors.nationalId = 'CCCD/CMND phải có 9–12 chữ số';
  }

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Email không hợp lệ';
  }

  if (form.emergencyContactPhone.trim()) {
    const emergencyDigits = form.emergencyContactPhone.replace(/\D/g, '');
    if (!/^0\d{9}$/.test(emergencyDigits)) {
      errors.emergencyContactPhone = 'Số điện thoại liên hệ khẩn cấp không hợp lệ';
    }
  }

  if (form.insuranceStatus === 'active' && !form.insuranceNumber.trim()) {
    errors.insuranceNumber = 'Nhập số thẻ BHYT khi có bảo hiểm';
  }

  return errors;
};

export const hasFormErrors = (errors: NewPatientFormErrors): boolean =>
  Object.keys(errors).length > 0;
