import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, UserRound } from 'lucide-react';
import { Avatar } from '../../../../components/ui';
import { WaitingPatient } from '../../types';
import { DOCTOR_PATHS } from '../../utils/doctorPaths';
import { scrollDashboardToTopAfterPaint } from '../../../../utils/scrollDashboardToTop';

interface WaitingPatientsWidgetProps {
  patients: WaitingPatient[];
}

const WaitingPatientsWidget: React.FC<WaitingPatientsWidgetProps> = ({ patients }) => {
  const navigate = useNavigate();

  const handleSelectPatient = (targetPatientId: string) => {
    scrollDashboardToTopAfterPaint();
    navigate(DOCTOR_PATHS.record(targetPatientId));
  };

  return (
    <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden xl:max-w-xl">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#c3c6d6]/40">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f0fe]">
          <UserRound size={15} className="text-[#003d9b]" />
          <Clock size={9} className="absolute -bottom-0.5 -right-0.5 text-[#003d9b] bg-[#e8f0fe] rounded-full" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#191c1e]">Bệnh nhân đang chờ</h3>
          <p className="text-[11px] text-[#737685] mt-0.5">
            Chọn để chuyển ca và bắt đầu từ đầu trang
          </p>
        </div>
      </div>

      <div className="divide-y divide-[#c3c6d6]/20">
        {patients.length === 0 ? (
          <p className="px-5 py-4 text-sm text-[#737685]">Không còn bệnh nhân chờ khám.</p>
        ) : (
          patients.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => handleSelectPatient(patient.patientId)}
              className="group w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-[#e8f0fe]/35 active:bg-[#e8f0fe]/50 transition-colors"
            >
              <Avatar
                name={patient.name}
                size="sm"
                className="!bg-[#003d9b] from-[#003d9b] to-[#003d9b]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#191c1e] truncate group-hover:text-[#003d9b] transition-colors">
                  {patient.name}
                </p>
                <p className="text-xs text-[#737685] mt-0.5">Số thứ tự {patient.queueNumber}</p>
              </div>
              <span className="text-xs font-bold text-[#003d9b] bg-[#e8f0fe] px-2.5 py-1 rounded-full shrink-0">
                #{patient.queueNumber}
              </span>
              <ChevronRight
                size={16}
                className="text-[#c3c6d6] group-hover:text-[#003d9b] shrink-0 transition-colors"
              />
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default WaitingPatientsWidget;
