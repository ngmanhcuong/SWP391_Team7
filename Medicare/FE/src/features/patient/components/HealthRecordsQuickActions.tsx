import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';

interface HealthRecordsQuickActionsProps {
  pendingLabCount: number;
}

const HealthRecordsQuickActions: React.FC<HealthRecordsQuickActionsProps> = ({
  pendingLabCount,
}) => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
    <div className="border-b border-[#c3c6d6]/60 px-6 py-4">
      <h3 className="text-lg font-semibold text-[#191c1e]">Thao tác nhanh</h3>
    </div>
    <div className="p-4 space-y-2">
      <Link
        to="/patient/benh-nhan"
        className="group flex items-center gap-3 rounded-xl border border-[#c3c6d6]/60 px-4 py-3 text-sm font-medium text-[#191c1e] hover:bg-[#f8f9fb] hover:border-[#003d9b]/30 transition-colors"
      >
        <User size={16} className="text-[#003d9b]" />
        Xem hồ sơ cá nhân
      </Link>
      <Link
        to="/patient/lich-hen"
        className="group flex items-center gap-3 rounded-xl border border-[#c3c6d6]/60 px-4 py-3 text-sm font-medium text-[#191c1e] hover:bg-[#f8f9fb] hover:border-[#003d9b]/30 transition-colors"
      >
        <Calendar size={16} className="text-[#003d9b]" />
        Đặt lịch tái khám
      </Link>
      {pendingLabCount > 0 && (
        <p className="text-xs text-[#7a4f01] bg-[#fff8e6] border border-[#f5d080] rounded-xl px-3 py-2">
          Bạn có {pendingLabCount} xét nghiệm đang chờ kết quả.
        </p>
      )}
    </div>
  </div>
);

export default HealthRecordsQuickActions;
