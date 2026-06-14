import { NavLink } from 'react-router-dom';

const SidebarNavItem = ({ to, icon: Icon, label, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors',
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        ].join(' ')
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

export default SidebarNavItem;
