import React from 'react';
import { CheckCheck, Search } from 'lucide-react';

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
  <header className="space-y-4">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-[32px] font-semibold leading-10 tracking-tight text-[#003d9b]">
          Thông báo
        </h1>
        <p className="text-base text-[#434654]">
          {unreadCount > 0
            ? `Bạn có ${unreadCount} thông báo chưa đọc liên quan đến lịch khám và sức khỏe.`
            : 'Tất cả thông báo đã được đọc. Bạn sẽ nhận cập nhật mới tại đây.'}
        </p>
      </div>
      <button
        type="button"
        onClick={onMarkAllRead}
        disabled={unreadCount === 0}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#c3c6d6] bg-white px-5 py-2.5 text-sm text-[#003d9b] hover:bg-[#f8f9fb] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CheckCheck size={16} />
        Đánh dấu tất cả đã đọc
      </button>
    </div>

    <div className="relative max-w-xl">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685]" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Tìm theo nội dung thông báo..."
        className="w-full rounded-full border border-[#c3c6d6] bg-[#f8f9fb] py-3 pl-11 pr-4 text-base text-[#191c1e] placeholder:text-[#737685] outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
      />
    </div>
  </header>
);

export default NotificationsPageHeader;
