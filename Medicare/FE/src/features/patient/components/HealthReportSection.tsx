import React from 'react';
import { Download, HeartPulse } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { HealthMetric } from '../types';

interface HealthReportSectionProps {
  metrics: HealthMetric[];
  patientName?: string;
  onDownload?: () => void;
}

const HealthReportSection: React.FC<HealthReportSectionProps> = ({
  metrics,
  patientName,
  onDownload,
}) => {
  const monthLabel = new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(new Date());

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#06b6d4] p-6 shadow-soft-lg">
      <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-cyan-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Sức khỏe của bạn</h2>
            <p className="text-blue-100/80 text-sm mt-1">
              {patientName ? `Tổng kết ${monthLabel} · ${patientName}` : `Tổng kết ${monthLabel}`}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
            <HeartPulse size={22} className="text-white" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex items-end justify-between mb-2">
                <span className="text-white/75 text-sm">{metric.label}</span>
                <span className="text-white text-sm font-semibold">{metric.value}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-200 to-white rounded-full transition-all duration-700"
                  style={{ width: `${metric.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          className="!bg-white !text-[#2563eb] hover:!bg-blue-50 !border-0 w-full !rounded-xl !font-semibold !shadow-sm"
          leftIcon={<Download size={16} />}
          onClick={onDownload}
        >
          Tải báo cáo sức khỏe
        </Button>
      </div>
    </div>
  );
};

export default HealthReportSection;
