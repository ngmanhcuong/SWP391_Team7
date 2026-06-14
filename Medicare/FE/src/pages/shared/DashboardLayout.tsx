import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../components/ui';
import { useLogout } from '../../features/auth/hooks';
import { AppRole, ROLE_LABELS, ROLE_NAV_ITEMS } from './roleConfig';

interface DashboardLayoutProps {
  role: AppRole;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const { user } = useAuthStore();
  const logout = useLogout();
  const navItems = ROLE_NAV_ITEMS[role];

  return (
    <div className="min-h-screen flex bg-[var(--bg-main)] text-[var(--text-primary)]">
      <aside className="hidden lg:flex w-64 flex-col border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="p-5 border-b border-gray-100 dark:border-slate-700">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-sm" style={{ fontFamily: 'Lexend' }}>MediCare</span>
          </Link>
          <p className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400">{ROLE_LABELS[role]}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === `/${role}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {user && (
          <div className="p-4 border-t border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={user.fullName} src={user.avatar} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.fullName}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <Link to="/" className="font-bold text-sm" style={{ fontFamily: 'Lexend' }}>MediCare</Link>
          <span className="text-xs font-medium text-blue-600">{ROLE_LABELS[role]}</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
