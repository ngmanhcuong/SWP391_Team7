import React from 'react';
import { Bell, Calendar, Clock, FlaskConical, Receipt } from 'lucide-react';
import { ReviewFilter, ReviewStat } from '../types';

const ICON_MAP = {
  calendar: Calendar,
  clock: Clock,
  flask: FlaskConical,
  receipt: Receipt,
  bell: Bell,
};

interface ReviewsStatCardProps {
  stat: ReviewStat;
  isActive: boolean;
  onSelect: (filter: ReviewFilter) => void;
}

const trendStyles: Record<string, string> = {
  positive: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  negative: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

const ReviewsStatCard: React.FC<ReviewsStatCardProps> = ({ stat, isActive, onSelect }) => {
  const Icon = ICON_MAP[stat.icon];

  return (
    <button
      type="button"
      onClick={() => onSelect(stat.filter)}
      className={`text-left bg-white border rounded-2xl shadow-sm shadow-[#003d9b]/5 p-6 flex flex-col gap-2 transition-all duration-200 w-full ${
        isActive
          ? 'border-[#003d9b] ring-2 ring-[#003d9b]/15 shadow-md'
          : 'border-[#c3c6d6]/60 hover:border-[#003d9b]/30 hover:-translate-y-0.5 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.iconBg} ring-1 ring-[#003d9b]/10`}>
          <Icon size={20} className="text-[#003d9b]" />
        </div>
        {stat.trend && (
          <span className={`text-xs px-2.5 py-1 rounded-full ${trendStyles[stat.trendType ?? 'neutral']}`}>
            {stat.trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-[#737685] leading-5 font-medium">{stat.label}</p>
        <p className="text-3xl font-semibold text-[#191c1e] leading-10 tracking-tight mt-0.5">{stat.value}</p>
      </div>
    </button>
  );
};

export default ReviewsStatCard;
