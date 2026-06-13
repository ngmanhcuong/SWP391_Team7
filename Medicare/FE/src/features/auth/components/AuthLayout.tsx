import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Brain, Star } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const features = [
  { icon: Brain, label: 'AI Chẩn Đoán', desc: 'Phân tích sức khỏe bằng trí tuệ nhân tạo' },
  { icon: Shield, label: 'Bảo Mật Cao', desc: 'Dữ liệu được mã hóa và bảo vệ' },
  { icon: Heart, label: 'Chăm Sóc 24/7', desc: 'Hỗ trợ sức khỏe mọi lúc mọi nơi' },
];

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className="min-h-screen flex">
    {/* Left panel */}
    <div
      className="hidden lg:flex lg:w-2/5 flex-col justify-between p-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #1a56db 0%, #0d3b99 60%, #091f5c 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-white/5" />
      <div className="absolute -bottom-20 left-10 w-48 h-48 rounded-full bg-white/5" />

      <div className="relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <rect x="10" y="3" width="4" height="18" rx="2" fill="#1a56db" />
              <rect x="3" y="10" width="18" height="4" rx="2" fill="#1a56db" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl" style={{ fontFamily: 'Lexend' }}>MediCare AI Clinic</span>
        </Link>
        <p className="text-blue-200 text-sm mt-1">hệ thống phòng khám tích hợp công nghệ thông minh</p>
      </div>

      <div className="relative z-10 space-y-5">
        <h2 className="text-white text-2xl font-bold leading-tight" style={{ fontFamily: 'Lexend' }}>
          Nâng tầm sức khỏe<br />cùng Trí tuệ nhân tạo.
        </h2>
        <p className="text-blue-200 text-sm leading-relaxed">
          Chào mừng bạn đến với MediCare AI Clinic – nơi hội tụ đội ngũ y bác sĩ đầu ngành và công nghệ AI dẫn đầu nhất.
        </p>
        <div className="space-y-3 pt-2">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-white" />
              </div>
              <div>
                <div className="text-white text-sm font-semibold">{label}</div>
                <div className="text-blue-200 text-xs">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex -space-x-2">
          {['#4ade80', '#60a5fa', '#f472b6', '#fb923c'].map((c, i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30" style={{ background: c }} />
          ))}
        </div>
        <div>
          <div className="flex items-center gap-1 text-white text-sm font-semibold">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            4.9/5
          </div>
          <div className="text-blue-200 text-xs">Hơn 50,000 bệnh nhân tin dùng</div>
        </div>
      </div>
    </div>

    {/* Right panel */}
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
