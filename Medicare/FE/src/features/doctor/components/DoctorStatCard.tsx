import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, ClipboardList, MessageSquare, Users } from 'lucide-react';
import { DoctorDashboardStat } from '../types';

const ICON_MAP = {
  users: Users,
  check: CheckCircle2,
  clipboard: ClipboardList,
  message: MessageSquare,
};

interface DoctorStatCardProps {
  stat: DoctorDashboardStat;
  showNotificationDot?: boolean;
}

const trendStyles: Record<string, string> = {
  positive: 'text-emerald-600',
  negative: 'text-rose-600',
  neutral: 'text-slate-500',
};

const cardContent = (stat: DoctorDashboardStat, showNotificationDot?: boolean) => {
  const Icon = ICON_MAP[stat.icon];

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className={`relative flex items-center justify-center w-11 h-11 rounded-xl ${stat.iconBg}`}>
          <Icon size={20} />
          {showNotificationDot && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {stat.trend && (
            <span className={`text-xs font-semibold ${trendStyles[stat.trendType ?? 'neutral']}`}>
              {stat.trend}
            </span>
          )}
          {stat.href && (
            <ArrowUpRight size={14} className="text-slate-300 group-hover:text-[#2563eb] transition-colors" />
          )}
        </div>
      </div>
      <div>
        <p className="text-[28px] font-bold text-slate-900 tracking-tight leading-9">{stat.value}</p>
        <p className="text-[13px] text-slate-500 font-medium mt-0.5">{stat.label}</p>
        {stat.hint && (
          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{stat.hint}</p>
        )}
      </div>
    </>
  );
};

const DoctorStatCard: React.FC<DoctorStatCardProps> = ({ stat, showNotificationDot }) => {
  const className =
    'group bg-white border border-slate-200/70 rounded-[20px] shadow-soft p-5 flex flex-col gap-4 hover:shadow-soft-lg hover:border-[#2563eb]/30 hover:-translate-y-1 transition-all duration-300';

  if (stat.href) {
    return (
      <Link to={stat.href} className={className}>
        {cardContent(stat, showNotificationDot)}
      </Link>
    );
  }

  return <div className={className}>{cardContent(stat, showNotificationDot)}</div>;
};

export default DoctorStatCard;
