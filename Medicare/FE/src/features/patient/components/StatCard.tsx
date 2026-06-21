import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, FlaskConical, Receipt } from 'lucide-react';
import { DashboardStat } from '../types';
import { getStatTheme, STAT_TREND_STYLES } from '../constants/statCardTheme';

const ICON_MAP = {
  calendar: Calendar,
  clock: Clock,
  flask: FlaskConical,
  receipt: Receipt,
};

const STAT_LINKS: Record<string, string> = {
  upcoming: '/patient/lich-hen',
  visits: '/patient/ho-so',
  lab: '/patient/ho-so?tab=labs',
  bills: '/patient/thanh-toan?filter=unpaid',
};

interface StatCardProps {
  stat: DashboardStat;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const Icon = ICON_MAP[stat.icon];
  const href = STAT_LINKS[stat.id];
  const theme = getStatTheme(stat.icon);

  const content = (
    <>
      <span
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full ${theme.glow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-2xl ${theme.tile} ring-1 ${theme.ring} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon size={20} className={theme.iconColor} />
        </div>
        {stat.trend && (
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STAT_TREND_STYLES[stat.trendType ?? 'neutral']}`}>
            {stat.trend}
          </span>
        )}
      </div>
      <div className="relative mt-1">
        <p className="text-[28px] font-bold text-slate-900 leading-9 tracking-tight">{stat.value}</p>
        <p className="text-[13px] text-slate-500 leading-5 font-medium mt-0.5">{stat.label}</p>
      </div>
    </>
  );

  const className =
    'group relative overflow-hidden bg-white border border-slate-200/70 rounded-[24px] shadow-soft p-5 flex flex-col gap-2.5 hover:shadow-soft-lg hover:border-[#2563eb]/30 hover:-translate-y-1 transition-all duration-300';

  if (href) {
    return (
      <Link to={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};

export default StatCard;
