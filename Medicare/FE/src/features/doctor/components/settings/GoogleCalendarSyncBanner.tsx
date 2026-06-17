import React from 'react';
import { RefreshCw } from 'lucide-react';
import Button from '../../../../components/ui/Button';

const GoogleCalendarSyncBanner: React.FC = () => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6 rounded-2xl bg-[#e8f0fe]/70 border border-[#003d9b]/15">
    <div className="flex items-start gap-3 flex-1 min-w-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80">
        <RefreshCw size={20} className="text-[#003d9b]" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#191c1e]">Đồng bộ với Google Calendar</p>
        <p className="text-sm text-[#434654] mt-1 leading-relaxed">
          Tự động chặn lịch trên MedCare khi bạn có sự kiện bận trên Google Calendar cá nhân.
        </p>
      </div>
    </div>
    <Button variant="outline" size="sm" className="shrink-0 border-[#003d9b] text-[#003d9b] hover:bg-white">
      Thiết lập đồng bộ
    </Button>
  </div>
);

export default GoogleCalendarSyncBanner;
