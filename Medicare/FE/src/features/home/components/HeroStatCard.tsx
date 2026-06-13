import React from 'react';
import type { LucideIcon } from 'lucide-react';

type HeroStatCardProps = {
  value: string;
  label: string;
  icon: LucideIcon;
  delay?: number;
};

const HeroStatCard: React.FC<HeroStatCardProps> = ({ value, label, icon: Icon, delay = 0 }) => (
  <div
    className="hero-stat-card group rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg shadow-cyan-500/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/15 hover:shadow-cyan-400/15"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/15 ring-1 ring-cyan-300/25 transition-colors group-hover:bg-cyan-400/25">
      <Icon size={20} className="text-cyan-200" />
    </div>
    <div className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: 'Lexend' }}>
      {value}
    </div>
    <div className="mt-1 text-xs leading-snug text-cyan-50/80">{label}</div>
  </div>
);

export default HeroStatCard;
