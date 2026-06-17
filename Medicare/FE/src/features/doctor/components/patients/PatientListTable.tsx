import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Stethoscope } from 'lucide-react';
import { Avatar } from '../../../../components/ui';
import { DOCTOR_PATHS } from '../../utils/doctorPaths';
import { DoctorPatientListItem, PatientHealthStatus } from '../../types';

interface PatientListTableProps {
  patients: DoctorPatientListItem[];
}

const healthStatusConfig: Record<PatientHealthStatus, { label: string; className: string }> = {
  stable: {
    label: 'Ổn định',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  },
  monitoring: {
    label: 'Cần theo dõi',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  },
  waiting: {
    label: 'Chờ khám',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  },
};

const PatientListTable: React.FC<PatientListTableProps> = ({ patients }) => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-[#c3c6d6]/30 bg-[#f8f9fb]/60">
            <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#737685] px-5 py-3">
              Mã BN
            </th>
            <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#737685] px-4 py-3">
              Họ và tên
            </th>
            <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#737685] px-4 py-3">
              Giới tính
            </th>
            <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#737685] px-4 py-3 w-16">
              Tuổi
            </th>
            <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#737685] px-4 py-3">
              Lần khám cuối
            </th>
            <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#737685] px-4 py-3">
              Trạng thái sức khỏe
            </th>
            <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#737685] px-4 py-3">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#737685]">
                Không tìm thấy bệnh nhân phù hợp với bộ lọc.
              </td>
            </tr>
          ) : (
            patients.map((patient) => {
              const status = healthStatusConfig[patient.healthStatus];
              return (
                <tr
                  key={patient.id}
                  className="border-b border-[#c3c6d6]/20 last:border-0 hover:bg-[#f8f9fb]/50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-[#003d9b]">
                      {patient.patientCode}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={patient.fullName} size="sm" />
                      <span className="text-sm font-medium text-[#191c1e]">
                        {patient.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-[#434654]">{patient.gender}</td>
                  <td className="px-4 py-3.5 text-sm text-[#434654]">{patient.age}</td>
                  <td className="px-4 py-3.5 text-sm text-[#434654]">{patient.lastVisit}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link
                        to={DOCTOR_PATHS.record(patient.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#003d9b] text-white text-xs font-bold uppercase tracking-wide hover:bg-[#002d75] transition-colors"
                      >
                        <Stethoscope size={14} />
                        Khám
                      </Link>
                      <Link
                        to={DOCTOR_PATHS.record(patient.id)}
                        className="p-2 rounded-lg text-[#737685] hover:bg-[#f8f9fb] hover:text-[#003d9b] transition-colors"
                        aria-label={`Xem hồ sơ ${patient.fullName}`}
                      >
                        <FileText size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default PatientListTable;
