import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import { getDefaultMedicalRecordPatientId } from '../../features/doctor/utils/doctorPatientRegistry';
import { DOCTOR_PATHS } from '../../features/doctor/utils/doctorPaths';

export const DoctorRecordsIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const defaultPatientId = getDefaultMedicalRecordPatientId();

  useEffect(() => {
    if (defaultPatientId) {
      navigate(DOCTOR_PATHS.record(defaultPatientId), { replace: true });
    }
  }, [defaultPatientId, navigate]);

  if (defaultPatientId) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-[420px]">
      <div className="max-w-md text-center bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f0fe] mb-4">
          <Users size={28} className="text-[#003d9b]" />
        </div>
        <h1 className="text-lg font-bold text-[#191c1e]">Chưa chọn bệnh nhân</h1>
        <p className="text-sm text-[#737685] mt-2 leading-relaxed">
          Vui lòng chọn bệnh nhân từ danh sách hoặc lịch hẹn hôm nay để mở hồ sơ bệnh án.
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
