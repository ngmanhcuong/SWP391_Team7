import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell,
  Calendar,
  Headphones,
  HelpCircle,
  LogOut,
  Menu,
  Search,
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
import { Avatar } from '../../components/ui';
import { AppRole, ROLE_LABELS, ROLE_NAV_ITEMS, getRoleSettingsPath } from './roleConfig';
import { formatDoctorDepartment } from '../../constants/clinicSpecialties';

interface DashboardLayoutProps {
  role: AppRole;
}

interface AdminNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionLabel: string;
  actionPath: string;
}

const INITIAL_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'admin-notif-1',
    title: 'Lịch hẹn mới cần xác nhận',
    description: 'Có lịch hẹn mới đang chờ quản trị viên kiểm tra.',
    time: '5 phút trước',
    read: false,
    actionLabel: 'Mở quản lý lịch hẹn',
    actionPath: '/admin/lich-hen',
  },
  {
    id: 'admin-notif-2',
    title: 'Đánh giá mới cần kiểm duyệt',
    description: 'Có phản hồi mới từ bệnh nhân cần xem xét.',
    time: '20 phút trước',
    read: false,
    actionLabel: 'Mở quản lý đánh giá',
    actionPath: '/admin/danh-gia',
  },
  {
    id: 'admin-notif-3',
    title: 'Có cập nhật trong nhật ký hệ thống',
    description: 'Một số thao tác quản trị vừa được ghi nhận.',
    time: '1 giờ trước',
    read: false,
    actionLabel: 'Mở nhật ký hệ thống',
    actionPath: '/admin/nhat-ky',
  },
  {
    id: 'admin-notif-4',
    title: 'Vật tư sắp hết',
    description: 'Một số vật tư trong báo cáo đang ở trạng thái sắp hết.',
    time: 'Hôm qua',
    read: true,
    actionLabel: 'Mở báo cáo thống kê',
    actionPath: '/admin/bao-cao',
  },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const logout = useLogout();
  const navItems = ROLE_NAV_ITEMS[role];
  const isPatient = role === 'patient';
  const isDoctor = role === 'doctor';
  const isReceptionist = role === 'receptionist';
  const isAdmin = role === 'admin';
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState(INITIAL_ADMIN_NOTIFICATIONS);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const unreadNotificationCount = useUnreadNotificationCount(isPatient ? user : null);
  const doctorDepartment = formatDoctorDepartment(user?.occupation);
  const unreadAdminNotificationCount = adminNotifications.filter((item) => !item.read).length;
  const selectedNotification = adminNotifications.find((item) => item.id === selectedNotificationId);

  const markNotificationRead = (id: string) => {
    setAdminNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  const openNotificationDetail = (id: string) => {
    markNotificationRead(id);
    setSelectedNotificationId(id);
  };

  const deleteNotification = (id: string) => {
    setAdminNotifications((prev) => prev.filter((item) => item.id !== id));
    setSelectedNotificationId((current) => (current === id ? null : current));
  };

  const goToNotificationTarget = (notification: AdminNotification) => {
    markNotificationRead(notification.id);
    setNotificationOpen(false);
    navigate(notification.actionPath);
  };

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-[#dbe5f6] shrink-0 bg-gradient-to-br from-white via-blue-50/40 to-white">
        <BrandLogo to={isPatient ? '/patient' : `/${role}`} variant="dark" />
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#1a56db]">
          {isReceptionist ? 'Hệ thống quản lý' : ROLE_LABELS[role]}
        </p>
      </div>

      <nav className="flex-1 min-h-0 p-3 space-y-1.5 overflow-y-auto">
        {isAdmin && (
          <p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Admin menu
          </p>
        )}
        {navItems.map(({ label, path, icon }) => (
          <SidebarNavItem
            key={path}
            to={path}
            icon={icon}
            label={label}
            end={path === `/${role}`}
            accent={isReceptionist ? 'green' : 'blue'}
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

      <div className="p-3 border-t border-[#dbe5f6] space-y-1 shrink-0 bg-white/70">
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
        ) : isReceptionist ? (
          <>
            {user && (
              <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 mb-1">
                <Avatar name={user.fullName} src={user.avatar} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#191c1e] truncate">{user.fullName}</p>
                  <p className="text-xs text-[#737685]">{ROLE_LABELS[role]}</p>
                </div>
              </div>
            )}
            <SidebarNavItem
              to={getRoleSettingsPath(role)}
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
              Hỗ trợ
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
        ) : isPatient ? (
          <>
            <SidebarNavItem
              to={getRoleSettingsPath(role)}
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
        ) : (
          null
        )}
      </div>
    </>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(26,86,219,0.12),transparent_35%),linear-gradient(135deg,#f8fbff_0%,#f5f7fb_45%,#eef5ff_100%)] text-[var(--text-primary)]">
      <aside className="hidden lg:flex w-[276px] h-full flex-col border-r border-[#dbe5f6]/80 bg-white/85 backdrop-blur-xl shrink-0 overflow-hidden shadow-[8px_0_30px_rgba(15,23,42,0.04)]">
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
        ) : isReceptionist ? (
          <header className="sticky top-0 z-40 h-16 flex items-center gap-3 px-4 lg:px-6 bg-white border-b border-[#c3c6d6]/40 shadow-sm">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 text-[#434654] hover:bg-[#f8f9fb] rounded-lg transition-colors shrink-0"
              aria-label="Mở menu"
            >
              <Menu size={20} />
            </button>

            <div className="lg:hidden flex-1 min-w-0">
              <BrandLogo to="/receptionist" variant="dark" compact />
            </div>

            <div className="hidden lg:flex flex-1 max-w-xl items-center gap-2.5 px-4 py-2.5 bg-[#f8f9fb] rounded-xl border border-[#c3c6d6]/50 focus-within:border-[#1a56db]/60 transition-colors">
              <Search size={16} className="text-[#737685] shrink-0" />
              <input
                type="text"
                placeholder="Tìm kiếm bệnh nhân, mã số..."
                className="flex-1 bg-transparent text-sm text-[#191c1e] placeholder:text-[#737685] outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                className="relative p-2 text-[#434654] hover:bg-[#f8f9fb] rounded-lg transition-colors"
                aria-label="Thông báo"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <button
                type="button"
                className="p-2 text-[#434654] hover:bg-[#f8f9fb] rounded-lg transition-colors"
                aria-label="Cài đặt"
              >
                <Settings size={18} />
              </button>
              <div className="h-8 w-px bg-[#c3c6d6]/60 mx-1" />
              {user && (
                <DashboardUserMenu
                  user={user}
                  layout="doctor"
                  department={ROLE_LABELS[role]}
                />
              )}
            </div>
          </header>
        ) : (
          <header
            className="sticky top-0 z-40 h-16 flex items-center gap-3 px-4 lg:px-7 shadow-[0_10px_35px_rgba(26,86,219,0.22)]"
            style={{ background: isAdmin ? 'linear-gradient(90deg, #1747c8 0%, #1a56db 48%, #0ea5e9 100%)' : '#1a56db' }}
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
              {isPatient ? (
                <Link
                  to="/patient/thong-bao"
                  className="relative p-2 text-blue-100 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Thông báo"
                >
                  <Bell size={18} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-400 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                      {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                    </span>
                  )}
                </Link>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationOpen((open) => !open)}
                    className="relative p-2 text-blue-100 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Thông báo"
                    aria-expanded={notificationOpen}
                  >
                    <Bell size={18} />
                    {unreadAdminNotificationCount > 0 && (
                      <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-400 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                        {unreadAdminNotificationCount > 9 ? '9+' : unreadAdminNotificationCount}
                      </span>
                    )}
                  </button>

                  {notificationOpen && (
                    <>
                      <button
                        type="button"
                        aria-label="Đóng thông báo"
                        className="fixed inset-0 z-40"
                        onClick={() => setNotificationOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-100 bg-white py-2 shadow-xl z-50 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-slate-700">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Thông báo</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                              {unreadAdminNotificationCount > 0
                                ? `${unreadAdminNotificationCount} thông báo chưa đọc`
                                : 'Không có thông báo mới'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setAdminNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
                            }
                            className="text-xs font-semibold text-[#1a56db] hover:underline"
                          >
                            Đã đọc
                          </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {adminNotifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-slate-400">
                              Không còn thông báo nào.
                            </div>
                          ) : (
                            adminNotifications.map((item) => (
                              <div
                                key={item.id}
                                className={`flex items-start gap-2 px-4 py-3 transition-colors ${
                                  selectedNotificationId === item.id
                                    ? 'bg-blue-50 dark:bg-slate-700'
                                    : 'hover:bg-gray-50 dark:hover:bg-slate-700'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => openNotificationDetail(item.id)}
                                  className="flex flex-1 gap-3 text-left"
                                >
                                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.read ? 'bg-gray-300' : 'bg-red-400'}`} />
                                  <span className="min-w-0">
                                    <span className="block text-sm font-semibold text-gray-800 dark:text-slate-100">
                                      {item.title}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-gray-500 dark:text-slate-400">
                                      {item.description}
                                    </span>
                                    <span className="mt-1 block text-[11px] text-gray-400">{item.time}</span>
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteNotification(item.id)}
                                  className="rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                  aria-label={`Xóa thông báo ${item.title}`}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                        {selectedNotification && (
                          <div className="border-t border-gray-100 px-4 py-3 dark:border-slate-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                              {selectedNotification.title}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                              {selectedNotification.description}
                            </p>
                            <div className="mt-3 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => goToNotificationTarget(selectedNotification)}
                                className="rounded-lg bg-[#1a56db] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1649bd]"
                              >
                                {selectedNotification.actionLabel}
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteNotification(selectedNotification.id)}
                                className="rounded-lg px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {user && <DashboardUserMenu user={user} variant="light" />}
            </div>
          </header>
        )}

        <main id="dashboard-main-scroll" className={`flex-1 min-h-0 overflow-y-auto ${isDoctor || isReceptionist ? 'p-4 sm:p-6 lg:p-8 bg-[#f8f9fb]' : 'p-4 sm:p-6 lg:p-8'}`}>
          <div className={isAdmin ? 'mx-auto w-full max-w-[1500px]' : undefined}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
