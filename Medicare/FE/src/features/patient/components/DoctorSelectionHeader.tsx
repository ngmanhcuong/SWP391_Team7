import React from 'react';
import { Search, Stethoscope } from 'lucide-react';
import { MedicalSpecialty } from '../constants/medicalSpecialties';

interface DoctorSelectionHeaderProps {
  specialty: MedicalSpecialty | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const DoctorSelectionHeader: React.FC<DoctorSelectionHeaderProps> = ({
  specialty,
  searchQuery,
  onSearchChange,
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/40 p-6 shadow-sm lg:flex lg:items-end lg:justify-between lg:gap-6">
    {/* Decorative background */}
    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-100/30 blur-3xl" />

    <div className="relative z-10 space-y-2">
      <div className="inline-flex items-center gap-2 rounded-full bg-[#003d9b]/10 px-3 py-1">
        <Stethoscope size={16} className="text-[#003d9b]" />
        <span className="text-sm font-semibold tracking-wide text-[#003d9b]">
          {specialty?.departmentLabel ?? 'Chuyên khoa'}
        </span>
      </div>
      <h2 className="text-lg font-bold text-gray-900">Đội ngũ Bác sĩ chuyên khoa</h2>
      <p className="text-sm text-gray-500 max-w-xl">
        Vui lòng chọn bác sĩ phù hợp để tiếp tục đặt lịch khám.
      </p>
    </div>

    <div className="relative mt-4 w-full shrink-0 lg:mt-0 lg:max-w-xs">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Tìm tên bác sĩ..."
        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none shadow-sm transition-all focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
      />
    </div>
  </div>
);

export default DoctorSelectionHeader;
