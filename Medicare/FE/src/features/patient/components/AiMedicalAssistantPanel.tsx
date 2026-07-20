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
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-red-50 text-red-700 border-red-200',
};

const AiMedicalAssistantPanel: React.FC<AiMedicalAssistantPanelProps> = ({
  analysis,
  isAnalyzing,
  error,
  canRetry,
  onRetry,
}) => (
  <div className="relative flex h-full min-h-[504px] items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 px-6 py-10 shadow-sm">
    {/* Decorative background circles */}
    <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-100/40 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-indigo-100/40 blur-3xl" />

    {isAnalyzing ? (
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
          <Spinner size="lg" color="#ffffff" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900">AI đang phân tích triệu chứng...</p>
          <p className="mt-1 text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    ) : error ? (
      <div className="relative z-10 flex flex-col items-center gap-4 text-center max-w-xs">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 shadow-sm">
          <AlertTriangle size={32} className="text-red-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Không thể phân tích</h3>
          <p className="mt-1 text-sm text-gray-500 leading-5">{error}</p>
        </div>
        {canRetry && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-[#003d9b] shadow-sm transition-all hover:bg-blue-50 hover:shadow-md"
          >
            <RefreshCw size={16} />
            Thử lại
          </button>
        )}
      </div>
    ) : analysis ? (
      <div className="relative z-10 w-full max-w-sm space-y-4">
        {/* Result header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-200">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Kết quả phân tích</h3>
            <p className="text-xs text-gray-500">Độ tin cậy {analysis.confidence}%</p>
          </div>
        </div>

        {/* Result card */}
        <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Chuyên khoa gợi ý</p>
            <p className="mt-1 text-lg font-bold text-[#003d9b]">{analysis.suggestedSpecialty}</p>
            {analysis.alternativeSpecialty && (
              <p className="mt-1 text-xs text-gray-500">
                Có thể cân nhắc thêm:{' '}
                <span className="font-medium text-gray-700">{analysis.alternativeSpecialty}</span>
              </p>
            )}
          </div>
          <p className="text-sm text-gray-600 leading-6">{analysis.summary}</p>
          <span
            className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border ${urgencyStyle[analysis.urgency]}`}
          >
            {urgencyLabel[analysis.urgency]}
          </span>
        </div>
      </div>
    ) : (
      <div className="relative z-10 flex flex-col items-center gap-5 text-center max-w-xs">
        <div className="animate-pulse-glow flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
          <Brain size={40} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI Trợ Lý Y Tế</h3>
          <p className="mt-2 text-sm text-gray-500 leading-6">
            Sau khi bạn nhập triệu chứng, AI sẽ giúp phân tích và gợi ý chuyên khoa phù hợp nhất cho tình trạng của bạn.
          </p>
        </div>
      </div>
    )}
  </div>
);

export default AiMedicalAssistantPanel;
