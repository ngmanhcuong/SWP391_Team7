import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, FileText } from 'lucide-react';
import { LabResult } from '../types';
import HealthRecordsEmptyState from './HealthRecordsEmptyState';
interface LabResultsSectionProps {
  results: LabResult[];
}

const statusConfig: Record<
  LabResult['status'],
  { label: string; className: string; icon: React.ReactNode }
> = {
  normal: {
    label: 'Bình thường',
    className: 'bg-[#006c47]/10 text-[#006c47]',
    icon: <CheckCircle2 size={14} />,
  },
  abnormal: {
    label: 'Cần theo dõi',
    className: 'bg-[#fff8e6] text-[#7a4f01]',
    icon: <AlertTriangle size={14} />,
  },
  pending: {
    label: 'Đang chờ',
    className: 'bg-[#edeef0] text-[#434654]',
    icon: <Clock size={14} />,
  },
};

const LabResultsSection: React.FC<LabResultsSectionProps> = ({ results }) => {
  if (results.length === 0) {
    return <HealthRecordsEmptyState tab="labs" />;
  }

  return (
  <div className="space-y-3">
    {results.map((result) => {        const status = statusConfig[result.status];
        return (
          <div
            key={result.id}
            className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm p-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="flex gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(176,35,0,0.1)]">
                <FileText size={18} className="text-[#b02300]" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-medium text-[#191c1e]">{result.name}</p>
                <p className="text-sm text-[#434654] mt-0.5">{result.summary}</p>
                <p className="text-xs text-[#737685] mt-1">
                  {result.date} · {result.doctorName}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 shrink-0 text-xs font-medium px-2.5 py-1 rounded ${status.className}`}
            >
              {status.icon}
              {status.label}
            </span>
          </div>
        );
      })}
  </div>
  );
};

export default LabResultsSection;