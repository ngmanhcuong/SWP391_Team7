import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import BrandLogo from './BrandLogo';
import DashboardUserMenu from './DashboardUserMenu';
import { getRoleDashboardPath } from '../../pages/shared/roleConfig';

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const homePath = isAuthenticated && user ? getRoleDashboardPath(user.role) : '/';

  return (
    <header style={{ background: '#1a56db', boxShadow: '0 2px 16px rgba(26,86,219,0.15)' }} className="sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <BrandLogo to={homePath} variant="light" />

          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <button type="button" className="relative p-2 text-blue-100 hover:bg-white/10 rounded-lg transition-colors" aria-label="Thông báo">
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
                </button>
                <DashboardUserMenu user={user} variant="light" />
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
