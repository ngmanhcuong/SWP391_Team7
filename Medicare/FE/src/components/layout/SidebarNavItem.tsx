import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
  onClick?: () => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  to,
  icon: Icon,
  label,
  end = false,
  onClick,
}) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      [
        'group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all',
        isActive
          ? 'border-l-4 border-[#003d9b] bg-[rgba(0,82,204,0.1)] pl-[10px] text-[#003d9b]'
          : 'border-l-4 border-transparent text-[#434654] hover:bg-[#f8f9fb] hover:text-[#191c1e]',
      ].join(' ')
    }
  >
    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
      <Icon size={18} />
    </span>
    {label}
  </NavLink>
);

export default SidebarNavItem;
