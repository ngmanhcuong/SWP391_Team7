import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, MessageSquare, Settings, UserRound } from 'lucide-react';
import { useDoctorNotifications } from '../../features/doctor/hooks/useDoctorNotifications';
import { DoctorNotificationType } from '../../features/doctor/types';
import { DOCTOR_PATHS } from '../../features/doctor/utils/doctorPaths';

const iconConfig: Record<
  DoctorNotificationType,
  { icon: React.ElementType; bg: string; color: string }
> = {
  appointment: { icon: Calendar, bg: 'bg-[#e8f0fe]', color: 'text-[#003d9b]' },
  patient: { icon: UserRound, bg: 'bg-amber-50', color: 'text-amber-700' },
  message: { icon: MessageSquare, bg: 'bg-indigo-50', color: 'text-indigo-600' },
  system: { icon: Settings, bg: 'bg-emerald-50', color: 'text-emerald-700' },
};

const DoctorNotificationDropdown: React.FC = () => {
  const { notifications, unreadCount, markRead, markAllRead } = useDoctorNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`relative p-2 rounded-lg transition-colors ${
          open ? 'bg-[#e8f0fe] text-[#003d9b]' : 'text-[#434654] hover:bg-[#f8f9fb]'
        }`}
        aria-label="Thông báo"
        aria-expanded={open}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(360px,calc(100vw-2rem))] bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-xl shadow-[#003d9b]/10 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#c3c6d6]/40 bg-gradient-to-r from-[#f8f9fb] to-white">
            <div>
              <p className="text-sm font-semibold text-[#191c1e]">Thông báo</p>
              <p className="text-[11px] text-[#737685]">
                {unreadCount > 0 ? `${unreadCount} chưa đọc` : 'Đã xem hết'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-semibold text-[#003d9b] hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <ul className="max-h-[320px] overflow-y-auto divide-y divide-[#c3c6d6]/20">
            {notifications.map((notif) => {
              const { icon: Icon, bg, color } = iconConfig[notif.type];
              const content = (
                <div
                  className={`flex gap-3 px-4 py-3.5 transition-colors hover:bg-[#f8f9fb] ${
                    notif.isUnread ? 'bg-[#e8f0fe]/25' : ''
                  }`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                    <Icon size={16} className={color} />
                  </span>
                  <span className="min-w-0 flex-1 pr-2">
                    <span className="flex items-start gap-2">
                      <span className="text-sm font-semibold text-[#191c1e] leading-snug">{notif.title}</span>
                      {notif.isUnread && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#003d9b]" />
                      )}
                    </span>
                    <span className="block text-xs text-[#434654] mt-1 line-clamp-2">{notif.message}</span>
                    <span className="block text-[11px] text-[#737685] mt-1">{notif.timeAgo}</span>
                  </span>
                </div>
              );

              return (
                <li key={notif.id}>
                  {notif.href ? (
                    <Link
                      to={notif.href}
                      onClick={() => {
                        markRead(notif.id);
                        setOpen(false);
                      }}
                      className="block"
                    >
                      {content}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markRead(notif.id)}
                      className="w-full text-left"
                    >
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="px-4 py-3 border-t border-[#c3c6d6]/30 bg-[#f8f9fb]/50">
            <Link
              to={DOCTOR_PATHS.settings}
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-[#003d9b] hover:underline"
            >
              Cài đặt thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorNotificationDropdown;
