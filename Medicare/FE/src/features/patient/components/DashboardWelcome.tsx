import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Avatar } from '../../../components/ui';
import { TodayAppointment } from '../types';

interface DashboardWelcomeProps {
  userName: string;
  summary: string;
  appointment?: TodayAppointment | null;
  healthScore?: number;
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

const HealthScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(score, 0), 100) / 100);

  return (
    <div className="relative h-[76px] w-[76px] shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="6" />
        <defs>
          <linearGradient id="healthScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="url(#healthScoreGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-white leading-none">{score}</span>
        <span className="text-[9px] font-medium text-blue-100/70">/ 100</span>
      </div>
    </div>
  );
};

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({
  userName,
  summary,
  appointment,
  healthScore = 0,
}) => {
  const firstName = userName.split(' ').slice(-1)[0] || userName;

  return (
    <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#06b6d4] p-6 sm:p-8 shadow-soft-lg">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-soft-float" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-[#06b6d4]/30 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Greeting + CTAs */}
        <div className="space-y-4 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm ring-1 ring-white/20">
            <CalendarDays size={14} className="text-cyan-200" />
            <span className="capitalize">{formatDate()}</span>
          </div>
          <div>
            <h1 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight leading-tight">
              {getGreeting()}, {firstName}
            </h1>
            <p className="mt-2 text-sm sm:text-[15px] text-blue-50/90 leading-relaxed max-w-xl">{summary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to="/patient/lich-hen"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#1e40af] hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
            >
              <Plus size={16} />
              Đặt lịch khám
            </Link>
            <Link
              to="/patient/ho-so"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Hồ sơ bệnh án
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Accent widgets */}
        <div className="space-y-3 lg:col-span-5">
          {/* Health score */}
          <div className="flex items-center gap-4 rounded-2xl bg-white/10 backdrop-blur-md p-4 ring-1 ring-white/15">
            <HealthScoreRing score={healthScore} />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-200">
                Chỉ số sức khỏe
              </p>
              <p className="text-sm font-semibold text-white mt-0.5">
                {healthScore >= 80 ? 'Rất tốt' : healthScore >= 60 ? 'Ổn định' : 'Cần theo dõi'}
              </p>
              <p className="text-xs text-blue-50/70 mt-0.5 line-clamp-1">
                Dựa trên hồ sơ &amp; chỉ số gần đây
              </p>
            </div>
          </div>

          {/* Upcoming appointment + AI shortcut */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-stretch">
            <div className="flex h-full flex-col rounded-2xl bg-white/10 backdrop-blur-md p-4 ring-1 ring-white/15">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-200">
                <Clock size={12} />
                Lịch hẹn sắp tới
              </div>
              {appointment ? (
                <div className="mt-auto flex items-center gap-2.5 pt-2">
                  <Avatar name={appointment.doctorName} src={appointment.doctorAvatar} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{appointment.doctorName}</p>
                    <p className="text-xs text-cyan-200 font-medium">{appointment.time}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-auto pt-2 text-sm text-blue-50/80">Chưa có lịch hẹn nào.</p>
              )}
            </div>

            <Link
              to="/patient/lich-hen"
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-4 text-[#1e40af] shadow-lg shadow-blue-900/20 transition-transform hover:-translate-y-0.5"
            >
              <Sparkles size={16} className="text-[#2563eb]" />
              <p className="mt-2 text-sm font-semibold leading-snug">Trợ lý sức khỏe AI</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium text-[#2563eb]">
                Hỏi ngay
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardWelcome;
