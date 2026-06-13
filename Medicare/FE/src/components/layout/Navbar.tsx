import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../ui';
import { useLogout } from '../../features/auth/hooks';

const Navbar: React.FC = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const logout = useLogout();

  return (
    <header style={{ background: '#1a56db', boxShadow: '0 2px 16px rgba(26,86,219,0.15)' }} className="sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" fill="#1a56db" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: 'Lexend' }}>MediCare AI Clinic</span>
          </Link>

          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <button className="relative p-2 text-blue-100 hover:bg-white/10 rounded-lg transition-colors">
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2 p-1.5 rounded-xl text-white hover:bg-white/10 transition-colors"
                    aria-label="Menu tài khoản"
                  >
                    <Avatar name={user.fullName} src={user.avatar} size="sm" />
                    <span className="hidden xl:block text-sm font-medium max-w-[180px] truncate" title={user.fullName}>
                      {user.fullName}
                    </span>
                    <ChevronDown size={14} className={`hidden sm:block transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link to="/ho-so" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        <User size={15} className="text-gray-400" /> Hồ sơ cá nhân
                      </Link>
                      <Link to="/cai-dat" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        <Settings size={15} className="text-gray-400" /> Cài đặt hệ thống
                      </Link>
                      <hr className="my-1 border-gray-100 dark:border-slate-700" />
                      <button onClick={() => { setUserMenuOpen(false); logout(); }} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors">
                        <LogOut size={15} /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/dang-nhap" className="text-sm font-medium text-blue-100 hover:text-white px-3 py-2 transition-colors">Đăng nhập</Link>
                <Link to="/dang-ky" className="text-sm font-semibold text-blue-700 bg-white hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
