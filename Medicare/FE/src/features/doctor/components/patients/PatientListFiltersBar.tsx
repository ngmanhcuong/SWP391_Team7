import React from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import { PatientListFilters } from '../../types';

interface PatientListFiltersBarProps {
  filters: PatientListFilters;
  onChange: (field: keyof PatientListFilters, value: string) => void;
  onFilter: () => void;
  onRefresh: () => void;
}

const inputClassName =
  'w-full px-4 py-2.5 text-sm border border-[#c3c6d6]/60 rounded-xl outline-none transition-all bg-white text-[#191c1e] placeholder:text-[#737685] focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10';

const PatientListFiltersBar: React.FC<PatientListFiltersBarProps> = ({
  filters,
  onChange,
  onFilter,
  onRefresh,
}) => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 p-4 sm:p-5">
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[1fr_1fr_1fr_auto_auto] xl:items-end">
      <div>
        <label className="text-xs font-medium text-[#737685] block mb-1.5">Mã bệnh nhân</label>
        <input
          type="text"
          placeholder="Ví dụ: BN1024"
          value={filters.patientCode}
          onChange={(e) => onChange('patientCode', e.target.value)}
          className={inputClassName}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-[#737685] block mb-1.5">Họ và tên</label>
        <input
          type="text"
          placeholder="Nhập tên bệnh nhân..."
          value={filters.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          className={inputClassName}
        />
      </div>
      <div>
        <label className="text-xs font-medium text-[#737685] block mb-1.5">Số điện thoại</label>
        <input
          type="tel"
          placeholder="090..."
          value={filters.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className={inputClassName}
        />
      </div>
      <Button
        variant="outline"
        leftIcon={<Filter size={15} />}
        onClick={onFilter}
        className="border-[#c3c6d6] text-[#434654] hover:bg-[#f8f9fb] h-[42px]"
      >
        Lọc dữ liệu
      </Button>
      <button
        type="button"
        onClick={onRefresh}
        className="inline-flex items-center justify-center gap-1.5 h-[42px] px-3 text-sm font-medium text-[#003d9b] hover:bg-[#f8f9fb] rounded-xl transition-colors"
        aria-label="Làm mới"
      >
        <RefreshCw size={16} />
      </button>
    </div>
  </div>
);

export default PatientListFiltersBar;
