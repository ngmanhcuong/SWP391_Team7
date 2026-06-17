import { HolidayEntry } from '../types';

export const parseDisplayDate = (value: string): Date | null => {
  const parts = value.split('/').map((part) => Number(part.trim()));
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  if (!day || !month || !year) return null;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
};

export const formatDisplayDate = (date: Date): string =>
  date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

export const toInputDate = (display: string): string => {
  const parsed = parseDisplayDate(display);
  if (!parsed) return '';
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const fromInputDate = (iso: string): string => {
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return '';
  return `${day}/${month}/${year}`;
};

export const formatHolidayDateRange = (holiday: HolidayEntry): string => {
  if (holiday.endDate && holiday.endDate !== holiday.startDate) {
    return `${holiday.startDate} – ${holiday.endDate}`;
  }
  return holiday.startDate;
};

export const getHolidayDurationDays = (startDate: string, endDate?: string): number => {
  const start = parseDisplayDate(startDate);
  const end = parseDisplayDate(endDate || startDate);
  if (!start || !end) return 1;
  const diff = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  return Math.max(1, diff + 1);
};

export const sortHolidaysByDate = (holidays: HolidayEntry[]): HolidayEntry[] =>
  [...holidays].sort((a, b) => {
    const dateA = parseDisplayDate(a.startDate)?.getTime() ?? 0;
    const dateB = parseDisplayDate(b.startDate)?.getTime() ?? 0;
    return dateA - dateB;
  });

export interface HolidayFormValues {
  title: string;
  type: HolidayEntry['type'];
  startDate: string;
  endDate: string;
  singleDay: boolean;
}

export const EMPTY_HOLIDAY_FORM: HolidayFormValues = {
  title: '',
  type: 'holiday',
  startDate: '',
  endDate: '',
  singleDay: true,
};

export const holidayToFormValues = (holiday: HolidayEntry): HolidayFormValues => ({
  title: holiday.title,
  type: holiday.type,
  startDate: toInputDate(holiday.startDate),
  endDate: holiday.endDate ? toInputDate(holiday.endDate) : toInputDate(holiday.startDate),
  singleDay: !holiday.endDate || holiday.endDate === holiday.startDate,
});

export const validateHolidayForm = (
  form: HolidayFormValues,
): Partial<Record<keyof HolidayFormValues, string>> => {
  const errors: Partial<Record<keyof HolidayFormValues, string>> = {};

  if (!form.title.trim()) {
    errors.title = 'Vui lòng nhập tên hoặc lý do nghỉ';
  }

  if (!form.startDate) {
    errors.startDate = 'Vui lòng chọn ngày bắt đầu';
  }

  if (!form.singleDay) {
    if (!form.endDate) {
      errors.endDate = 'Vui lòng chọn ngày kết thúc';
    } else if (form.startDate && form.endDate < form.startDate) {
      errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }
  }

  return errors;
};

export const formValuesToHolidayEntry = (
  form: HolidayFormValues,
  id?: string,
): HolidayEntry => {
  const startDate = fromInputDate(form.startDate);
  const endDate = form.singleDay ? undefined : fromInputDate(form.endDate);

  return {
    id: id ?? `holiday-${Date.now()}`,
    title: form.title.trim(),
    type: form.type,
    startDate,
    endDate: endDate && endDate !== startDate ? endDate : undefined,
  };
};
