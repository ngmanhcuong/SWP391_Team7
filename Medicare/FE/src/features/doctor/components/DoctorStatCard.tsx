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
  neutral: 'text-[#737685]',
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
            <ArrowUpRight size={14} className="text-[#c3c6d6] group-hover:text-[#003d9b] transition-colors" />
          )}
        </div>
      </div>
      <div>
        <p className="text-sm text-[#737685]">{stat.label}</p>
        <p className="text-3xl font-bold text-[#191c1e] mt-1 tracking-tight">{stat.value}</p>
        {stat.hint && (
          <p className="text-[11px] text-[#737685] mt-2 line-clamp-2">{stat.hint}</p>
        )}
      </div>
    </>
  );
};

const DoctorStatCard: React.FC<DoctorStatCardProps> = ({ stat, showNotificationDot }) => {
  const className =
    'group bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 p-5 flex flex-col gap-4 hover:shadow-md hover:border-[#003d9b]/20 transition-all';

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
