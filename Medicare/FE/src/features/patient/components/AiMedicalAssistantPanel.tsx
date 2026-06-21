import React from 'react';
import { AlertTriangle, Brain, RefreshCw, Sparkles } from 'lucide-react';
import { Spinner } from '../../../components/ui';
import { AiSymptomAnalysis } from '../types';

interface AiMedicalAssistantPanelProps {
  analysis: AiSymptomAnalysis | null;
  isAnalyzing: boolean;
  error?: string | null;
  canRetry?: boolean;
  onRetry?: () => void;
}

const urgencyLabel: Record<AiSymptomAnalysis['urgency'], string> = {
  low: 'Theo dõi thêm',
  medium: 'Nên khám sớm',
  high: 'Ưu tiên khám',
};

const urgencyStyle: Record<AiSymptomAnalysis['urgency'], string> = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  high: 'bg-red-50 text-red-700 border-red-100',
};

const AiMedicalAssistantPanel: React.FC<AiMedicalAssistantPanelProps> = ({
  analysis,
  isAnalyzing,
  error,
  canRetry,
  onRetry,
}) => (
  <div className="h-full min-h-[504px] rounded-2xl border-2 border-dashed border-[#c3c6d6] bg-[rgba(225,226,228,0.3)] flex items-center justify-center px-6 py-10">
    {isAnalyzing ? (
      <div className="flex flex-col items-center gap-4 text-center">
        <Spinner size="lg" />
        <p className="text-base font-medium text-[#191c1e]">AI đang phân tích triệu chứng...</p>
        <p className="text-sm text-[#434654]">Vui lòng đợi trong giây lát</p>
      </div>
    ) : error ? (
      <div className="flex flex-col items-center gap-4 text-center max-w-xs">
        <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-red-50">
          <AlertTriangle size={44} className="text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-[#191c1e]">Không thể phân tích</h3>
        <p className="text-sm text-[#434654] leading-5">{error}</p>
        {canRetry && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg border border-[#c3c6d6] bg-white px-4 py-2 text-sm font-medium text-[#003d9b] hover:bg-blue-50 transition-colors"
          >
            <RefreshCw size={16} />
            Thử lại
          </button>
        )}
      </div>
    ) : analysis ? (
      <div className="w-full max-w-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[rgba(0,82,204,0.2)]">
            <Sparkles size={28} className="text-[#003d9b]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#191c1e]">Kết quả phân tích</h3>
            <p className="text-sm text-[#434654]">Độ tin cậy {analysis.confidence}%</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#c3c6d6] bg-white p-4 space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-[#434654]">Chuyên khoa gợi ý</p>
            <p className="text-lg font-semibold text-[#003d9b] mt-1">{analysis.suggestedSpecialty}</p>
            {analysis.alternativeSpecialty && (
              <p className="text-xs text-[#434654] mt-1">
                Có thể cân nhắc thêm:{' '}
                <span className="font-medium text-[#191c1e]">{analysis.alternativeSpecialty}</span>
              </p>
            )}
          </div>
          <p className="text-sm text-[#434654] leading-6">{analysis.summary}</p>
          <span
            className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full border ${urgencyStyle[analysis.urgency]}`}
          >
            {urgencyLabel[analysis.urgency]}
          </span>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-4 text-center max-w-xs">
        <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-[rgba(0,82,204,0.2)]">
          <Brain size={48} className="text-[#003d9b]" />
        </div>
        <h3 className="text-xl font-semibold text-[#191c1e]">AI Trợ Lý Y Tế</h3>
        <p className="text-sm text-[#434654] leading-5">
          Sau khi bạn nhập triệu chứng, AI sẽ giúp phân tích và gợi ý chuyên khoa phù hợp nhất cho tình trạng của bạn.
        </p>
      </div>
    )}
  </div>
);

export default AiMedicalAssistantPanel;
