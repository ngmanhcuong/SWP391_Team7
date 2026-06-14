import React from 'react';
import { CalendarDays } from 'lucide-react';

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

const formatDate = (): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
};

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ userName, summary }) => {
  const firstName = userName.split(' ').slice(-1)[0] || userName;

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#191c1e]">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-sm text-[#434654] mt-1">{summary}</p>
      </div>
      <div className="flex items-center gap-2 bg-white shadow-sm rounded-lg px-4 py-2 shrink-0">
        <CalendarDays size={18} className="text-[#003d9b]" />
        <span className="text-base text-[#191c1e]">{formatDate()}</span>
      </div>
    </div>
  );
};

export default DashboardWelcome;
