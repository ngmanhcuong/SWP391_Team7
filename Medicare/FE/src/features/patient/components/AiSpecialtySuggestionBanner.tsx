import React from 'react';
import { Sparkles } from 'lucide-react';
import { AiSymptomAnalysis } from '../types';

interface AiSpecialtySuggestionBannerProps {
  symptoms: string;
  analysis: AiSymptomAnalysis | null;
}

const truncateSymptoms = (text: string, maxLength = 48): string => {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trim()}...`;
};

const AiSpecialtySuggestionBanner: React.FC<AiSpecialtySuggestionBannerProps> = ({
  symptoms,
  analysis,
}) => {
  const primarySpecialty = analysis?.suggestedSpecialty ?? 'Tim mạch';
  const alternativeSpecialty = analysis?.alternativeSpecialty ?? 'Cơ xương khớp';
  const symptomQuote = truncateSymptoms(symptoms) || 'triệu chứng bạn đã mô tả';

  return (
    <div
      className="relative flex flex-col gap-4 rounded-lg p-6 shadow-lg sm:flex-row sm:items-center sm:gap-6"
      style={{ background: 'linear-gradient(135deg, #0052cc 0%, #003d9b 100%)' }}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm shrink-0">
        <Sparkles size={28} className="text-white" />
      </div>

      <div className="space-y-1 text-white">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base">Gợi ý từ AI MedCare</span>
          <span className="rounded-xl bg-[#006c47] px-2 py-0.5 text-[10px] font-bold tracking-wide">
            KHUYÊN DÙNG
          </span>
        </div>
        <p className="text-base leading-6 opacity-90">
          Dựa trên triệu chứng{' '}
          <strong className="font-bold">&quot;{symptomQuote}&quot;</strong> bạn đã cung cấp, chúng
          tôi gợi ý bạn nên bắt đầu tại khoa{' '}
          <strong className="font-bold">{primarySpecialty}</strong>
          {alternativeSpecialty !== primarySpecialty && (
            <>
              {' '}
              hoặc <strong className="font-bold">{alternativeSpecialty}</strong>
            </>
          )}{' '}
          để được chẩn đoán chính xác nhất.
        </p>
      </div>
    </div>
  );
};

export default AiSpecialtySuggestionBanner;
