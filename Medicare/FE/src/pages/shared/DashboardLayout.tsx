import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  Bell,
  Calendar,
  HelpCircle,
  Menu,
  Settings,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import BrandLogo from '../../components/layout/BrandLogo';
import DashboardUserMenu from '../../components/layout/DashboardUserMenu';
import Button from '../../components/ui/Button';
import { AppRole, ROLE_LABELS, ROLE_NAV_ITEMS } from './roleConfig';

interface DashboardLayoutProps {
  role: AppRole;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const { user } = useAuthStore();
  const navItems = ROLE_NAV_ITEMS[role];
  const isPatient = role === 'patient';
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-gray-100">
        <BrandLogo to={isPatient ? '/patient' : `/${role}`} variant="dark" />
        <p className="mt-2 text-xs font-medium text-[#1a56db]">{ROLE_LABELS[role]}</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === `/${role}`}
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-[#1a56db]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        {isPatient && (
          <Link to="/patient/lich-hen" onClick={() => setMobileNavOpen(false)} className="block mt-4 mx-1">
            <Button fullWidth leftIcon={<Calendar size={16} />}>
              Đặt lịch khám
            </Button>
          </Link>
        )}
      </nav>

      <div className="p-3 border-t border-gray-100 space-y-1">
        <Link
          to="/cai-dat"
          onClick={() => setMobileNavOpen(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Settings size={18} />
          Cài đặt
        </Link>
        <button
          type="button"
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <HelpCircle size={18} />
          Trợ giúp
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 text-[var(--text-primary)]">
      <aside className="hidden lg:flex w-[260px] flex-col border-r border-gray-100 bg-white shrink-0">
        {sidebarContent}
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Đóng menu" onClick={() => setMobileNavOpen(false)} />
          <aside className="relative flex flex-col w-[280px] max-w-[85vw] h-full bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-40 h-16 flex items-center gap-3 px-4 lg:px-6 shadow-[0_2px_16px_rgba(26,86,219,0.15)]"
          style={{ background: '#1a56db' }}
        >
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden p-2 text-blue-100 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Mở menu"
          >
            <Menu size={20} />
          </button>

          <div className="lg:hidden flex-1 min-w-0">
            <BrandLogo to={isPatient ? '/patient' : `/${role}`} variant="light" compact />
          </div>

          <div className="hidden lg:block flex-1" />

          <div className="flex items-center gap-2 ml-auto">
            <Link
              to={isPatient ? '/patient/thong-bao' : '#'}
              className="relative p-2 text-blue-100 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Thông báo"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
            </Link>

            {user && <DashboardUserMenu user={user} variant="light" />}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
