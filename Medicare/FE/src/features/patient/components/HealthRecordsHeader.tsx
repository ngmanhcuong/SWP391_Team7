import React from 'react';
import { Download, Search } from 'lucide-react';

interface HealthRecordsHeaderProps {
  patientName: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const HealthRecordsHeader: React.FC<HealthRecordsHeaderProps> = ({
  patientName,
  searchQuery,
  onSearchChange,
}) => (
  <header className="space-y-4">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-[32px] font-semibold leading-10 tracking-tight text-[#003d9b]">
          Hồ sơ bệnh án
        </h1>
        <p className="text-base text-[#434654]">
          Theo dõi lịch sử khám, đơn thuốc và kết quả xét nghiệm của{' '}
          <span className="font-medium text-[#191c1e]">{patientName}</span>.
        </p>
      </div>
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#c3c6d6] bg-white px-5 py-2.5 text-sm text-[#191c1e] hover:bg-[#f8f9fb] transition-colors shrink-0"
      >
        <Download size={16} />
        Tải hồ sơ PDF
      </button>
    </div>

    <div className="relative max-w-xl">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737685]" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Tìm theo bác sĩ, chuyên khoa, chẩn đoán..."
        className="w-full rounded-full border border-[#c3c6d6] bg-[#f8f9fb] py-3 pl-11 pr-4 text-base text-[#191c1e] placeholder:text-[#737685] outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
      />
    </div>
  </header>
);

export default HealthRecordsHeader;
