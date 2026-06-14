import React from 'react';
import { Calendar, Clock, FlaskConical, Receipt } from 'lucide-react';
import { HealthRecordStat, HealthRecordTab } from '../types';

const ICON_MAP = {
  calendar: Calendar,
  clock: Clock,
  flask: FlaskConical,
  receipt: Receipt,
};

interface HealthRecordsStatCardProps {
  stat: HealthRecordStat;
  isActive: boolean;
  onSelect: (tab: HealthRecordTab) => void;
}

const trendStyles: Record<string, string> = {
  positive: 'bg-[rgba(130,249,190,0.2)] text-[#006c47]',
  negative: 'bg-[rgba(255,218,214,0.2)] text-[#ba1a1a]',
  neutral: 'bg-[#edeef0] text-[#434654]',
};

const HealthRecordsStatCard: React.FC<HealthRecordsStatCardProps> = ({
  stat,
  isActive,
  onSelect,
}) => {
  const Icon = ICON_MAP[stat.icon];

  return (
    <button
      type="button"
      onClick={() => onSelect(stat.tab)}
      className={`text-left bg-white border rounded-lg shadow-sm p-6 flex flex-col gap-2 transition-all w-full ${
        isActive
          ? 'border-[#003d9b] ring-2 ring-[#003d9b]/15'
          : 'border-[rgba(195,198,214,0.3)] hover:border-[#003d9b]/40'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.iconBg}`}>
          <Icon size={20} className="text-[#003d9b]" />
        </div>
        {stat.trend && (
          <span className={`text-sm px-2 py-1 rounded-xl ${trendStyles[stat.trendType ?? 'neutral']}`}>
            {stat.trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-[#434654] leading-5">{stat.label}</p>
        <p className="text-[32px] font-semibold text-[#191c1e] leading-10 tracking-tight">{stat.value}</p>
      </div>
    </button>
  );
};

export default HealthRecordsStatCard;
