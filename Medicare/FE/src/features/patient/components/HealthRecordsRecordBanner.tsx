import React from 'react';
import { FileText } from 'lucide-react';

interface HealthRecordsRecordBannerProps {
  recordCode: string;
  updatedAt: string;
}

const HealthRecordsRecordBanner: React.FC<HealthRecordsRecordBannerProps> = ({
  recordCode,
  updatedAt,
}) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-[#c3c6d6] bg-[#f8f9fb] px-5 py-4">
    <div className="flex items-center gap-3 min-w-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#003d9b]/10">
        <FileText size={20} className="text-[#003d9b]" />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-[#737685]">Mã hồ sơ bệnh án</p>
        <p className="text-lg font-semibold text-[#003d9b]">{recordCode}</p>
      </div>
    </div>
    <p className="text-sm text-[#434654]">
      Cập nhật lần cuối: <span className="font-medium text-[#191c1e]">{updatedAt}</span>
    </p>
  </div>
);

export default HealthRecordsRecordBanner;
