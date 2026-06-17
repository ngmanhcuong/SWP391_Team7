import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ScheduleAlertCardProps {
  note: string;
}

const ScheduleAlertCard: React.FC<ScheduleAlertCardProps> = ({ note }) => (
  <div className="rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50 to-orange-50 p-4">
    <div className="flex items-start gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/80">
        <AlertTriangle size={16} className="text-rose-500" />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-[#191c1e]">Lưu ý hôm nay</h3>
        <p className="text-sm text-[#434654] mt-1.5 leading-relaxed">{note}</p>
      </div>
    </div>
  </div>
);

export default ScheduleAlertCard;
