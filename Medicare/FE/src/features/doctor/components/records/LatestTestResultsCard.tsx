import React from 'react';
import { ArrowUp, Minus, TestTube2 } from 'lucide-react';
import { LabResult, LabResultStatus } from '../../types';

interface LatestTestResultsCardProps {
  results: LabResult[];
}

const statusStyles: Record<
  LabResultStatus,
  { icon: React.ReactNode; className: string }
> = {
  high: {
    icon: <ArrowUp size={14} />,
    className: 'text-rose-600 bg-rose-50 ring-1 ring-rose-100',
  },
  upper: {
    icon: <ArrowUp size={14} />,
    className: 'text-amber-600 bg-amber-50 ring-1 ring-amber-100',
  },
  normal: {
    icon: <Minus size={14} />,
    className: 'text-emerald-600 bg-emerald-50 ring-1 ring-emerald-100',
  },
};

const LatestTestResultsCard: React.FC<LatestTestResultsCardProps> = ({ results }) => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#c3c6d6]/40">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f0fe]">
        <TestTube2 size={16} className="text-[#003d9b]" />
      </div>
      <h3 className="text-sm font-semibold text-[#191c1e]">Kết quả Xét nghiệm mới nhất</h3>
    </div>

    <div className="divide-y divide-[#c3c6d6]/20">
      {results.map((result) => {
        const style = statusStyles[result.status];
        return (
          <div
            key={result.id}
            className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-[#f8f9fb]/40 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#191c1e]">{result.name}</p>
              <p className="text-lg font-bold text-[#191c1e] mt-0.5">{result.value}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${style.className}`}
            >
              {style.icon}
              {result.statusLabel}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

export default LatestTestResultsCard;
