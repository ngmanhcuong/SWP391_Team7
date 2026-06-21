import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, UserPlus } from 'lucide-react';
import { Avatar } from '../../../components/ui';
import { NewPatient, PatientHealthStatus } from '../types';
import { DOCTOR_PATHS } from '../utils/doctorPaths';

interface NewPatientsSectionProps {
  patients: NewPatient[];
}

const healthStatusLabel: Record<PatientHealthStatus, string> = {
  waiting: 'Chờ khám',
  monitoring: 'Theo dõi',
  stable: 'Ổn định',
};

const healthStatusStyle: Record<PatientHealthStatus, string> = {
  waiting: 'bg-amber-50 text-amber-700',
  monitoring: 'bg-orange-50 text-orange-700',
  stable: 'bg-emerald-50 text-emerald-700',
};

const NewPatientsSection: React.FC<NewPatientsSectionProps> = ({ patients }) => (
  <section className="bg-white border border-slate-200/70 rounded-[20px] shadow-soft overflow-hidden">
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Bệnh nhân mới / hôm nay</h2>
        <p className="text-[11px] text-slate-500 mt-0.5">Đồng bộ danh sách bệnh nhân & hồ sơ khám</p>
      </div>
      <Link
        to={DOCTOR_PATHS.patients}
        className="text-sm font-semibold text-[#2563eb] hover:underline shrink-0"
      >
        Quản lý BN
      </Link>
    </div>

    <div className="flex gap-4 overflow-x-auto p-5 sm:p-6">
      {patients.map((patient) => {
        const recordHref = patient.registryId
          ? DOCTOR_PATHS.record(patient.registryId)
          : DOCTOR_PATHS.patients;

        return (
          <Link
            key={patient.id}
            to={recordHref}
            className="group flex-shrink-0 w-[200px] sm:w-[220px] bg-slate-50/60 border border-slate-200/70 rounded-[18px] p-4 hover:border-[#2563eb]/25 hover:bg-white hover:shadow-soft transition-all"
          >
            <div className="flex flex-col items-center text-center">
              <Avatar name={patient.name} src={patient.avatar} size="lg" />
              <p className="mt-3 text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-[#2563eb]">
                {patient.name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{patient.patientId}</p>
              {patient.healthStatus && (
                <span
                  className={`mt-2 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${healthStatusStyle[patient.healthStatus]}`}
                >
                  {healthStatusLabel[patient.healthStatus]}
                </span>
              )}
              <p className="text-xs text-[#2563eb] font-medium mt-2">{patient.admittedAgo}</p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{patient.department}</p>
              <span className="inline-flex items-center gap-0.5 mt-3 text-xs font-semibold text-[#2563eb] opacity-0 group-hover:opacity-100 transition-opacity">
                Mở hồ sơ
                <ChevronRight size={12} />
              </span>
            </div>
          </Link>
        );
      })}

      <Link
        to={DOCTOR_PATHS.patients}
        className="flex-shrink-0 w-[200px] sm:w-[220px] min-h-[200px] border-2 border-dashed border-slate-200 rounded-[18px] flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-[#2563eb]/40 hover:text-[#2563eb] hover:bg-slate-50 transition-all"
      >
        <div className="w-11 h-11 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center ring-1 ring-[#2563eb]/15">
          <UserPlus size={20} />
        </div>
        <span className="text-sm font-medium">Thêm bệnh nhân mới</span>
      </Link>
    </div>
  </section>
);

export default NewPatientsSection;
