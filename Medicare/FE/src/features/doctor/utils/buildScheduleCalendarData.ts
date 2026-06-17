import {
  ScheduledAppointment,
  ScheduleTimeFilter,
  TodayAppointmentStatus,
  TodayAppointmentType,
} from '../types';
import { getDoctorScheduleAppointments } from './buildDoctorScheduleData';
import { resolveDoctorPatientId } from './doctorPatientRegistry';
import {
  getWeekDays,
  isSameDay,
  parseTimeToMinutes,
  toDateKey,
} from './scheduleUtils';

type DayTemplate = {
  offsetFromToday: number;
  items: {
    time: string;
    patientName: string;
    department: string;
    type: TodayAppointmentType;
    status: TodayAppointmentStatus;
    timeSlot: ScheduleTimeFilter;
    patientNote?: string;
  }[];
};

const OTHER_DAY_TEMPLATES: DayTemplate[] = [
  {
    offsetFromToday: -2,
    items: [
      { time: '08:30', patientName: 'Võ Thị Mai', department: 'Nội tim mạch', type: 'followup', status: 'completed', timeSlot: 'morning' },
      { time: '10:00', patientName: 'Bùi Thị Ngọc', department: 'Nội tiết', type: 'followup', status: 'completed', timeSlot: 'morning' },
      { time: '14:30', patientName: 'Ngô Văn Thành', department: 'Ngoại tổng quát', type: 'new', status: 'completed', timeSlot: 'afternoon' },
    ],
  },
  {
    offsetFromToday: -1,
    items: [
      { time: '09:00', patientName: 'Phạm Thị Hoa', department: 'Nội tiết', type: 'followup', status: 'completed', timeSlot: 'morning' },
      { time: '11:00', patientName: 'Lê Minh Tuấn', department: 'Nội tổng quát', type: 'new', status: 'completed', timeSlot: 'morning' },
      { time: '15:00', patientName: 'Đinh Thị Thu', department: 'Nội tiết', type: 'followup', status: 'completed', timeSlot: 'afternoon' },
      { time: '16:30', patientName: 'Trương Thị Hằng', department: 'Nội tổng quát', type: 'new', status: 'cancelled', timeSlot: 'afternoon', patientNote: 'Hủy do lịch trùng' },
    ],
  },
  {
    offsetFromToday: 1,
    items: [
      { time: '08:00', patientName: 'Nguyễn Thị Lan', department: 'Ngoại tổng quát', type: 'followup', status: 'confirmed', timeSlot: 'morning' },
      { time: '09:30', patientName: 'Hoàng Văn Đức', department: 'Nội tổng quát', type: 'new', status: 'confirmed', timeSlot: 'morning' },
      { time: '14:00', patientName: 'Võ Thị Mai', department: 'Nội tim mạch', type: 'followup', status: 'confirmed', timeSlot: 'afternoon' },
    ],
  },
  {
    offsetFromToday: 2,
    items: [
      { time: '08:30', patientName: 'Phan Văn Khoa', department: 'Nội tiết', type: 'followup', status: 'confirmed', timeSlot: 'morning' },
      { time: '10:30', patientName: 'Bùi Thị Ngọc', department: 'Nội tim mạch', type: 'followup', status: 'waiting', timeSlot: 'morning' },
      { time: '11:30', patientName: 'Ngô Văn Thành', department: 'Ngoại tổng quát', type: 'new', status: 'waiting', timeSlot: 'morning' },
      { time: '15:30', patientName: 'Đặng Văn Hùng', department: 'Nội tổng quát', type: 'followup', status: 'confirmed', timeSlot: 'afternoon' },
    ],
  },
  {
    offsetFromToday: 3,
    items: [
      { time: '09:00', patientName: 'Trần Văn Phong', department: 'Nội tim mạch', type: 'new', status: 'confirmed', timeSlot: 'morning' },
      { time: '13:30', patientName: 'Phạm Thị Hoa', department: 'Nội tiết', type: 'followup', status: 'confirmed', timeSlot: 'afternoon' },
    ],
  },
  {
    offsetFromToday: 4,
    items: [
      { time: '08:00', patientName: 'Lê Minh Tuấn', department: 'Nội tổng quát', type: 'new', status: 'confirmed', timeSlot: 'morning' },
    ],
  },
];

const buildTemplateAppointment = (
  date: Date,
  item: DayTemplate['items'][number],
  index: number,
): ScheduledAppointment => ({
  id: `w-${toDateKey(date)}-${index}`,
  date: toDateKey(date),
  time: item.time,
  patientName: item.patientName,
  patientNote: item.patientNote,
  department: item.department,
  type: item.type,
  status: item.status,
  timeSlot: item.timeSlot,
  patientId: resolveDoctorPatientId(undefined, item.patientName),
});

const buildTodayAppointments = (today: Date): ScheduledAppointment[] =>
  getDoctorScheduleAppointments().map((appt) => ({
    ...appt,
    date: toDateKey(today),
  }));

const buildWeekAppointments = (referenceDate: Date): ScheduledAppointment[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekDays = getWeekDays(referenceDate);
  const appointments: ScheduledAppointment[] = [];

  weekDays.forEach((day) => {
    if (isSameDay(day, today)) {
      appointments.push(...buildTodayAppointments(day));
      return;
    }

    const dayOffset = Math.round((day.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const template = OTHER_DAY_TEMPLATES.find((entry) => entry.offsetFromToday === dayOffset);
    if (!template) return;

    template.items.forEach((item, index) => {
      appointments.push(buildTemplateAppointment(day, item, index));
    });
  });

  return appointments.sort(
    (left, right) =>
      left.date.localeCompare(right.date) || parseTimeToMinutes(left.time) - parseTimeToMinutes(right.time),
  );
};

const MONTH_DAY_LOAD: Record<number, number> = {
  0: 0,
  1: 2,
  2: 4,
  3: 3,
  4: 5,
  5: 2,
  6: 1,
};

const MONTH_PATIENT_ROTATION = [
  'Trần Văn Phong',
  'Nguyễn Thị Lan',
  'Lê Minh Tuấn',
  'Phạm Thị Hoa',
  'Hoàng Văn Đức',
  'Võ Thị Mai',
  'Đặng Văn Hùng',
  'Bùi Thị Ngọc',
];

const MONTH_STATUSES: TodayAppointmentStatus[] = ['confirmed', 'waiting', 'completed', 'confirmed'];

const buildMonthAppointments = (year: number, month: number, today: Date): ScheduledAppointment[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const appointments: ScheduledAppointment[] = [];
  const todayKey = toDateKey(today);

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const dateKey = toDateKey(date);

    if (dateKey === todayKey) {
      appointments.push(...buildTodayAppointments(date));
      continue;
    }

    const weekday = date.getDay();
    const load = MONTH_DAY_LOAD[weekday];
    if (!load) continue;

    for (let index = 0; index < load; index += 1) {
      const hour = 8 + index * 2;
      const minute = index % 2 === 0 ? 0 : 30;
      const status = MONTH_STATUSES[(day + index) % MONTH_STATUSES.length];
      const patientName = MONTH_PATIENT_ROTATION[(day + index) % MONTH_PATIENT_ROTATION.length];

      appointments.push({
        id: `m-${dateKey}-${index}`,
        date: dateKey,
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        patientName,
        department: index % 2 === 0 ? 'Nội tổng quát' : 'Nội tim mạch',
        type: index % 3 === 0 ? 'new' : 'followup',
        status,
        timeSlot: hour < 12 ? 'morning' : 'afternoon',
        patientId: resolveDoctorPatientId(undefined, patientName),
      });
    }
  }

  return appointments.sort(
    (left, right) =>
      left.date.localeCompare(right.date) || parseTimeToMinutes(left.time) - parseTimeToMinutes(right.time),
  );
};

const matchesFilters = (
  appt: ScheduledAppointment,
  status: TodayAppointmentStatus | 'all',
  timeSlot: ScheduleTimeFilter,
): boolean => {
  const statusMatch = status === 'all' ? appt.status !== 'cancelled' : appt.status === status;
  const timeMatch = timeSlot === 'all' || appt.timeSlot === timeSlot;
  return statusMatch && timeMatch;
};

export const getCalendarAppointmentsForWeek = (
  referenceDate: Date,
  status: TodayAppointmentStatus | 'all',
  timeSlot: ScheduleTimeFilter,
): ScheduledAppointment[] => {
  const weekKeys = new Set(getWeekDays(referenceDate).map(toDateKey));
  return buildWeekAppointments(referenceDate).filter(
    (appt) => weekKeys.has(appt.date) && matchesFilters(appt, status, timeSlot),
  );
};

export const getCalendarAppointmentsForMonth = (
  year: number,
  month: number,
  status: TodayAppointmentStatus | 'all',
  timeSlot: ScheduleTimeFilter,
): ScheduledAppointment[] => {
  const today = new Date();
  return buildMonthAppointments(year, month, today).filter((appt) =>
    matchesFilters(appt, status, timeSlot),
  );
};

export const groupAppointmentsByDate = (
  appointments: ScheduledAppointment[],
): Record<string, ScheduledAppointment[]> =>
  appointments.reduce<Record<string, ScheduledAppointment[]>>((groups, appt) => {
    if (!groups[appt.date]) groups[appt.date] = [];
    groups[appt.date].push(appt);
    return groups;
  }, {});

export const getDayAppointmentSummary = (appointments: ScheduledAppointment[]) => {
  const active = appointments.filter((appt) => appt.status !== 'cancelled');
  return {
    total: active.length,
    waiting: appointments.filter((appt) => appt.status === 'waiting').length,
    confirmed: appointments.filter((appt) => appt.status === 'confirmed').length,
    completed: appointments.filter((appt) => appt.status === 'completed').length,
    cancelled: appointments.filter((appt) => appt.status === 'cancelled').length,
  };
};
