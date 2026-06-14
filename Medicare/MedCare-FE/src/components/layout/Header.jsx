import { useState } from 'react';
import { Bell, ChevronDown, LogOut, Search, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import { Input, Avatar } from '../ui';

const Header = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed left-64 right-0 top-0 z-20 h-16 border-b border-blue-700/20 bg-[#1a56db] shadow-[0_2px_16px_rgba(26,86,219,0.15)]"
    >
      <div className="flex h-full items-center justify-between gap-4 px-6">
        <div className="max-w-md flex-1">
          <Input
            placeholder="Tìm kiếm bệnh nhân, bác sĩ..."
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
            className="border-white/20 bg-white/95 focus:border-white focus:bg-white"
            containerClassName="mb-0"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative rounded-lg p-2 text-blue-100 transition-colors hover:bg-white/10"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-400" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-xl p-1.5 text-white transition-colors hover:bg-white/10"
            >
              <Avatar name={user?.fullName} size="sm" />
              <span className="hidden max-w-[160px] truncate text-sm font-medium xl:block">
                {user?.fullName}
              </span>
              <ChevronDown
                className={`hidden h-4 w-4 sm:block ${menuOpen ? 'rotate-180' : ''} transition-transform`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-gray-900">{user?.fullName}</p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{user?.role}</p>
                </div>
                <Link
                  to={ROUTES.SETTINGS}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User className="h-4 w-4 text-gray-400" />
                  Hồ sơ cá nhân
                </Link>
                <Link
                  to={ROUTES.SETTINGS}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  Cài đặt hệ thống
                </Link>
                <hr className="my-1 border-gray-100" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
