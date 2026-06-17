import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  Bell,
  Calendar,
  Headphones,
  HelpCircle,
  LogOut,
  Menu,
  Settings,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../features/auth/hooks';
import { useUnreadNotificationCount } from '../../features/patient/hooks';
import BrandLogo from '../../components/layout/BrandLogo';
import DashboardUserMenu from '../../components/layout/DashboardUserMenu';
import DoctorDashboardHeader from '../../components/layout/DoctorDashboardHeader';
import SidebarNavItem from '../../components/layout/SidebarNavItem';
import Button from '../../components/ui/Button';
import { AppRole, ROLE_LABELS, ROLE_NAV_ITEMS } from './roleConfig';
import { formatDoctorDepartment } from '../../constants/clinicSpecialties';

interface DashboardLayoutProps {
  role: AppRole;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const { user } = useAuthStore();
  const logout = useLogout();
  const navItems = ROLE_NAV_ITEMS[role];
  const isPatient = role === 'patient';
  const isDoctor = role === 'doctor';
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const unreadNotificationCount = useUnreadNotificationCount(isPatient ? user : null);
  const doctorDepartment = formatDoctorDepartment(user?.occupation);

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-[#c3c6d6] shrink-0">
        <BrandLogo to={isPatient ? '/patient' : `/${role}`} variant="dark" />
        <p className="mt-2 text-xs font-medium text-[#003d9b]">{ROLE_LABELS[role]}</p>
      </div>

      <nav className="flex-1 min-h-0 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ label, path, icon }) => (
          <SidebarNavItem
            key={path}
            to={path}
            icon={icon}
            label={label}
            end={path === `/${role}`}
            onClick={() => setMobileNavOpen(false)}
          />
        ))}

        {isPatient && (
          <Link to="/patient/lich-hen" onClick={() => setMobileNavOpen(false)} className="block mt-4 mx-1">
            <Button fullWidth leftIcon={<Calendar size={16} />}>
              Đặt lịch khám
            </Button>
          </Link>
        )}
      </nav>

      <div className="p-3 border-t border-[#c3c6d6] space-y-1 shrink-0">
        {isDoctor ? (
          <>
            <button
              type="button"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#003d9b] px-3 text-sm font-semibold text-white hover:bg-[#002d75] transition-colors mx-1 mb-2"
              style={{ width: 'calc(100% - 8px)' }}
            >
              <Headphones size={16} />
              Hỗ trợ kỹ thuật
            </button>
            <button
              type="button"
              onClick={() => { setMobileNavOpen(false); logout(); }}
              className="group flex h-10 w-full items-center gap-3 rounded-lg border-l-4 border-transparent px-3 text-sm font-medium text-[#434654] hover:bg-[#f8f9fb] hover:text-[#191c1e] transition-all"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                <LogOut size={18} />
              </span>
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <SidebarNavItem
              to="/cai-dat"
              icon={Settings}
              label="Cài đặt"
              onClick={() => setMobileNavOpen(false)}
            />
            <button
              type="button"
              className="group flex h-10 w-full items-center gap-3 rounded-lg border-l-4 border-transparent px-3 text-sm font-medium text-[#434654] hover:bg-[#f8f9fb] hover:text-[#191c1e] transition-all"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                <HelpCircle size={18} />
              </span>
              Trợ giúp
            </button>
          </>
        )}
      </div>
    </>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-[#f8f9fb] to-blue-50/40 text-[var(--text-primary)]">
      <aside className="hidden lg:flex w-[260px] h-full flex-col border-r border-[#c3c6d6]/40 bg-white/80 backdrop-blur-sm shrink-0 overflow-hidden">
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

      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {isDoctor ? (
          <header className="sticky top-0 z-40 min-h-16 flex items-center gap-3 px-4 lg:px-6 py-3 bg-white border-b border-[#c3c6d6]/40 shadow-sm">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 text-[#434654] hover:bg-[#f8f9fb] rounded-lg transition-colors shrink-0"
              aria-label="Mở menu"
            >
              <Menu size={20} />
            </button>

            <div className="lg:hidden flex items-center gap-2 flex-1 min-w-0">
              <BrandLogo to="/doctor" variant="dark" compact />
              {user && <DoctorDashboardHeader user={user} department={doctorDepartment} compact />}
            </div>

            <div className="hidden lg:flex flex-1 min-w-0">
              {user ? (
                <DoctorDashboardHeader user={user} department={doctorDepartment} />
              ) : (
                <div className="flex flex-1 max-w-xl items-center gap-3 px-4 py-2.5 bg-[#f8f9fb] rounded-xl border border-[#c3c6d6]/50">
                  <span className="text-sm text-[#737685]">Tìm kiếm bệnh nhân, lịch hẹn...</span>
                </div>
              )}
            </div>

            <div className="lg:hidden shrink-0">
              {user && <DashboardUserMenu user={user} variant="dark" />}
            </div>
          </header>
        ) : (
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
                {isPatient && unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-400 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                )}
              </Link>

              {user && <DashboardUserMenu user={user} variant="light" />}
            </div>
          </header>
        )}

        <main id="dashboard-main-scroll" className={`flex-1 min-h-0 overflow-y-auto ${isDoctor ? 'p-4 sm:p-6 lg:p-8 bg-[#f8f9fb]' : 'p-4 sm:p-6 lg:p-8'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
