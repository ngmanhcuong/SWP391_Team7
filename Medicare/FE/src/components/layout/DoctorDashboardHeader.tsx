import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Avatar } from '../ui';
import { User } from '../../types';
import DoctorHeaderSearch from './DoctorHeaderSearch';
import DoctorNotificationDropdown from './DoctorNotificationDropdown';

interface DoctorDashboardHeaderProps {
  user: User;
  department: string;
  compact?: boolean;
}

const DoctorDashboardHeader: React.FC<DoctorDashboardHeaderProps> = ({
  user,
  department,
  compact = false,
}) => {
  const displayName = user.fullName.startsWith('Bác sĩ')
    ? user.fullName
    : `Bác sĩ ${user.fullName.split(' ').slice(-1)[0]}`;

  if (compact) {
    return (
      <div className="flex items-center gap-1 ml-auto shrink-0">
        <DoctorHeaderSearch compact />
        <DoctorNotificationDropdown />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
      <DoctorHeaderSearch />

      <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
        <DoctorNotificationDropdown />
        <button
          type="button"
          className="p-2 text-[#434654] hover:bg-[#f8f9fb] rounded-lg transition-colors"
          aria-label="Trợ giúp"
        >
          <HelpCircle size={18} />
        </button>
        <div className="hidden sm:flex items-center gap-2.5 pl-2 ml-1 border-l border-[#c3c6d6]/50">
          <Avatar name={user.fullName} src={user.avatar} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#191c1e] truncate max-w-[140px]">{displayName}</p>
            <p className="text-xs text-[#737685] truncate max-w-[140px]">{department}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardHeader;
