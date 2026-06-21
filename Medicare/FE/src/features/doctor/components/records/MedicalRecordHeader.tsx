import React from 'react';
import { FolderHeart, Hash } from 'lucide-react';

interface MedicalRecordHeaderProps {
  patientName: string;
  patientCode: string;
}

const MedicalRecordHeader: React.FC<MedicalRecordHeaderProps> = ({
  patientName,
  patientCode,
}) => (
  <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#06b6d4] p-6 sm:p-7 shadow-soft-lg">
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.12]"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}
    />
    <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl" />

    <div className="relative flex flex-col gap-2">
      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm ring-1 ring-white/20">
        <FolderHeart size={14} className="text-cyan-200" />
        Hồ sơ bệnh án
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        Chi tiết hồ sơ bệnh án
      </h1>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-base font-semibold text-white">{patientName}</span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm">
          <Hash size={12} className="text-cyan-200" />
          {patientCode}
        </span>
      </div>
    </div>
  </div>
);

export default MedicalRecordHeader;
