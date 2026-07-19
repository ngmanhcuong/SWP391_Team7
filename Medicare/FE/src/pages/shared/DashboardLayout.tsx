import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Home,
  LogOut,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../features/auth/hooks';
import BrandLogo from '../../components/layout/BrandLogo';
import AdminNotificationDropdown from '../../components/layout/AdminNotificationDropdown';
import DashboardUserMenu from '../../components/layout/DashboardUserMenu';
import DoctorDashboardHeader from '../../components/layout/DoctorDashboardHeader';
import PatientNotificationDropdown from '../../components/layout/PatientNotificationDropdown';
import ReceptionistNotificationDropdown from '../../components/layout/ReceptionistNotificationDropdown';
import SidebarNavItem from '../../components/layout/SidebarNavItem';
import { AppRole, ROLE_LABELS, ROLE_NAV_ITEMS } from './roleConfig';
import { formatDoctorDepartment } from '../../constants/clinicSpecialties';

interface DashboardLayoutProps {
  role: AppRole;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = ROLE_NAV_ITEMS[role];
  const isPatient = role === 'patient';
  const isDoctor = role === 'doctor';
  const isReceptionist = role === 'receptionist';
  const isAdmin = role === 'admin';
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const logout = useLogout();
  const doctorDepartment = formatDoctorDepartment(user?.occupation);

  const roleRoot = `/${role}`;
  const activeNav =
    navItems.find((item) => item.path === location.pathname) ??
    navItems.find((item) => item.path !== roleRoot && location.pathname.startsWith(item.path));
  const breadcrumbLabel = activeNav?.label ?? 'Tổng quan';

  const sidebarContent = (
    <>
      <div className="h-16 flex items-center px-5 bg-white/75 backdrop-blur-xl border-b border-slate-200/70 shrink-0">
        <BrandLogo to={isPatient ? '/patient' : `/${role}`} variant="dark" />
      </div>

      <div className="flex-1 min-h-0 flex flex-col px-3 pt-4 pb-3">
        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl border border-slate-200/70 shadow-soft overflow-hidden">
          <nav className="flex-1 min-h-0 px-3 py-4 space-y-1 overflow-y-auto">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {isReceptionist ? 'Hệ thống quản lý' : ROLE_LABELS[role]}
            </p>
            {navItems.map(({ label, path, icon }) => (
              <SidebarNavItem
                key={path}
                to={path}
                icon={icon}
                label={label}
                end={path === `/${role}`}
                accent="blue"
                onClick={() => setMobileNavOpen(false)}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-[#f8fafc] text-slate-900">
      <aside className="hidden lg:flex flex-col w-[240px] h-full shrink-0">
        {sidebarContent}
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-label="Đóng menu" onClick={() => setMobileNavOpen(false)} />
          <aside className="relative flex flex-col w-[240px] max-w-[85vw] h-full bg-[#f8fafc] shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
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
          <header className="sticky top-0 z-40 h-16 flex items-center gap-3 px-4 lg:px-8 bg-white/75 backdrop-blur-xl border-b border-slate-200/70">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              aria-label="Mở menu"
            >
              <Menu size={20} />
            </button>

            <div className="lg:hidden flex items-center gap-2 flex-1 min-w-0">
              <BrandLogo to="/doctor" variant="dark" compact />
              {user && <DoctorDashboardHeader user={user} department={doctorDepartment} compact />}
            </div>

            <nav className="hidden lg:flex items-center gap-1 text-sm shrink-0" aria-label="Breadcrumb">
              <Link
                to={roleRoot}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-slate-400 hover:text-[#2563eb] hover:bg-slate-100/80 transition-colors"
              >
                <Home size={15} />
                Trang chủ
              </Link>
              <ChevronRight size={15} className="text-slate-300" />
              <span className="rounded-lg bg-[#2563eb]/[0.08] px-2.5 py-1 font-semibold text-[#1e40af]">
                {breadcrumbLabel}
              </span>
            </nav>

            <div className="hidden lg:flex flex-1 min-w-0">
              {user ? (
                <DoctorDashboardHeader user={user} department={doctorDepartment} />
              ) : (
                <div className="flex flex-1 max-w-sm ml-auto items-center gap-3 px-3.5 py-2 bg-slate-100/70 rounded-lg border border-transparent">
                  <span className="text-sm text-slate-400">Tìm kiếm bệnh nhân, lịch hẹn...</span>
                </div>
              )}
            </div>

            <div className="lg:hidden shrink-0">
              {user && <DashboardUserMenu user={user} variant="dark" />}
            </div>
          </header>
        ) : isReceptionist ? (
          <header className="sticky top-0 z-40 h-16 flex items-center gap-3 px-4 lg:px-8 bg-white/75 backdrop-blur-xl border-b border-slate-200/70">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              aria-label="Mở menu"
            >
              <Menu size={20} />
            </button>

            <div className="lg:hidden flex-1 min-w-0">
              <BrandLogo to="/receptionist" variant="dark" compact />
            </div>

            <nav className="hidden lg:flex items-center gap-1 text-sm shrink-0" aria-label="Breadcrumb">
              <Link
                to={roleRoot}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-slate-400 hover:text-[#2563eb] hover:bg-slate-100/80 transition-colors"
              >
                <Home size={15} />
                Trang chủ
              </Link>
              <ChevronRight size={15} className="text-slate-300" />
              <span className="rounded-lg bg-[#2563eb]/[0.08] px-2.5 py-1 font-semibold text-[#1e40af]">
                {breadcrumbLabel}
              </span>
            </nav>

            <div className="hidden lg:flex flex-1 justify-center px-6">
              <div className="flex w-full max-w-sm items-center gap-2.5 px-3.5 py-2 bg-slate-100/70 rounded-lg border border-transparent focus-within:border-[#2563eb]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2563eb]/10 transition-all">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bệnh nhân, mã số..."
                  className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
              <ReceptionistNotificationDropdown />
              <div className="h-7 w-px bg-slate-200 mx-1" />
              {user && (
                <DashboardUserMenu
                  user={user}
                  layout="doctor"
                  department={ROLE_LABELS[role]}
                />
              )}
            </div>
          </header>
        ) : isAdmin ? (
          <header className="sticky top-0 z-40 h-16 flex items-center gap-3 px-4 lg:px-8 bg-white/75 backdrop-blur-xl border-b border-slate-200/70">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              aria-label="Mở menu"
            >
              <Menu size={20} />
            </button>

            <div className="lg:hidden flex-1 min-w-0">
              <BrandLogo to="/admin" variant="dark" compact />
            </div>

            <nav className="hidden lg:flex items-center gap-1 text-sm shrink-0" aria-label="Breadcrumb">
              <Link
                to={roleRoot}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-slate-400 hover:text-[#2563eb] hover:bg-slate-100/80 transition-colors"
              >
                <Home size={15} />
                Trang chủ
              </Link>
              <ChevronRight size={15} className="text-slate-300" />
              <span className="rounded-lg bg-[#2563eb]/[0.08] px-2.5 py-1 font-semibold text-[#1e40af]">
                {breadcrumbLabel}
              </span>
            </nav>

            <div className="hidden lg:flex flex-1 justify-center px-6">
              <div className="flex w-full max-w-sm items-center gap-2.5 px-3.5 py-2 bg-slate-100/70 rounded-lg border border-transparent focus-within:border-[#2563eb]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2563eb]/10 transition-all">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  type="search"
                  placeholder="Tìm bác sĩ, chuyên khoa, hồ sơ..."
                  className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  readOnly
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto lg:ml-0">
              <AdminNotificationDropdown />
              <div className="h-7 w-px bg-slate-200 mx-1" />
              <span className="text-sm font-semibold text-slate-700">Admin</span>
              <button
                type="button"
                onClick={() => logout()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={15} />
              </button>
            </div>
          </header>
        ) : (
          <header className="sticky top-0 z-40 h-16 flex items-center gap-3 px-4 lg:px-8 bg-white/75 backdrop-blur-xl border-b border-slate-200/70">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              aria-label="Mở menu"
            >
              <Menu size={20} />
            </button>

            <div className="lg:hidden flex-1 min-w-0">
              <BrandLogo to={isPatient ? '/patient' : `/${role}`} variant="dark" compact />
            </div>

            <nav className="hidden lg:flex items-center gap-1 text-sm shrink-0" aria-label="Breadcrumb">
              <Link
                to={roleRoot}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-slate-400 hover:text-[#2563eb] hover:bg-slate-100/80 transition-colors"
              >
                <Home size={15} />
                Trang chủ
              </Link>
              <ChevronRight size={15} className="text-slate-300" />
              <span className="rounded-lg bg-[#2563eb]/[0.08] px-2.5 py-1 font-semibold text-[#1e40af]">
                {breadcrumbLabel}
              </span>
            </nav>

            <div className="hidden lg:flex flex-1 justify-center px-6">
              <div className="flex w-full max-w-sm items-center gap-2.5 px-3.5 py-2 bg-slate-100/70 rounded-lg border border-transparent focus-within:border-[#2563eb]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2563eb]/10 transition-all">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  type="search"
                  placeholder="Tìm bác sĩ, chuyên khoa, hồ sơ..."
                  className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  onFocus={() => isPatient && navigate('/patient/lich-hen')}
                  readOnly={isPatient}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
              <PatientNotificationDropdown />

              <div className="h-7 w-px bg-slate-200 mx-1" />

              {user && <DashboardUserMenu user={user} variant="dark" />}
            </div>
          </header>
        )}

        <main id="dashboard-main-scroll" className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
