import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import { doctorApi } from '../../features/doctor/api/doctorApi';
import { DOCTOR_PATHS } from '../../features/doctor/utils/doctorPaths';

export const DoctorRecordsIndexPage: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['doctor', 'patients'],
    queryFn: doctorApi.getPatients,
  });

  const hasPatients = (data?.patients?.length ?? 0) > 0;

  return (
    <div className="flex items-center justify-center min-h-[420px]">
      <div className="max-w-md text-center bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f0fe] mb-4">
          <Users size={28} className="text-[#003d9b]" />
        </div>
        <h1 className="text-lg font-bold text-[#191c1e]">Chưa chọn bệnh nhân</h1>
        <p className="text-sm text-[#737685] mt-2 leading-relaxed">
          {hasPatients
            ? 'Vui lòng chọn bệnh nhân từ danh sách hoặc từ lịch hẹn hôm nay để mở hồ sơ bệnh án.'
            : 'Hiện chưa có bệnh nhân thật nào được gán cho bác sĩ này trong hệ thống.'}
        </p>
        <Link to={DOCTOR_PATHS.patients} className="inline-block mt-5">
          <Button className="bg-[#003d9b] border-[#003d9b] hover:bg-[#002d75]">
            Đến danh sách bệnh nhân
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DoctorRecordsIndexPage;
