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
    <section className="rounded-2xl border border-[#c3c6d6]/50 bg-gradient-to-br from-white via-white to-[#e8f0fe]/30 shadow-sm shadow-[#003d9b]/5 overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#003d9b]">
              {todayDateLabel}
            </p>
            <h1 className="text-2xl sm:text-[1.75rem] font-bold text-[#191c1e] tracking-tight mt-1">
              {getGreeting()}, {displayName}!
            </h1>
            <p className="text-sm text-[#737685] mt-1">{department}</p>
            <p className="text-sm sm:text-base text-[#434654] mt-3 leading-relaxed">{summary}</p>
          </div>

          {nextPatientName && nextPatientHref && (
            <div className="shrink-0 w-full lg:w-auto lg:min-w-[260px] rounded-xl border border-[#003d9b]/15 bg-[#e8f0fe]/40 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#003d9b]">
                Ca khám tiếp theo
              </p>
              <p className="text-sm font-semibold text-[#191c1e] mt-1">{nextPatientName}</p>
              {nextPatientTime && (
                <p className="text-xs text-[#737685] mt-0.5">{nextPatientTime}</p>
              )}
              <Link
                to={nextPatientHref}
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-[#003d9b] hover:underline"
              >
                Bắt đầu khám
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[#c3c6d6]/30">
          <Link
            to={DOCTOR_PATHS.schedule}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-white border border-[#c3c6d6]/50 text-[#434654] hover:border-[#003d9b]/30 hover:text-[#003d9b] transition-colors"
          >
            <CalendarDays size={15} />
            Lịch khám hôm nay
          </Link>
          <Link
            to={DOCTOR_PATHS.records}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-white border border-[#c3c6d6]/50 text-[#434654] hover:border-[#003d9b]/30 hover:text-[#003d9b] transition-colors"
          >
            <ClipboardList size={15} />
            Hồ sơ bệnh án
          </Link>
          <Link
            to={DOCTOR_PATHS.patients}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-[#003d9b] text-white hover:bg-[#002d75] transition-colors"
          >
            <UserPlus size={15} />
            Thêm bệnh nhân
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoctorDashboardWelcome;
