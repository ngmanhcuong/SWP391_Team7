import {
  ScheduleTimeFilter,
  TodayAppointment,
  TodayAppointmentStatus,
  TodayAppointmentType,
  TodayScheduleStats,
} from '../types';

export const formatVietnameseDate = (date: Date): string => {
  const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const weekday = weekdays[date.getDay()];
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${weekday}, ngày ${day} tháng ${month}, ${year}`;
};

export const formatShortDateLabel = (date: Date): string => {
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${weekdays[date.getDay()]}, ${day}/${month}/${date.getFullYear()}`;
};

export const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const sortAppointmentsByTime = (appointments: TodayAppointment[]): TodayAppointment[] =>
  [...appointments].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

export const countByStatus = (
  appointments: TodayAppointment[],
  status: TodayAppointmentStatus | 'all',
): number => {
  if (status === 'all') return appointments.length;
  return appointments.filter((appt) => appt.status === status).length;
};

export const getActiveAppointments = (appointments: TodayAppointment[]): TodayAppointment[] =>
  appointments.filter((appt) => appt.status !== 'cancelled');

export const buildStatusCounts = (
  appointments: TodayAppointment[],
): Record<TodayAppointmentStatus | 'all', number> => ({
  all: getActiveAppointments(appointments).length,
  waiting: countByStatus(appointments, 'waiting'),
  confirmed: countByStatus(appointments, 'confirmed'),
  completed: countByStatus(appointments, 'completed'),
  cancelled: countByStatus(appointments, 'cancelled'),
});

export const filterAppointmentsByStatus = (
  appointments: TodayAppointment[],
  status: TodayAppointmentStatus | 'all',
): TodayAppointment[] => {
  if (status === 'all') return getActiveAppointments(appointments);
  return appointments.filter((appt) => appt.status === status);
};

export const buildScheduleStats = (appointments: TodayAppointment[]): TodayScheduleStats => {
  const active = getActiveAppointments(appointments);
  const waiting = appointments.filter((appt) => appt.status === 'waiting');

  return {
    total: active.length,
    completed: countByStatus(appointments, 'completed'),
    waiting: waiting.length,
    waitingPatientNames: waiting.slice(0, 3).map((appt) => appt.patientName.split(' ').slice(-1)[0]),
  };
};

export const TIME_SLOT_LABELS: Record<ScheduleTimeFilter, string> = {
  all: 'Cả ngày',
  morning: 'Buổi sáng',
  afternoon: 'Buổi chiều',
  evening: 'Buổi tối',
};

export const TIME_SLOT_RANGES: Record<Exclude<ScheduleTimeFilter, 'all'>, string> = {
  morning: '08:00 – 12:00',
  afternoon: '13:30 – 17:30',
  evening: '18:00 – 21:00',
};

export const APPOINTMENT_TYPE_CONFIG: Record<
  TodayAppointmentType,
  { label: string; className: string }
> = {
  new: {
    label: 'Khám mới',
    className: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
  },
  followup: {
    label: 'Tái khám',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  },
};

export const APPOINTMENT_STATUS_CONFIG: Record<
  TodayAppointmentStatus,
  { label: string; className: string; dotClassName: string }
> = {
  waiting: {
    label: 'Chờ khám',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
    dotClassName: 'bg-amber-500',
  },
  confirmed: {
    label: 'Đã xác nhận',
    className: 'bg-[#e8f0fe] text-[#003d9b] ring-1 ring-[#003d9b]/10',
    dotClassName: 'bg-[#003d9b]',
  },
  completed: {
    label: 'Hoàn thành',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
    dotClassName: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Đã hủy',
    className: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
    dotClassName: 'bg-gray-400',
  },
};

export const getScheduleProgress = (appointments: TodayAppointment[]) => {
  const active = getActiveAppointments(appointments);
  const completed = countByStatus(appointments, 'completed');
  const pending = active.filter(
    (appt) => appt.status === 'waiting' || appt.status === 'confirmed',
  ).length;

  return {
    total: active.length,
    completed,
    pending,
    percent: active.length ? Math.round((completed / active.length) * 100) : 0,
  };
};

export const groupAppointmentsByTimeSlot = (
  appointments: TodayAppointment[],
): { slot: Exclude<ScheduleTimeFilter, 'all'>; label: string; range: string; items: TodayAppointment[] }[] => {
  const slots: Exclude<ScheduleTimeFilter, 'all'>[] = ['morning', 'afternoon', 'evening'];

  return slots
    .map((slot) => ({
      slot,
      label: TIME_SLOT_LABELS[slot],
      range: TIME_SLOT_RANGES[slot],
      items: sortAppointmentsByTime(appointments.filter((appt) => appt.timeSlot === slot)),
    }))
    .filter((group) => group.items.length > 0);
};

export const buildMonthCalendarWeeks = (year: number, month: number): (number | null)[][] => {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: (number | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  return weeks;
};

export const formatMonthLabel = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `Tháng ${month}, ${date.getFullYear()}`;
};

export const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const isSameDay = (left: Date, right: Date): boolean =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

export const startOfWeekMonday = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const endOfWeekSunday = (date: Date): Date => {
  const start = startOfWeekMonday(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const getWeekDays = (referenceDate: Date): Date[] => {
  const start = startOfWeekMonday(referenceDate);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

export const formatWeekRangeLabel = (referenceDate: Date): string => {
  const start = startOfWeekMonday(referenceDate);
  const end = endOfWeekSunday(referenceDate);
  const startDay = start.getDate().toString().padStart(2, '0');
  const endDay = end.getDate().toString().padStart(2, '0');
  const startMonth = (start.getMonth() + 1).toString().padStart(2, '0');
  const endMonth = (end.getMonth() + 1).toString().padStart(2, '0');
  if (start.getMonth() === end.getMonth()) {
    return `${startDay} – ${endDay}/${startMonth}/${start.getFullYear()}`;
  }
  return `${startDay}/${startMonth} – ${endDay}/${endMonth}/${end.getFullYear()}`;
};

export const WEEKDAY_SHORT_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export const getWeekdayShortLabel = (date: Date): string =>
  WEEKDAY_SHORT_LABELS[(date.getDay() + 6) % 7];

export interface WeekDaySummary {
  waiting: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  total: number;
}

export const summarizeAppointments = (
  appointments: { status: TodayAppointmentStatus }[],
): WeekDaySummary => ({
  total: appointments.filter((appt) => appt.status !== 'cancelled').length,
  waiting: appointments.filter((appt) => appt.status === 'waiting').length,
  confirmed: appointments.filter((appt) => appt.status === 'confirmed').length,
  completed: appointments.filter((appt) => appt.status === 'completed').length,
  cancelled: appointments.filter((appt) => appt.status === 'cancelled').length,
});

export const formatDayShortLabel = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${getWeekdayShortLabel(date)} ${day}/${month}`;
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};
