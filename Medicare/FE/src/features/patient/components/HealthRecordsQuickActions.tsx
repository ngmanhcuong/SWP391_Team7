import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';

interface HealthRecordsQuickActionsProps {
  pendingLabCount: number;
}

const HealthRecordsQuickActions: React.FC<HealthRecordsQuickActionsProps> = ({
  pendingLabCount,
}) => (
  <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm overflow-hidden">
    <div className="border-b border-[#c3c6d6] px-6 py-4">
      <h3 className="text-lg font-medium text-[#191c1e]">Thao tác nhanh</h3>
    </div>
    <div className="p-4 space-y-2">
      <Link
        to="/patient/benh-nhan"
        className="flex items-center gap-3 rounded-lg border border-[#c3c6d6] px-4 py-3 text-sm text-[#191c1e] hover:bg-[#f8f9fb] transition-colors"
      >
        <User size={16} className="text-[#003d9b]" />
        Xem hồ sơ cá nhân
      </Link>
      <Link
        to="/patient/lich-hen"
        className="flex items-center gap-3 rounded-lg border border-[#c3c6d6] px-4 py-3 text-sm text-[#191c1e] hover:bg-[#f8f9fb] transition-colors"
      >
        <Calendar size={16} className="text-[#003d9b]" />
        Đặt lịch tái khám
      </Link>
      {pendingLabCount > 0 && (
        <p className="text-xs text-[#7a4f01] bg-[#fff8e6] border border-[#f5d080] rounded-lg px-3 py-2">
          Bạn có {pendingLabCount} xét nghiệm đang chờ kết quả.
        </p>
      )}
    </div>
  </div>
);

export default HealthRecordsQuickActions;
