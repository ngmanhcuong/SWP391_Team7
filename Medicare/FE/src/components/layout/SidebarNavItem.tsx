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
  blue: 'bg-gradient-to-r from-[#1a56db] to-[#3b82f6] text-white shadow-[0_10px_24px_rgba(26,86,219,0.28)] ring-1 ring-blue-200/80',
  green: 'bg-gradient-to-r from-[#0e9f6e] to-[#10b981] text-white shadow-[0_10px_24px_rgba(14,159,110,0.24)] ring-1 ring-emerald-200/80',
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
        'group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-all',
        isActive
          ? ACTIVE_STYLES[accent]
          : 'text-[#4b5563] hover:bg-white hover:text-[#1a56db] hover:shadow-sm hover:ring-1 hover:ring-blue-100',
      ].join(' ')
    }
  >
    {({ isActive }) => (
      <>
        <span
          className={[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
            isActive ? 'bg-white/20 text-white' : 'bg-slate-100/70 text-current group-hover:bg-blue-50',
          ].join(' ')}
        >
          <Icon size={18} />
        </span>
        <span className="truncate">{label}</span>
      </>
    )}
  </NavLink>
);

export default SidebarNavItem;
