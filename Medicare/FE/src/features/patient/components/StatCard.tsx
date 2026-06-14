import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, FlaskConical, Receipt } from 'lucide-react';
import { DashboardStat } from '../types';

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

const trendStyles: Record<string, string> = {
  positive: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  negative: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const Icon = ICON_MAP[stat.icon];
  const href = STAT_LINKS[stat.id];

  const content = (
    <>
      <div className="flex items-start justify-between">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.iconBg} ring-1 ring-[#003d9b]/10`}>
          <Icon size={20} className="text-[#003d9b]" />
        </div>
        {stat.trend && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${trendStyles[stat.trendType ?? 'neutral']}`}>
            {stat.trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-[#737685] leading-5 font-medium">{stat.label}</p>
        <p className="text-3xl font-semibold text-[#191c1e] leading-10 tracking-tight mt-0.5">{stat.value}</p>
      </div>
    </>
  );

  const className =
    'group bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 p-6 flex flex-col gap-3 hover:shadow-md hover:border-[#003d9b]/30 hover:-translate-y-0.5 transition-all duration-200';

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
