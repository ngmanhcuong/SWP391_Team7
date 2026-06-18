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
  <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm p-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Stethoscope size={20} className="text-[#003d9b]" />
        <span className="text-base tracking-wider uppercase text-[#003d9b]">
          {specialty?.departmentLabel ?? 'Chuyên khoa'}
        </span>
      </div>
      <h2 className="text-base font-medium text-[#191c1e]">Đội ngũ Bác sĩ chuyên khoa</h2>
      <p className="text-base text-[#434654] max-w-xl">
        Vui lòng chọn bác sĩ bạn muốn đặt lịch khám. Tất cả bác sĩ đều có trên 10 năm kinh nghiệm.
      </p>
    </div>

    <div className="relative w-full lg:max-w-xs shrink-0">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Tìm tên bác sĩ..."
        className="w-full rounded border border-[#c3c6d6] bg-[#edeef0] py-3.5 pl-11 pr-4 text-base text-[#191c1e] placeholder:text-[#6b7280] outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
      />
    </div>
  </div>
);

export default DoctorSelectionHeader;
