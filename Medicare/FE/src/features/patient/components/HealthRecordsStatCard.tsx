import React from 'react';
import { Calendar, Clock, FlaskConical, Receipt } from 'lucide-react';
import { HealthRecordStat, HealthRecordTab } from '../types';
import { getStatTheme, STAT_TREND_STYLES } from '../constants/statCardTheme';

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

const HealthRecordsStatCard: React.FC<HealthRecordsStatCardProps> = ({
  stat,
  isActive,
  onSelect,
}) => {
  const Icon = ICON_MAP[stat.icon];
  const theme = getStatTheme(stat.icon);

  return (
    <button
      type="button"
      onClick={() => onSelect(stat.tab)}
      className={`group relative overflow-hidden text-left bg-white border rounded-2xl shadow-sm shadow-[#003d9b]/5 p-6 flex flex-col gap-3 transition-all duration-300 w-full ${
        isActive
          ? 'border-[#003d9b] ring-2 ring-[#003d9b]/15 shadow-md -translate-y-0.5'
          : 'border-[#c3c6d6]/60 hover:border-[#003d9b]/25 hover:-translate-y-1 hover:shadow-lg'
      }`}
    >
      <span
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.bar} transition-opacity duration-300 ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      />
      <span
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full ${theme.glow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-2xl ${theme.tile} ring-1 ${theme.ring} transition-transform duration-300 group-hover:scale-105`}
        >
          <Icon size={22} className={theme.iconColor} />
        </div>
        {stat.trend && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STAT_TREND_STYLES[stat.trendType ?? 'neutral']}`}>
            {stat.trend}
          </span>
        )}
      </div>
      <div className="relative">
        <p className="text-xs uppercase tracking-wider text-[#737685] leading-5 font-medium">{stat.label}</p>
        <p className="text-3xl font-semibold text-[#191c1e] leading-10 tracking-tight mt-0.5">{stat.value}</p>
      </div>
    </button>
  );
};

export default HealthRecordsStatCard;
