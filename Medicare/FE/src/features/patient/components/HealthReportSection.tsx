import React from 'react';
import { HeartPulse } from 'lucide-react';
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
    <div className="relative bg-[#1a56db] rounded-lg p-6 shadow-lg overflow-hidden">
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-[rgba(0,82,204,0.2)] blur-[20px] rounded-xl" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 blur-[32px] rounded-xl" />

      <div className="relative flex flex-col gap-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Sức khỏe của bạn</h2>
            <p className="text-[#c4d2ff] text-base opacity-80 mt-1">
              {patientName ? `Tổng kết ${monthLabel} · ${patientName}` : `Tổng kết ${monthLabel}`}
            </p>
          </div>
          <HeartPulse size={27} className="text-white/80" />
        </div>

        <div className="flex flex-col gap-4">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex items-end justify-between mb-2">
                <span className="text-white/80 text-base">{metric.label}</span>
                <span className="text-white text-base">{metric.value}</span>
              </div>
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#82f9be] rounded-full transition-all duration-500"
                  style={{ width: `${metric.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          className="!bg-white !text-[#1a56db] hover:!bg-white/90 !border-white w-full"
          onClick={onDownload}
        >
          Tải báo cáo sức khỏe của tôi
        </Button>
      </div>
    </div>
  );
};

export default HealthReportSection;
