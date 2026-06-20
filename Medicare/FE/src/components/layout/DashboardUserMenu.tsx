import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { Avatar } from '../ui';
import { useLogout } from '../../features/auth/hooks';
import { getRoleDashboardPath, getRoleProfilePath, getRoleSettingsPath } from '../../pages/shared/roleConfig';
import { User as UserType } from '../../types';

interface DashboardUserMenuProps {
  user: UserType;
  variant?: 'light' | 'dark';
  layout?: 'default' | 'doctor';
  displayName?: string;
  department?: string;
}

const DashboardUserMenu: React.FC<DashboardUserMenuProps> = ({
  user,
  variant = 'dark',
  layout = 'default',
  displayName,
  department,
}) => {
  const [open, setOpen] = useState(false);
  const logout = useLogout();
  const isLight = variant === 'light';
  const isDoctorLayout = layout === 'doctor';
  const nameLabel = displayName || user.fullName;
  const dashboardPath = getRoleDashboardPath(user.role);
  const profilePath = getRoleProfilePath();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={
          isDoctorLayout
            ? 'flex items-center gap-2.5 rounded-xl px-1.5 py-1 transition-colors text-gray-700 hover:bg-[#f8f9fb]'
            : `flex items-center gap-2 p-1.5 rounded-xl transition-colors ${
                isLight
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
        }
        aria-label="Menu tài khoản"
        aria-expanded={open}
      >
        <Avatar name={user.fullName} src={user.avatar} size="sm" />
        {isDoctorLayout ? (
          <>
            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold text-[#191c1e] truncate max-w-[140px]">{nameLabel}</p>
              {department && (
                <p className="text-xs text-[#737685] truncate max-w-[140px]">{department}</p>
              )}
            </div>
            <ChevronDown
              size={14}
              className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''} text-gray-400`}
            />
          </>
        ) : (
          <>
            <span
              className={`hidden md:block text-sm font-medium max-w-[160px] truncate ${isLight ? 'text-white' : 'text-gray-800'}`}
              title={user.fullName}
            >
              {user.fullName}
            </span>
            <ChevronDown
              size={14}
              className={`hidden sm:block transition-transform ${open ? 'rotate-180' : ''} ${isLight ? 'text-blue-100' : 'text-gray-400'}`}
            />
          </>
        )}
      </button>

      {open && (
        <>
          <button type="button" className="fixed inset-0 z-40" aria-label="Đóng menu" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
            </div>
            <Link
              to={dashboardPath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <LayoutDashboard size={15} className="text-gray-400" /> Bảng điều khiển
            </Link>
            <Link
              to={profilePath}
              state={{ from: dashboardPath }}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <User size={15} className="text-gray-400" /> Hồ sơ cá nhân
            </Link>
            <Link
              to={getRoleSettingsPath(user.role)}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Settings size={15} className="text-gray-400" /> Cài đặt hệ thống
            </Link>
            <hr className="my-1 border-gray-100 dark:border-slate-700" />
            <button
              type="button"
              onClick={() => { setOpen(false); logout(); }}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
            >
              <LogOut size={15} /> Đăng xuất
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardUserMenu;
