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
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#c3c6d6]/40">
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f0fe]">
          <UserRound size={15} className="text-[#003d9b]" />
          <Clock size={9} className="absolute -bottom-0.5 -right-0.5 text-[#003d9b] bg-[#e8f0fe] rounded-full" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#191c1e]">Hàng chờ khám</h2>
          <p className="text-[11px] text-[#737685]">Liên kết lịch hẹn & hồ sơ bệnh án</p>
        </div>
      </div>
      <Link to={DOCTOR_PATHS.records} className="text-xs font-medium text-[#003d9b] hover:underline">
        Mở hồ sơ
      </Link>
    </div>

    <div className="divide-y divide-[#c3c6d6]/20">
      {patients.length === 0 ? (
        <p className="px-5 py-6 text-sm text-[#737685]">Không có bệnh nhân đang chờ.</p>
      ) : (
        patients.map((patient) => (
          <Link
            key={patient.id}
            to={DOCTOR_PATHS.record(patient.patientId)}
            className="group flex items-center gap-3 px-5 py-3.5 hover:bg-[#e8f0fe]/35 transition-colors"
          >
            <Avatar
              name={patient.name}
              size="sm"
              className="!bg-[#003d9b] from-[#003d9b] to-[#003d9b]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#191c1e] truncate group-hover:text-[#003d9b]">
                {patient.name}
              </p>
              <p className="text-xs text-[#737685]">Lần khám: {patient.lastVisit}</p>
            </div>
            {patient.queueNumber > 0 && (
              <span className="text-xs font-bold text-[#003d9b] bg-[#e8f0fe] px-2 py-1 rounded-full">
                #{patient.queueNumber}
              </span>
            )}
            <ChevronRight size={14} className="text-[#c3c6d6] group-hover:text-[#003d9b]" />
          </Link>
        ))
      )}
    </div>
  </div>
);

export default DashboardWaitingQueue;
