import React from 'react';

interface MedicalRecordHeaderProps {
  patientName: string;
  patientCode: string;
}

const MedicalRecordHeader: React.FC<MedicalRecordHeaderProps> = ({
  patientName,
  patientCode,
}) => (
  <div>
    <h1 className="text-xl sm:text-2xl font-bold text-[#191c1e]">Chi tiết Hồ sơ bệnh án</h1>
    <p className="text-sm text-[#737685] mt-1">
      {patientName} · <span className="text-[#003d9b] font-medium">{patientCode}</span>
    </p>
  </div>
);

export default MedicalRecordHeader;
