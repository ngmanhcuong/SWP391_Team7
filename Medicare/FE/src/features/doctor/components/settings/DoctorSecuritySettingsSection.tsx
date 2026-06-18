import React, { useState } from 'react';
import { ChevronRight, Shield } from 'lucide-react';
import ChangePasswordForm from '../../../profile/components/ChangePasswordForm';

const SECURITY_ITEMS = [
  { id: 'password' as const, label: 'Thay đổi mật khẩu', desc: 'Cập nhật mật khẩu đăng nhập của bạn' },
  { id: null, label: 'Xác thực 2 bước', desc: 'Tăng cường bảo mật tài khoản' },
  { id: null, label: 'Phiên đăng nhập', desc: 'Quản lý thiết bị đang đăng nhập' },
];

type SecuritySection = 'password' | null;

const DoctorSecuritySettingsSection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SecuritySection>(null);

  return (
    <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 sm:px-6 py-4 border-b border-[#c3c6d6]/40">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f0fe]">
          <Shield size={18} className="text-[#003d9b]" />
        </div>
        <h2 className="text-base font-semibold text-[#191c1e]">Bảo mật tài khoản</h2>
      </div>

      <div className="p-3 space-y-1">
        {SECURITY_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              if (item.id === 'password') {
                setActiveSection((current) => (current === 'password' ? null : 'password'));
              }
            }}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors group ${
              item.id === 'password' && activeSection === 'password'
                ? 'bg-[#e8f0fe]/60'
                : 'hover:bg-[#f8f9fb]'
            }`}
          >
            <div className="text-left">
              <div className="text-sm font-medium text-[#191c1e]">{item.label}</div>
              <div className="text-xs text-[#737685]">{item.desc}</div>
            </div>
            <ChevronRight
              size={15}
              className={`text-[#c3c6d6] transition-transform group-hover:text-[#737685] ${
                item.id === 'password' && activeSection === 'password'
                  ? 'rotate-90 text-[#003d9b]'
                  : ''
              }`}
            />
          </button>
        ))}
      </div>

      {activeSection === 'password' && (
        <div className="px-3 pb-3">
          <ChangePasswordForm onClose={() => setActiveSection(null)} />
        </div>
      )}
    </div>
  );
};

export default DoctorSecuritySettingsSection;
