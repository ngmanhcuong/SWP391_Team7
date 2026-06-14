import React from 'react';
import { Calendar, Clock, FlaskConical, Receipt } from 'lucide-react';
import { DashboardStat } from '../types';

const ICON_MAP = {
  calendar: Calendar,
  clock: Clock,
  flask: FlaskConical,
  receipt: Receipt,
};

interface StatCardProps {
  stat: DashboardStat;
}

const trendStyles: Record<string, string> = {
  positive: 'bg-[rgba(130,249,190,0.2)] text-[#006c47]',
  negative: 'bg-[rgba(255,218,214,0.2)] text-[#ba1a1a]',
  neutral: 'bg-[#edeef0] text-[#434654]',
};

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const Icon = ICON_MAP[stat.icon];

  return (
    <div className="bg-white border border-[rgba(195,198,214,0.3)] rounded-lg shadow-sm p-6 flex flex-col gap-2">
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
    </div>
  );
};

export default StatCard;
