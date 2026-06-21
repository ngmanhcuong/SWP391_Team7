import React, { useMemo, useState } from 'react';
import { CalendarDays, Check, CloudSun, Minus, Moon, Plus, Sparkles, Sun } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import { Toggle } from '../../../../components/ui';
import { DaySchedule, TimeSlotKey } from '../../types';
import {
  PRESET_OPTIONS,
  TIME_SLOT_CONFIG,
  WeeklySchedulePreset,
  countActiveDays,
  countActiveSlots,
  countDaySlots,
  getColumnToggleState,
  isWeekendDay,
} from '../../utils/weeklyScheduleUtils';

interface WeeklyScheduleSectionProps {
  applyToAllWeeks: boolean;
  schedule: DaySchedule[];
  onApplyToAllWeeksChange: (value: boolean) => void;
  onSlotToggle: (dayIndex: number, slot: TimeSlotKey) => void;
  onColumnToggle: (slot: TimeSlotKey, enabled: boolean) => void;
  onApplyPreset: (preset: WeeklySchedulePreset) => void;
}

const SLOT_ICONS: Record<TimeSlotKey, React.ReactNode> = {
  morning: <Sun size={14} />,
  afternoon: <CloudSun size={14} />,
  evening: <Moon size={14} />,
};

const WeeklyScheduleSection: React.FC<WeeklyScheduleSectionProps> = ({
  applyToAllWeeks,
  schedule,
  onApplyToAllWeeksChange,
  onSlotToggle,
  onColumnToggle,
  onApplyPreset,
}) => {
  const [presetHint, setPresetHint] = useState<string | null>(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);

  const totalSlots = useMemo(() => countActiveSlots(schedule), [schedule]);
  const activeDays = useMemo(() => countActiveDays(schedule), [schedule]);

  const handleColumnToggle = (slot: TimeSlotKey) => {
    const state = getColumnToggleState(schedule, slot);
    onColumnToggle(slot, state !== 'all');
  };

  const handlePreset = (preset: WeeklySchedulePreset) => {
    onApplyPreset(preset);
    const presetLabel = PRESET_OPTIONS.find((option) => option.id === preset)?.label;
    setPresetHint(`Đã áp dụng mẫu "${presetLabel}".`);
    window.setTimeout(() => setPresetHint(null), 2500);
  };

  return (
    <>
      <div className="bg-white border border-slate-200/70 rounded-2xl shadow-soft overflow-hidden">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between px-5 sm:px-6 py-4 border-b border-slate-200/70">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563eb]/10 ring-1 ring-[#2563eb]/15">
              <CalendarDays size={18} className="text-[#2563eb]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900">Cấu hình lịch tuần</h2>
              <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                Chọn khung giờ khám cho từng ngày. Bệnh nhân chỉ đặt lịch trong các ca đã bật.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-full px-3 py-1.5">
              <CalendarDays size={13} className="text-slate-400" />
              {activeDays} ngày / tuần
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e40af] bg-[#2563eb]/[0.08] rounded-full px-3 py-1.5">
              <Check size={13} />
              {totalSlots} ca khám
            </span>
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
              <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
                Áp dụng mọi tuần
              </span>
              <Toggle checked={applyToAllWeeks} onChange={onApplyToAllWeeksChange} />
            </div>
          </div>
        </div>

        {presetHint && (
          <div className="mx-5 sm:mx-6 mt-4 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            {presetHint}
          </div>
        )}

        <div className="px-5 sm:px-6 py-4 border-b border-slate-200/60 bg-slate-50/50">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Mẫu lịch nhanh
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {PRESET_OPTIONS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePreset(preset.id)}
                className="group flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-left hover:border-[#2563eb]/40 hover:bg-[#2563eb]/[0.03] hover:shadow-sm transition-all"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2563eb]/10 text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white transition-colors">
                  <Sparkles size={14} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-slate-900">{preset.label}</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5 leading-snug">{preset.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/70">
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-5 sm:px-6 py-3 w-[150px] border-b border-slate-200/60">
                  Ngày
                </th>
                {TIME_SLOT_CONFIG.map((slot) => {
                  const columnState = getColumnToggleState(schedule, slot.key);
                  return (
                    <th key={slot.key} className="px-3 py-3 border-b border-slate-200/60">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <span className="text-[#2563eb]">{SLOT_ICONS[slot.key]}</span>
                          <span className="text-xs font-bold">{slot.label}</span>
                        </div>
                        <span className="text-[10px] font-normal text-slate-400">{slot.time}</span>
                        <button
                          type="button"
                          onClick={() => handleColumnToggle(slot.key)}
                          aria-label={`Bật/tắt cả tuần - ${slot.label}`}
                          className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-[#2563eb] transition-colors"
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded border-2 transition-all ${
                              columnState === 'all' || columnState === 'partial'
                                ? 'border-[#2563eb] bg-[#2563eb] text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {columnState === 'partial' ? (
                              <Minus size={10} strokeWidth={3} />
                            ) : (
                              columnState === 'all' && (
                                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )
                            )}
                          </span>
                          Cả tuần
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {schedule.map((day, dayIndex) => {
                const daySlotCount = countDaySlots(day);
                const weekend = isWeekendDay(day.day);

                return (
                  <tr
                    key={day.day}
                    className={`transition-colors ${weekend ? 'bg-slate-50/40' : ''} hover:bg-[#2563eb]/[0.02]`}
                  >
                    <td className="px-5 sm:px-6 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900">{day.dayLabel}</span>
                        {weekend && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
                            Cuối tuần
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${
                            daySlotCount > 0
                              ? 'text-[#1e40af] bg-[#2563eb]/[0.08]'
                              : 'text-slate-400 bg-slate-100'
                          }`}
                        >
                          {daySlotCount} ca
                        </span>
                      </div>
                    </td>
                    {TIME_SLOT_CONFIG.map((slot) => {
                      const active = day.slots[slot.key];
                      return (
                        <td key={slot.key} className="px-3 py-3 text-center border-b border-slate-100">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={active}
                            onClick={() => onSlotToggle(dayIndex, slot.key)}
                            aria-label={`${day.dayLabel} - ${slot.label}`}
                            className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all ${
                              active
                                ? 'border-[#2563eb] bg-[#2563eb] text-white shadow-sm shadow-[#2563eb]/25'
                                : 'border-slate-300 bg-white hover:border-[#2563eb]/50 hover:bg-[#2563eb]/5'
                            }`}
                          >
                            {active && <Check size={15} strokeWidth={3} />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 sm:px-6 py-4 border-t border-slate-200/60 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setCustomModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-600 hover:border-[#2563eb]/50 hover:text-[#2563eb] hover:bg-white transition-colors"
          >
            <Plus size={16} />
            Thêm khung giờ tùy chỉnh
          </button>
        </div>
      </div>

      {customModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            aria-label="Đóng"
            onClick={() => setCustomModalOpen(false)}
          />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-slate-200/70 overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-200/70">
              <h3 className="text-base font-bold text-slate-900">Khung giờ tùy chỉnh</h3>
              <p className="text-xs text-slate-500 mt-1">
                Hiện tại hệ thống hỗ trợ 3 ca chuẩn: sáng, chiều, tối. Bạn có thể bật thêm ca tối
                hoặc dùng mẫu lịch nhanh phía trên.
              </p>
            </div>
            <div className="px-5 sm:px-6 py-5 space-y-3">
              {TIME_SLOT_CONFIG.map((slot) => (
                <div
                  key={slot.key}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563eb]/10 text-[#2563eb]">
                    {SLOT_ICONS[slot.key]}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{slot.label}</p>
                    <p className="text-xs text-slate-500">{slot.time}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#1e40af] bg-[#2563eb]/[0.08] px-2 py-1 rounded-full">
                    Ca chuẩn
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 sm:px-6 py-4 border-t border-slate-200/60 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
              <Button type="button" variant="outline" onClick={() => setCustomModalOpen(false)}>
                Đóng
              </Button>
              <Button
                type="button"
                className="bg-[#2563eb] border-[#2563eb] hover:bg-[#1d4ed8]"
                onClick={() => {
                  handlePreset('full');
                  setCustomModalOpen(false);
                }}
              >
                Bật cả 3 ca
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WeeklyScheduleSection;
