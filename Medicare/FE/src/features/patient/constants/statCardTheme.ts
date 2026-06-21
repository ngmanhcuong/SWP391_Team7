export interface StatTheme {
  iconColor: string;
  tile: string;
  ring: string;
  glow: string;
  bar: string;
}

/** Bảng màu điểm nhấn theo loại icon, dùng chung cho mọi thẻ thống kê của bệnh nhân. */
export const STAT_THEMES: Record<string, StatTheme> = {
  calendar: {
    iconColor: 'text-[#2563eb]',
    tile: 'bg-gradient-to-br from-[#2563eb]/15 to-[#06b6d4]/5',
    ring: 'ring-[#2563eb]/15',
    glow: 'bg-[#2563eb]/15',
    bar: 'from-[#2563eb] to-[#06b6d4]',
  },
  clock: {
    iconColor: 'text-emerald-600',
    tile: 'bg-gradient-to-br from-emerald-400/20 to-emerald-500/5',
    ring: 'ring-emerald-500/15',
    glow: 'bg-emerald-400/15',
    bar: 'from-emerald-400 to-emerald-600',
  },
  flask: {
    iconColor: 'text-violet-600',
    tile: 'bg-gradient-to-br from-violet-400/20 to-violet-500/5',
    ring: 'ring-violet-500/15',
    glow: 'bg-violet-400/15',
    bar: 'from-violet-400 to-violet-600',
  },
  receipt: {
    iconColor: 'text-rose-600',
    tile: 'bg-gradient-to-br from-rose-400/20 to-rose-500/5',
    ring: 'ring-rose-500/15',
    glow: 'bg-rose-400/15',
    bar: 'from-rose-400 to-rose-600',
  },
  bell: {
    iconColor: 'text-amber-600',
    tile: 'bg-gradient-to-br from-amber-400/20 to-amber-500/5',
    ring: 'ring-amber-500/15',
    glow: 'bg-amber-400/15',
    bar: 'from-amber-400 to-amber-600',
  },
};

export const getStatTheme = (icon: string): StatTheme => STAT_THEMES[icon] ?? STAT_THEMES.calendar;

export const STAT_TREND_STYLES: Record<string, string> = {
  positive: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  negative: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};
