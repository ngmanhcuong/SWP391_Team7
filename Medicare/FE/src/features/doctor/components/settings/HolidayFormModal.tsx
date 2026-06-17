import React, { useEffect, useMemo, useState } from 'react';
import { CalendarRange, X } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import { HolidayEntry, HolidayLeaveType } from '../../types';
import {
  EMPTY_HOLIDAY_FORM,
  HolidayFormValues,
  formValuesToHolidayEntry,
  getHolidayDurationDays,
  holidayToFormValues,
  validateHolidayForm,
} from '../../utils/holidayLeaveUtils';

interface HolidayFormModalProps {
  open: boolean;
  editingHoliday?: HolidayEntry | null;
  onClose: () => void;
  onSubmit: (entry: HolidayEntry) => void;
}

const inputClassName =
  'w-full px-4 py-2.5 text-sm border border-[#c3c6d6]/60 rounded-xl outline-none transition-all bg-white text-[#191c1e] placeholder:text-[#737685] focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10';

const labelClassName = 'text-xs font-medium text-[#737685] block mb-1.5';

const TYPE_OPTIONS: { value: HolidayLeaveType; label: string }[] = [
  { value: 'holiday', label: 'Nghỉ lễ' },
  { value: 'leave', label: 'Nghỉ phép' },
];

const HolidayFormModal: React.FC<HolidayFormModalProps> = ({
  open,
  editingHoliday,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<HolidayFormValues>(EMPTY_HOLIDAY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof HolidayFormValues, string>>>({});

  const isEditing = Boolean(editingHoliday);

  useEffect(() => {
    if (!open) return;
    setForm(editingHoliday ? holidayToFormValues(editingHoliday) : EMPTY_HOLIDAY_FORM);
    setErrors({});
  }, [open, editingHoliday]);

  const previewDuration = useMemo(() => {
    if (!form.startDate) return null;
    const entry = formValuesToHolidayEntry(form, 'preview');
    return getHolidayDurationDays(entry.startDate, entry.endDate);
  }, [form]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateHolidayForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit(formValuesToHolidayEntry(form, editingHoliday?.id));
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#191c1e]/40 backdrop-blur-[2px]"
        aria-label="Đóng"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-[#c3c6d6]/50 overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#c3c6d6]/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fef2f2]">
              <CalendarRange size={18} className="text-[#dc2626]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#191c1e]">
                {isEditing ? 'Chỉnh sửa ngày nghỉ' : 'Thêm ngày nghỉ mới'}
              </h3>
              <p className="text-xs text-[#737685] mt-0.5">
                Lịch nghỉ sẽ chặn đặt hẹn trong khoảng thời gian này
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#737685] hover:bg-[#f8f9fb] transition-colors"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 space-y-5">
          <div>
            <span className={labelClassName}>Loại nghỉ</span>
            <div className="grid grid-cols-2 gap-2">
              {TYPE_OPTIONS.map((option) => {
                const active = form.type === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, type: option.value }))}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
                      active
                        ? option.value === 'holiday'
                          ? 'border-[#dc2626] text-[#dc2626] bg-[#fef2f2]'
                          : 'border-[#003d9b] text-[#003d9b] bg-[#e8f0fe]/50'
                        : 'border-[#c3c6d6]/60 text-[#434654] bg-white hover:border-[#003d9b]/40'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="holiday-title" className={labelClassName}>
              Tên / lý do nghỉ
            </label>
            <input
              id="holiday-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Ví dụ: Nghỉ Tết Nguyên Đán"
              className={inputClassName}
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="holiday-start" className={labelClassName}>
                Từ ngày
              </label>
              <input
                id="holiday-start"
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                    endDate: prev.singleDay ? e.target.value : prev.endDate,
                  }))
                }
                className={inputClassName}
              />
              {errors.startDate && <p className="text-xs text-rose-600 mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="holiday-end" className={labelClassName}>
                Đến ngày
              </label>
              <input
                id="holiday-end"
                type="date"
                value={form.endDate}
                min={form.startDate || undefined}
                disabled={form.singleDay}
                onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                className={`${inputClassName} disabled:bg-[#f8f9fb] disabled:text-[#737685]`}
              />
              {errors.endDate && <p className="text-xs text-rose-600 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.singleDay}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  singleDay: e.target.checked,
                  endDate: e.target.checked ? prev.startDate : prev.endDate,
                }))
              }
              className="h-4 w-4 rounded border-[#c3c6d6] text-[#003d9b] focus:ring-[#003d9b]/20"
            />
            <span className="text-sm text-[#434654]">Chỉ nghỉ một ngày</span>
          </label>

          {previewDuration && (
            <p className="text-xs text-[#737685] bg-[#f8f9fb] border border-[#c3c6d6]/40 rounded-xl px-3 py-2">
              Tổng cộng: <span className="font-semibold text-[#191c1e]">{previewDuration} ngày</span>
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="bg-[#003d9b] border-[#003d9b] hover:bg-[#002d75]">
              {isEditing ? 'Cập nhật' : 'Thêm ngày nghỉ'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HolidayFormModal;
