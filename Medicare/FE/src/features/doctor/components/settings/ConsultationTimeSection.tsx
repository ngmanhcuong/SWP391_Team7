import React from 'react';
import { Clock } from 'lucide-react';

const PRESET_MINUTES = [15, 20, 30] as const;

interface ConsultationTimeSectionProps {
  selectedMinutes: number;
  customMinutes: string;
  onPresetSelect: (minutes: number) => void;
  onCustomChange: (value: string) => void;
}

const ConsultationTimeSection: React.FC<ConsultationTimeSectionProps> = ({
  selectedMinutes,
  customMinutes,
  onPresetSelect,
  onCustomChange,
}) => {
  const isCustomActive = customMinutes !== '' && !PRESET_MINUTES.includes(selectedMinutes as (typeof PRESET_MINUTES)[number]);

  return (
    <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f0fe]">
          <Clock size={18} className="text-[#003d9b]" />
        </div>
        <h2 className="text-base font-semibold text-[#191c1e]">Thời gian khám</h2>
      </div>
      <p className="text-sm text-[#737685] mb-5 ml-[46px]">
        Thời gian trung bình dự kiến cho mỗi lượt khám bệnh.
      </p>

      <div className="flex flex-wrap gap-2.5 mb-5">
        {PRESET_MINUTES.map((minutes) => {
          const isSelected = selectedMinutes === minutes && !isCustomActive;
          return (
            <button
              key={minutes}
              type="button"
              onClick={() => onPresetSelect(minutes)}
              className={`min-w-[64px] px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                isSelected
                  ? 'border-[#003d9b] text-[#003d9b] bg-[#e8f0fe]/50'
                  : 'border-[#c3c6d6]/60 text-[#434654] bg-white hover:border-[#003d9b]/40'
              }`}
            >
              {minutes}p
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label htmlFor="custom-consultation-minutes" className="text-sm text-[#434654] shrink-0">
          Hoặc nhập số phút tùy chỉnh:
        </label>
        <input
          id="custom-consultation-minutes"
          type="number"
          min={5}
          max={120}
          placeholder="Ví dụ: 45"
          value={customMinutes}
          onChange={(e) => onCustomChange(e.target.value)}
          className="w-full sm:max-w-[200px] px-4 py-2.5 text-sm border border-[#c3c6d6]/60 rounded-xl outline-none transition-all bg-white text-[#191c1e] placeholder:text-[#737685] focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
        />
      </div>
    </div>
  );
};

export default ConsultationTimeSection;
