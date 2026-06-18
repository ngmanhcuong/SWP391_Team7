import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../../../../components/ui/Button';

interface DoctorPatientsHeaderProps {
  onAddPatient: () => void;
}

const DoctorPatientsHeader: React.FC<DoctorPatientsHeaderProps> = ({ onAddPatient }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-[#191c1e]">Danh sách bệnh nhân</h1>
      <p className="text-sm text-[#737685] mt-1">
        Quản lý và tra cứu thông tin bệnh nhân đang điều trị
      </p>
    </div>
    <Button
      leftIcon={<Plus size={16} />}
      onClick={onAddPatient}
      className="shrink-0 bg-[#003d9b] border-[#003d9b] hover:bg-[#002d75]"
    >
      Thêm bệnh nhân mới
    </Button>
  </div>
);

export default DoctorPatientsHeader;
