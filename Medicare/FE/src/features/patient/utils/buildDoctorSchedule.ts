import { AppointmentScheduleDay, AppointmentTimeSlot } from '../types';

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const MORNING_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
const AFTERNOON_SLOTS = ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const hashSeed = (doctorId: string, dateKey: string, time: string): number => {
  const raw = `${doctorId}-${dateKey}-${time}`;
  return raw.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
};

const buildSlotsForDate = (doctorId: string, dateKey: string): AppointmentTimeSlot[] => {
  const morning = MORNING_SLOTS.map((time) => ({
    id: `${dateKey}-${time}`,
    time,
    period: 'morning' as const,
    available: hashSeed(doctorId, dateKey, time) % 5 !== 0,
  }));

  const afternoon = AFTERNOON_SLOTS.map((time) => ({
    id: `${dateKey}-${time}`,
    time,
    period: 'afternoon' as const,
    available: hashSeed(doctorId, dateKey, time) % 4 !== 0,
  }));

  return [...morning, ...afternoon];
};

export const buildDoctorSchedule = (
  doctorId: string,
  monthOffset = 0,
  daysCount = 14,
): AppointmentScheduleDay[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() + monthOffset * 7);

  const days: AppointmentScheduleDay[] = [];

  for (let index = 0; index < daysCount; index += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + index);

    const dateKey = toDateKey(current);
    const isPast = current < today;
    const isSunday = current.getDay() === 0;
    const slots = isPast || isSunday ? [] : buildSlotsForDate(doctorId, dateKey);
    const hasAvailableSlots = slots.some((slot) => slot.available);

    days.push({
      date: dateKey,
      dayNumber: current.getDate(),
      weekdayLabel: WEEKDAY_LABELS[current.getDay()],
      isPast,
      hasAvailableSlots,
      slots,
    });
  }

  return days;
};

export const formatScheduleDate = (dateKey: string): string => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
};

export const formatScheduleDateShort = (dateKey: string): string => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
};

export const getMonthLabel = (days: AppointmentScheduleDay[]): string => {
  if (days.length === 0) return '';
  const [year, month] = days[0].date.split('-').map(Number);
  return new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  );
};
