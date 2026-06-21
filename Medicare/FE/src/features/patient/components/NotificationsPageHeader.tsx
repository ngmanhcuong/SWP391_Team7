import React from 'react';
import { Bell, CheckCheck, Search } from 'lucide-react';

interface NotificationsPageHeaderProps {
  unreadCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onMarkAllRead: () => void;
}

const NotificationsPageHeader: React.FC<NotificationsPageHeaderProps> = ({
  unreadCount,
  searchQuery,
  onSearchChange,
  onMarkAllRead,
}) => (
  <header className="space-y-5">
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#06b6d4] p-6 sm:p-8 shadow-soft-lg">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-white/15 blur-3xl" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm ring-1 ring-white/20">
            <Bell size={14} className="text-cyan-200" />
            Trung tâm thông báo
            {unreadCount > 0 && (
              <span className="ml-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
            Thông báo
          </h1>
          <p className="text-base text-blue-50/90 max-w-xl">
            {unreadCount > 0
              ? `Bạn có ${unreadCount} thông báo chưa đọc liên quan đến lịch khám và sức khỏe.`
              : 'Tất cả thông báo đã được đọc. Bạn sẽ nhận cập nhật mới tại đây.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#1e40af] hover:bg-blue-50 transition-colors shrink-0 shadow-lg shadow-blue-900/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <CheckCheck size={16} />
          Đánh dấu tất cả đã đọc
        </button>
      </div>
    </div>

    <div className="relative max-w-xl">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Tìm theo nội dung thông báo..."
        className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-colors"
      />
    </div>
  </header>
);

export default NotificationsPageHeader;
