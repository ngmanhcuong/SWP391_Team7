import React, { useMemo, useState } from 'react';
import { CalendarDays, Minus, Plus, Sparkles } from 'lucide-react';
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

const ScheduleCheckbox: React.FC<{
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
  size?: 'sm' | 'md';
}> = ({ checked, indeterminate = false, onChange, label, size = 'md' }) => {
  const dimension = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label}
      onClick={onChange}
      className={`mx-auto flex ${dimension} items-center justify-center rounded border-2 transition-all ${
        checked || indeterminate
          ? 'border-[#003d9b] bg-[#003d9b] text-white shadow-sm shadow-[#003d9b]/20'
          : 'border-[#c3c6d6] bg-white hover:border-[#003d9b]/50 hover:bg-[#f8f9fb]'
      }`}
    >
      {indeterminate ? (
        <Minus size={size === 'sm' ? 10 : 12} strokeWidth={3} />
      ) : (
        checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      )}
    </button>
  );
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
      <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between px-5 sm:px-6 py-4 border-b border-[#c3c6d6]/40">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f0fe]">
              <CalendarDays size={18} className="text-[#003d9b]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[#191c1e]">Cấu hình lịch tuần</h2>
              <p className="text-xs text-[#737685] mt-0.5 max-w-xl">
                Chọn khung giờ khám cho từng ngày. Bệnh nhân chỉ đặt lịch trong các ca đã bật.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-[#737685] bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-full px-3 py-1">
              {activeDays} ngày / tuần
            </span>
            <span className="text-xs font-semibold text-[#003d9b] bg-[#e8f0fe] border border-[#003d9b]/10 rounded-full px-3 py-1">
              {totalSlots} ca khám
            </span>
            <div className="flex items-center gap-2.5 rounded-xl border border-[#c3c6d6]/50 bg-[#f8f9fb]/60 px-3 py-1.5">
              <span className="text-xs font-medium text-[#434654] whitespace-nowrap">
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

        <div className="px-5 sm:px-6 py-4 border-b border-[#c3c6d6]/30 bg-[#f8f9fb]/30">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737685] mb-2.5">
            Mẫu lịch nhanh
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_OPTIONS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePreset(preset.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#c3c6d6]/60 bg-white px-3 py-2 text-left hover:border-[#003d9b]/40 hover:bg-[#e8f0fe]/20 transition-colors"
              >
                <Sparkles size={14} className="text-[#003d9b] shrink-0" />
                <span>
                  <span className="block text-xs font-semibold text-[#191c1e]">{preset.label}</span>
                  <span className="block text-[10px] text-[#737685] mt-0.5">{preset.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-[#c3c6d6]/30 bg-[#f8f9fb]/60">
                <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#737685] px-5 sm:px-6 py-3 w-[148px]">
                  Ngày
                </th>
                {TIME_SLOT_CONFIG.map((slot) => {
                  const columnState = getColumnToggleState(schedule, slot.key);
                  return (
                    <th key={slot.key} className="text-center px-4 py-3">
                      <div className="rounded-xl px-2 py-1.5">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <ScheduleCheckbox
                            checked={columnState === 'all'}
                            indeterminate={columnState === 'partial'}
                            onChange={() => handleColumnToggle(slot.key)}
                            label={`Cả tuần - ${slot.label}`}
                            size="sm"
                          />
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737685]">
                            {slot.label}
                          </span>
                        </div>
                        <div className="text-[10px] font-normal text-[#737685]/80 normal-case tracking-normal">
                          {slot.time}
                        </div>
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
                    className={`border-b border-[#c3c6d6]/20 last:border-0 transition-colors ${
                      weekend ? 'bg-[#f8f9fb]/35 hover:bg-[#f8f9fb]/60' : 'hover:bg-[#f8f9fb]/40'
                    }`}
                  >
                    <td className="px-5 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#191c1e]">{day.dayLabel}</span>
                        {weekend && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-[#737685] bg-white border border-[#c3c6d6]/50 rounded-full px-2 py-0.5">
                            Cuối tuần
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-[#003d9b] bg-[#e8f0fe] rounded-full px-2 py-0.5">
                          {daySlotCount} ca
                        </span>
                      </div>
                    </td>
                    {TIME_SLOT_CONFIG.map((slot) => (
                      <td key={slot.key} className="px-4 py-4 text-center">
                        <ScheduleCheckbox
                          checked={day.slots[slot.key]}
                          onChange={() => onSlotToggle(dayIndex, slot.key)}
                          label={`${day.dayLabel} - ${slot.label}`}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 sm:px-6 py-4 border-t border-[#c3c6d6]/30 bg-[#f8f9fb]/30">
          <button
            type="button"
            onClick={() => setCustomModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#c3c6d6]/70 text-sm font-semibold text-[#434654] hover:border-[#003d9b]/50 hover:text-[#003d9b] hover:bg-white transition-colors"
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
            className="absolute inset-0 bg-[#191c1e]/40 backdrop-blur-[2px]"
            aria-label="Đóng"
            onClick={() => setCustomModalOpen(false)}
          />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-[#c3c6d6]/50 overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-[#c3c6d6]/40">
              <h3 className="text-base font-semibold text-[#191c1e]">Khung giờ tùy chỉnh</h3>
              <p className="text-xs text-[#737685] mt-1">
                Hiện tại hệ thống hỗ trợ 3 ca chuẩn: sáng, chiều, tối. Bạn có thể bật thêm ca tối
                hoặc dùng mẫu lịch nhanh phía trên.
              </p>
            </div>
            <div className="px-5 sm:px-6 py-5 space-y-3">
              {TIME_SLOT_CONFIG.map((slot) => (
                <div
                  key={slot.key}
                  className="flex items-center justify-between rounded-xl border border-[#c3c6d6]/50 bg-[#f8f9fb]/50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#191c1e]">{slot.label}</p>
                    <p className="text-xs text-[#737685]">{slot.time}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#003d9b] bg-[#e8f0fe] px-2 py-1 rounded-full">
                    Ca chuẩn
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 sm:px-6 py-4 border-t border-[#c3c6d6]/30 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
              <Button type="button" variant="outline" onClick={() => setCustomModalOpen(false)}>
                Đóng
              </Button>
              <Button
                type="button"
                className="bg-[#003d9b] border-[#003d9b] hover:bg-[#002d75]"
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
