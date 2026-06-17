import { DoctorProfileSettings, DoctorSettingsData } from '../types';
import { User } from '../../../types';

const DEFAULT_BIOGRAPHY =
  'Với hơn 15 năm kinh nghiệm trong lĩnh vực Nội khoa, BS. Nguyễn Văn An tốt nghiệp Đại học Y Dược TP.HCM và từng công tác tại các bệnh viện lớn ở Việt Nam và Singapore. Chuyên điều trị các bệnh lý nội khoa phức tạp và tư vấn chế độ dinh dưỡng, sinh hoạt cho bệnh nhân mãn tính.';

export const DOCTOR_SPECIALTIES = [
  'Nội tổng quát',
  'Ngoại tổng quát',
  'Tim mạch',
  'Nhi khoa',
  'Da liễu',
  'Thần kinh',
] as const;

export const buildDoctorProfileFromUser = (user: User): DoctorProfileSettings => ({
  fullName: user.fullName.replace(/^Bác sĩ\s+|^BS\.\s*/i, '').trim() || user.fullName,
  specialty: user.occupation || 'Nội tổng quát',
  phone: user.phone || '0901 234 567',
  email: user.email || 'an.nguyen@medcare.vn',
  biography: user.bio || DEFAULT_BIOGRAPHY,
  doctorId: `DOC-${(user.id || user._id || '0283').toString().slice(-4).padStart(4, '0')}`,
  status: 'active',
});

const weekdaySlots = { morning: true, afternoon: true, evening: false };
const weekendSlots = { morning: true, afternoon: false, evening: false };

export const DEFAULT_DOCTOR_PROFILE: DoctorProfileSettings = {
  fullName: 'Nguyễn Văn An',
  specialty: 'Nội tổng quát',
  phone: '0901 234 567',
  email: 'an.nguyen@medcare.vn',
  biography: DEFAULT_BIOGRAPHY,
  doctorId: 'DOC-0283',
  status: 'active',
};

export const DEFAULT_DOCTOR_SETTINGS: DoctorSettingsData = {
  profile: DEFAULT_DOCTOR_PROFILE,
  workSchedule: {
    applyToAllWeeks: true,
    weeklySchedule: [
      { day: 'mon', dayLabel: 'Thứ 2', slots: { ...weekdaySlots } },
      { day: 'tue', dayLabel: 'Thứ 3', slots: { ...weekdaySlots } },
      { day: 'wed', dayLabel: 'Thứ 4', slots: { ...weekdaySlots } },
      { day: 'thu', dayLabel: 'Thứ 5', slots: { ...weekdaySlots } },
      { day: 'fri', dayLabel: 'Thứ 6', slots: { ...weekdaySlots } },
      { day: 'sat', dayLabel: 'Thứ 7', slots: { ...weekendSlots } },
      { day: 'sun', dayLabel: 'Chủ nhật', slots: { ...weekendSlots } },
    ],
    consultationMinutes: 15,
    customConsultationMinutes: '',
    holidays: [
      {
        id: 'holiday-1',
        title: 'Nghỉ Tết Nguyên Đán',
        startDate: '16/02/2026',
        endDate: '22/02/2026',
        type: 'holiday',
      },
      {
        id: 'holiday-2',
        title: 'Nghỉ Giỗ Tổ Hùng Vương',
        startDate: '26/04/2026',
        type: 'holiday',
      },
    ],
  },
  notifications: {
    email: true,
    sms: false,
    pushNotifications: true,
    newAppointment: true,
    patientCancelAppointment: true,
    newMessage: true,
    shiftReminder: false,
  },
};
