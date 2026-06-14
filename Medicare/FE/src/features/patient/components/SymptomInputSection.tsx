import React from 'react';
import { Mic, Paperclip, Sparkles, Stethoscope } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { MIN_SYMPTOM_LENGTH } from '../constants/appointmentBookingSteps';

interface SymptomInputSectionProps {
  symptoms: string;
  isAnalyzing: boolean;
  canAnalyze: boolean;
  onSymptomsChange: (value: string) => void;
  onAnalyze: () => void;
}

const SymptomInputSection: React.FC<SymptomInputSectionProps> = ({
  symptoms,
  isAnalyzing,
  canAnalyze,
  onSymptomsChange,
  onAnalyze,
}) => (
  <div className="bg-white border border-[#c3c6d6] rounded-2xl shadow-sm p-6 flex flex-col gap-4 h-full">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Stethoscope size={18} className="text-[#003d9b] shrink-0" />
        <h2 className="text-xl font-semibold text-[#191c1e]">Mô tả triệu chứng của bạn</h2>
      </div>
      <span className="text-xs font-medium text-[#434654] whitespace-nowrap">
        Tối thiểu {MIN_SYMPTOM_LENGTH} ký tự
      </span>
    </div>

    <textarea
      value={symptoms}
      onChange={(event) => onSymptomsChange(event.target.value)}
      placeholder={'Hãy mô tả tình trạng sức khỏe, các cơn đau hoặc biểu hiện bất thường\nmà bạn đang gặp phải...'}
      rows={8}
      className="w-full min-h-[220px] resize-y rounded-lg border border-[#c3c6d6] bg-[#f8f9fb] px-6 py-6 text-base text-[#191c1e] placeholder:text-[#6b7280] outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10 transition-all"
    />

    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-[#c3c6d6] px-4 py-2 text-xs font-medium text-[#191c1e] hover:bg-[#f8f9fb] transition-colors"
        >
          <Mic size={14} className="text-emerald-600" />
          Ghi âm
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-[#c3c6d6] px-4 py-2 text-xs font-medium text-[#191c1e] hover:bg-[#f8f9fb] transition-colors"
        >
          <Paperclip size={14} className="text-red-500" />
          Tải ảnh kết quả xét nghiệm
        </button>
      </div>

      <Button
        onClick={onAnalyze}
        disabled={!canAnalyze}
        loading={isAnalyzing}
        leftIcon={<Sparkles size={18} />}
        className="!bg-[#003d9b] !border-[#003d9b] hover:!bg-[#002d75] !rounded-lg !px-8 !py-3 !text-base shrink-0"
      >
        Phân tích bằng AI
      </Button>
    </div>
  </div>
);

export default SymptomInputSection;
