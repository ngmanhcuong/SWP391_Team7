import React from 'react';

const DoctorSettingsFooter: React.FC = () => (
  <footer className="mt-10 pt-6 border-t border-[#c3c6d6]/40">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-[#737685]">
      <p>© 2024 MedCare Hospital Management System. Bảo lưu mọi quyền.</p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <button type="button" className="hover:text-[#003d9b] transition-colors">
          Chính sách bảo mật
        </button>
        <button type="button" className="hover:text-[#003d9b] transition-colors">
          Điều khoản sử dụng
        </button>
        <button type="button" className="hover:text-[#003d9b] transition-colors">
          Trợ giúp
        </button>
      </div>
    </div>
  </footer>
);

export default DoctorSettingsFooter;
