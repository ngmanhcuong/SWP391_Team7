import React from 'react';
import { Calendar, MapPin, Phone, User } from 'lucide-react';
import { Avatar } from '../../../../components/ui';
import { MedicalRecordPatient } from '../../types';

interface PatientInfoCardProps {
  patient: MedicalRecordPatient;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ patient }) => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#2563eb]/5 p-5">
    <div className="flex items-start gap-4 mb-5">
      <Avatar name={patient.name} size="lg" />
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-bold text-[#191c1e]">{patient.name}</h2>
        <p className="text-xs text-[#737685] mt-0.5">ID: {patient.id}</p>
        <span
          className={`inline-flex mt-2 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
            patient.insuranceStatus === 'active'
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
              : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
          }`}
        >
          BHYT: {patient.insuranceStatus === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      </div>
    </div>

    <div className="space-y-3 text-sm">
      <div className="flex items-center gap-2.5 text-[#434654]">
        <Calendar size={15} className="text-[#737685] shrink-0" />
        <span>
          {patient.dateOfBirth} · {patient.age} tuổi · {patient.gender}
        </span>
      </div>
      <div className="flex items-center gap-2.5 text-[#434654]">
        <Phone size={15} className="text-[#737685] shrink-0" />
        <span>{patient.phone}</span>
      </div>
      <div className="flex items-start gap-2.5 text-[#434654]">
        <MapPin size={15} className="text-[#737685] shrink-0 mt-0.5" />
        <span>{patient.address}</span>
      </div>
      <div className="flex items-center gap-2.5 text-[#434654]">
        <User size={15} className="text-[#737685] shrink-0" />
        <span>Bệnh nhân nội trú ngoại trú</span>
      </div>
    </div>
  </div>
);

export default PatientInfoCard;
