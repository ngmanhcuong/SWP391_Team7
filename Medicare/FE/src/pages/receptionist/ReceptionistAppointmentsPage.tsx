import React, { useState } from 'react';
import { CalendarDays, UserCheck } from 'lucide-react';
import ReceptionistAppointmentManagement from './ReceptionistAppointmentManagement';
import ReceptionistCheckInPage from './ReceptionistCheckInPage';

type Tab = 'appointments' | 'checkin';

const TABS: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
  { id: 'appointments', label: 'Quản lý lịch hẹn', icon: CalendarDays },
  { id: 'checkin', label: 'Check-in nhanh', icon: UserCheck },
];

const ReceptionistAppointmentsPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('appointments');

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="inline-flex rounded-xl bg-gray-100 dark:bg-slate-800 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-white dark:bg-slate-700 text-[#1a56db] shadow-sm'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'appointments' ? <ReceptionistAppointmentManagement /> : <ReceptionistCheckInPage />}
    </div>
  );
};

export default ReceptionistAppointmentsPage;
