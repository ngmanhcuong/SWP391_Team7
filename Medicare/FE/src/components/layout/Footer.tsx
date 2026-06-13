import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-300 pt-14 pb-8">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" fill="white" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg" style={{ fontFamily: 'Lexend' }}>MediCare AI Clinic</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-5">
            Hệ thống phòng khám tích hợp AI tiên tiến, mang lại trải nghiệm chăm sóc sức khỏe toàn diện và thông minh.
          </p>
          <div className="flex gap-3">
            {['FB', 'TW', 'YT', 'IG'].map((s) => (
              <a key={s} href="/" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors text-xs text-gray-400 hover:text-white font-bold">
                {s}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Giới Thiệu</h4>
          <ul className="space-y-2.5">
            {['Về chúng tôi', 'Đội ngũ bác sĩ', 'Cơ sở vật chất', 'Tin tức & Blog', 'Tuyển dụng'].map(item => (
              <li key={item}><a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Dịch Vụ</h4>
          <ul className="space-y-2.5">
            {['Khám tổng quát', 'Chuyên khoa', 'Tư vấn AI', 'Xét nghiệm', 'Hỗ trợ trực tuyến'].map(item => (
              <li key={item}><a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Liên Hệ</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-sm text-gray-400">
              <MapPin size={15} className="mt-0.5 flex-shrink-0 text-blue-400" />
              123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh
            </li>
            <li className="flex items-center gap-2.5 text-sm text-gray-400">
              <Phone size={15} className="text-blue-400" /> 1900 1234
            </li>
            <li className="flex items-center gap-2.5 text-sm text-gray-400">
              <Mail size={15} className="text-blue-400" /> contact@medicare-ai.vn
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-xs text-gray-500">© 2024 MediCare AI Clinic. All rights reserved.</p>
        <div className="flex gap-5">
          {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Cookie'].map(item => (
            <a key={item} href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{item}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
