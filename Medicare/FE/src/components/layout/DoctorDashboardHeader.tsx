import React from 'react';
import { User } from '../../types';
import DoctorHeaderSearch from './DoctorHeaderSearch';
import DoctorNotificationDropdown from './DoctorNotificationDropdown';
import DashboardUserMenu from './DashboardUserMenu';
import { getDoctorDisplayName } from '../../utils/userDisplay';

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
  const displayName = getDoctorDisplayName(user.fullName);

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
        <div className="hidden sm:flex items-center pl-2 ml-1 border-l border-[#c3c6d6]/50">
          <DashboardUserMenu
            user={user}
            variant="dark"
            layout="doctor"
            displayName={displayName}
            department={department}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardHeader;
