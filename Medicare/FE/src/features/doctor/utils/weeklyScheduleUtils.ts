import { DaySchedule, TimeSlotKey } from '../types';

export const TIME_SLOT_CONFIG: { key: TimeSlotKey; label: string; time: string }[] = [
  { key: 'morning', label: 'Sáng', time: '08:00 – 12:00' },
  { key: 'afternoon', label: 'Chiều', time: '13:30 – 17:30' },
  { key: 'evening', label: 'Tối', time: '18:00 – 21:00' },
];

export type WeeklySchedulePreset = 'office' | 'full' | 'morning';

export type ColumnToggleState = 'none' | 'partial' | 'all';

const weekdaySlots = { morning: true, afternoon: true, evening: false };
const weekendSlots = { morning: true, afternoon: false, evening: false };
const fullSlots = { morning: true, afternoon: true, evening: true };
const morningOnlySlots = { morning: true, afternoon: false, evening: false };

export const countActiveSlots = (schedule: DaySchedule[]): number =>
  schedule.reduce(
    (total, day) => total + TIME_SLOT_CONFIG.filter((slot) => day.slots[slot.key]).length,
    0,
  );

export const countActiveDays = (schedule: DaySchedule[]): number =>
  schedule.filter((day) => TIME_SLOT_CONFIG.some((slot) => day.slots[slot.key])).length;

export const countDaySlots = (day: DaySchedule): number =>
  TIME_SLOT_CONFIG.filter((slot) => day.slots[slot.key]).length;

export const getColumnToggleState = (
  schedule: DaySchedule[],
  slot: TimeSlotKey,
): ColumnToggleState => {
  const enabledCount = schedule.filter((day) => day.slots[slot]).length;
  if (enabledCount === 0) return 'none';
  if (enabledCount === schedule.length) return 'all';
  return 'partial';
};

export const toggleColumnSlots = (
  schedule: DaySchedule[],
  slot: TimeSlotKey,
  enabled: boolean,
): DaySchedule[] =>
  schedule.map((day) => ({
    ...day,
    slots: { ...day.slots, [slot]: enabled },
  }));

export const applyWeeklySchedulePreset = (
  schedule: DaySchedule[],
  preset: WeeklySchedulePreset,
): DaySchedule[] =>
  schedule.map((day) => {
    const isWeekend = day.day === 'sat' || day.day === 'sun';

    if (preset === 'office') {
      return { ...day, slots: { ...(isWeekend ? weekendSlots : weekdaySlots) } };
    }

    if (preset === 'full') {
      return { ...day, slots: { ...fullSlots } };
    }

    return { ...day, slots: { ...morningOnlySlots } };
  });

export const PRESET_OPTIONS: { id: WeeklySchedulePreset; label: string; description: string }[] = [
  {
    id: 'office',
    label: 'Lịch hành chính',
    description: 'T2–T6: sáng + chiều · T7, CN: chỉ sáng',
  },
  {
    id: 'morning',
    label: 'Chỉ buổi sáng',
    description: 'Mở khám sáng cho cả tuần',
  },
  {
    id: 'full',
    label: 'Cả 3 ca',
    description: 'Sáng, chiều và tối mỗi ngày',
  },
];

export const isWeekendDay = (day: string): boolean => day === 'sat' || day === 'sun';
