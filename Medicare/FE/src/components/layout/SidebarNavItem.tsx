import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
  onClick?: () => void;
  accent?: 'blue' | 'green';
}

const ACTIVE_STYLES: Record<'blue' | 'green', string> = {
  blue: 'bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white font-semibold shadow-md shadow-blue-500/30',
  green: 'bg-gradient-to-r from-[#059669] to-[#10b981] text-white font-semibold shadow-md shadow-emerald-500/30',
};

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  to,
  icon: Icon,
  label,
  end = false,
  onClick,
  accent = 'blue',
}) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      [
        'group relative flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm transition-all duration-200',
        isActive
          ? ACTIVE_STYLES[accent]
          : 'font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900',
      ].join(' ')
    }
  >
    {({ isActive }) => (
      <>
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-110 ${
            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
          }`}
        >
          <Icon size={18} />
        </span>
        {label}
      </>
    )}
  </NavLink>
);

export default SidebarNavItem;
