import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, UserRound } from 'lucide-react';
import { Avatar } from '../../../components/ui';
import { DashboardWaitingItem } from '../types';
import { DOCTOR_PATHS } from '../utils/doctorPaths';

interface DashboardWaitingQueueProps {
  patients: DashboardWaitingItem[];
}

const DashboardWaitingQueue: React.FC<DashboardWaitingQueueProps> = ({ patients }) => (
  <div className="bg-white border border-slate-200/70 rounded-[20px] shadow-soft overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-[#2563eb]/15">
          <UserRound size={17} className="text-[#2563eb]" />
          <Clock size={9} className="absolute -bottom-0.5 -right-0.5 text-[#2563eb] bg-blue-50 rounded-full" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Hàng chờ khám</h2>
          <p className="text-[11px] text-slate-500">Liên kết lịch hẹn & hồ sơ bệnh án</p>
        </div>
      </div>
      <Link to={DOCTOR_PATHS.records} className="text-xs font-semibold text-[#2563eb] hover:underline">
        Mở hồ sơ
      </Link>
    </div>

    <div className="divide-y divide-slate-100">
      {patients.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-500">Không có bệnh nhân đang chờ.</p>
      ) : (
        patients.map((patient) => (
          <Link
            key={patient.id}
            to={DOCTOR_PATHS.record(patient.patientId)}
            className="group flex items-center gap-3 px-5 py-3.5 hover:bg-blue-50/50 transition-colors"
          >
            <Avatar
              name={patient.name}
              size="sm"
              className="!bg-[#2563eb] from-[#2563eb] to-[#2563eb]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-[#2563eb]">
                {patient.name}
              </p>
              <p className="text-xs text-slate-500">Lần khám: {patient.lastVisit}</p>
            </div>
            {patient.queueNumber > 0 && (
              <span className="text-xs font-bold text-[#2563eb] bg-blue-50 px-2 py-1 rounded-full">
                #{patient.queueNumber}
              </span>
            )}
            <ChevronRight size={14} className="text-slate-300 group-hover:text-[#2563eb]" />
          </Link>
        ))
      )}
    </div>
  </div>
);

export default DashboardWaitingQueue;
