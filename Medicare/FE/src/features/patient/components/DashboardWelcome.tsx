import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Search, Sparkles } from 'lucide-react';

interface DashboardWelcomeProps {
  userName: string;
  summary: string;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Chào buổi sáng';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
};

const formatDate = (): string =>
  new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ userName, summary }) => {
  const navigate = useNavigate();
  const firstName = userName.split(' ').slice(-1)[0] || userName;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003d9b] via-[#1a56db] to-[#2563eb] p-6 sm:p-8 shadow-lg shadow-[#003d9b]/20">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[#82f9be]/20 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
            <Sparkles size={14} />
            MediCare · Bệnh nhân
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">{summary}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-sm px-4 py-2.5 text-white border border-white/20">
            <CalendarDays size={18} className="text-[#82f9be]" />
            <span className="text-sm font-medium capitalize">{formatDate()}</span>
          </div>
          <Link
            to="/patient/lich-hen"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#003d9b] hover:bg-blue-50 transition-colors shadow-sm"
          >
            Đặt lịch khám
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="relative mt-6 flex flex-col sm:flex-row gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm">
          <Search size={18} className="text-[#737685] shrink-0" />
          <input
            type="search"
            placeholder="Tìm chuyên khoa, tên bác sĩ..."
            className="flex-1 bg-transparent text-sm text-[#191c1e] placeholder:text-[#737685] outline-none"
            readOnly
            onFocus={() => navigate('/patient/lich-hen')}
          />
        </div>
        <Link
          to="/patient/lich-hen"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
        >
          <Search size={16} />
          Tìm bác sĩ
        </Link>
      </div>
    </section>
  );
};

export default DashboardWelcome;
