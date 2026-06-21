import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Settings, User } from 'lucide-react';

const NotificationsPreferencesPanel: React.FC = () => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
    <div className="border-b border-[#c3c6d6]/60 px-6 py-4">
      <h3 className="text-lg font-semibold text-[#191c1e]">Liên kết nhanh</h3>
      <p className="text-xs text-[#737685] mt-0.5">Truy cập nhanh các mục liên quan</p>
    </div>
    <div className="p-4 space-y-2">
      <Link
        to="/patient/lich-hen"
        className="flex items-center gap-3 rounded-xl border border-[#c3c6d6]/60 px-4 py-3 text-sm font-medium text-[#191c1e] hover:bg-[#f8f9fb] hover:border-[#003d9b]/30 transition-colors"
      >
        <Calendar size={16} className="text-[#003d9b]" />
        Quản lý lịch hẹn
      </Link>
      <Link
        to="/patient/ho-so"
        className="flex items-center gap-3 rounded-xl border border-[#c3c6d6]/60 px-4 py-3 text-sm font-medium text-[#191c1e] hover:bg-[#f8f9fb] hover:border-[#003d9b]/30 transition-colors"
      >
        <FileText size={16} className="text-[#003d9b]" />
        Hồ sơ bệnh án
      </Link>
      <Link
        to="/ho-so"
        state={{ from: '/patient/thong-bao' }}
        className="flex items-center gap-3 rounded-xl border border-[#c3c6d6]/60 px-4 py-3 text-sm font-medium text-[#191c1e] hover:bg-[#f8f9fb] hover:border-[#003d9b]/30 transition-colors"
      >
        <User size={16} className="text-[#003d9b]" />
        Hồ sơ cá nhân
      </Link>
      <Link
        to="/cai-dat"
        state={{ from: '/patient/thong-bao' }}
        className="flex items-center gap-3 rounded-xl border border-[#c3c6d6]/60 px-4 py-3 text-sm font-medium text-[#191c1e] hover:bg-[#f8f9fb] hover:border-[#003d9b]/30 transition-colors"
      >
        <Settings size={16} className="text-[#003d9b]" />
        Cài đặt thông báo
      </Link>
    </div>
  </div>
);

export default NotificationsPreferencesPanel;
