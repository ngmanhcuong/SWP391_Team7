import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, ClipboardList, UserPlus } from 'lucide-react';
import { DOCTOR_PATHS } from '../utils/doctorPaths';

interface DoctorDashboardWelcomeProps {
  userName: string;
  summary: string;
  todayDateLabel: string;
  department: string;
  nextPatientName?: string;
  nextPatientTime?: string;
  nextPatientHref?: string;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Chào buổi sáng';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
};

const DoctorDashboardWelcome: React.FC<DoctorDashboardWelcomeProps> = ({
  userName,
  summary,
  todayDateLabel,
  department,
  nextPatientName,
  nextPatientTime,
  nextPatientHref,
}) => {
  const displayName = userName.startsWith('Bác sĩ')
    ? userName
    : `Bác sĩ ${userName.split(' ').slice(-1)[0]}`;

  return (
    <section className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#06b6d4] p-7 sm:p-9 shadow-soft-lg">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-soft-float" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-[#06b6d4]/30 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm ring-1 ring-white/20">
            <CalendarDays size={14} className="text-cyan-200" />
            <span className="capitalize">{todayDateLabel}</span>
          </div>
          <h1 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight leading-tight">
            {getGreeting()}, {displayName}!
          </h1>
          <p className="text-sm text-blue-50/80">{department}</p>
          <p className="text-sm sm:text-[15px] text-blue-50/90 leading-relaxed max-w-xl">{summary}</p>

          <div className="flex flex-wrap gap-2 pt-2">
            <Link
              to={DOCTOR_PATHS.schedule}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <CalendarDays size={15} />
              Lịch khám hôm nay
            </Link>
            <Link
              to={DOCTOR_PATHS.records}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <ClipboardList size={15} />
              Hồ sơ bệnh án
            </Link>
            <Link
              to={DOCTOR_PATHS.patients}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-[#1e40af] hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
            >
              <UserPlus size={15} />
              Thêm bệnh nhân
            </Link>
          </div>
        </div>

        {nextPatientName && nextPatientHref && (
          <div className="shrink-0 w-full lg:w-auto lg:min-w-[260px] rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 ring-1 ring-white/10">
            <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-200">
              Ca khám tiếp theo
            </p>
            <p className="text-base font-semibold text-white mt-1">{nextPatientName}</p>
            {nextPatientTime && (
              <p className="text-xs text-blue-50/80 mt-0.5">{nextPatientTime}</p>
            )}
            <Link
              to={nextPatientHref}
              className="inline-flex items-center gap-1.5 mt-3 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-[#1e40af] hover:bg-blue-50 transition-colors"
            >
              Bắt đầu khám
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorDashboardWelcome;
