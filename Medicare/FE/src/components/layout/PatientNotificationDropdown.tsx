import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Calendar,
  FlaskConical,
  Pill,
  Receipt,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { usePatientNotifications } from '../../features/patient/hooks';
import { NotificationType } from '../../features/patient/types';

const iconConfig: Record<
  NotificationType,
  { icon: React.ElementType; bg: string; color: string }
> = {
  appointment: { icon: Calendar, bg: 'bg-blue-50', color: 'text-[#2563eb]' },
  lab: { icon: FlaskConical, bg: 'bg-cyan-50', color: 'text-cyan-600' },
  prescription: { icon: Pill, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  payment: { icon: Receipt, bg: 'bg-amber-50', color: 'text-amber-600' },
  system: { icon: Settings, bg: 'bg-slate-100', color: 'text-slate-600' },
};

const PatientNotificationDropdown: React.FC = () => {
  const { user } = useAuthStore();
  const { data, markRead, markAllRead } = usePatientNotifications(user);
  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;
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
          open ? 'bg-blue-50 text-[#2563eb]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }`}
        aria-label="Thông báo"
        aria-expanded={open}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(380px,calc(100vw-2rem))] bg-white border border-slate-200/70 rounded-2xl shadow-xl shadow-blue-500/10 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div>
              <p className="text-sm font-bold text-slate-900">Thông báo</p>
              <p className="text-[11px] text-slate-500">
                {unreadCount > 0 ? `${unreadCount} chưa đọc` : 'Đã xem hết'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-semibold text-[#2563eb] hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-10 text-sm text-slate-500 text-center">
              Bạn chưa có thông báo nào.
            </p>
          ) : (
            <ul className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
              {notifications.map((notif) => {
                const { icon: Icon, bg, color } = iconConfig[notif.type];
                const content = (
                  <div
                    className={`flex gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50 ${
                      notif.isUnread ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                      <Icon size={16} className={color} />
                    </span>
                    <span className="min-w-0 flex-1 pr-2">
                      <span className="flex items-start gap-2">
                        <span className="text-sm font-semibold text-slate-900 leading-snug">{notif.title}</span>
                        {notif.isUnread && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2563eb]" />
                        )}
                      </span>
                      <span className="block text-xs text-slate-600 mt-1 line-clamp-2">{notif.description}</span>
                      <span className="block text-[11px] text-slate-400 mt-1">{notif.timeAgo}</span>
                    </span>
                  </div>
                );

                return (
                  <li key={notif.id}>
                    {notif.action?.href ? (
                      <Link
                        to={notif.action.href}
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
          )}

          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <Link
              to="/patient/thong-bao"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-[#2563eb] hover:underline"
            >
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientNotificationDropdown;
