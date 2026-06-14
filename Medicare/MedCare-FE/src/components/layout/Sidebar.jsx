import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { BrandLogo } from '../common';
import { SIDEBAR_MAIN_GROUPS, SIDEBAR_FOOTER_ITEMS } from '../../constants/navigation';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui';
import SidebarNavItem from './SidebarNavItem';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="shrink-0 border-b border-gray-100 p-5">
        <Link to={ROUTES.HOME}>
          <BrandLogo />
        </Link>
        <p className="mt-3 text-xs font-medium text-[#1a56db]">{user?.role || 'Bệnh nhân'}</p>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        {SIDEBAR_MAIN_GROUPS.map((group) => (
          <div key={group.id}>
            {group.title && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map(({ label, path, icon, end }) => (
                <SidebarNavItem key={path} to={path} icon={icon} label={label} end={end} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-4 border-t border-gray-100 p-4">
        <Button className="w-full" leftIcon={<Plus className="h-4 w-4" />}>
          Tạo Hồ Sơ Mới
        </Button>
        <div className="space-y-1">
          {SIDEBAR_FOOTER_ITEMS.map(({ label, path, icon }) => (
            <SidebarNavItem key={path} to={path} icon={icon} label={label} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
