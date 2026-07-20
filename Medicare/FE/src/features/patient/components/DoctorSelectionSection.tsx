import React, { useMemo } from 'react';
import { BookingDoctor } from '../types';
import DoctorCard from './DoctorCard';

interface DoctorSelectionSectionProps {
  doctors: BookingDoctor[];
  selectedDoctorId: string | null;
  searchQuery: string;
  onSelect: (doctorId: string) => void;
}

const DoctorSelectionSection: React.FC<DoctorSelectionSectionProps> = ({
  doctors,
  selectedDoctorId,
  searchQuery,
  onSelect,
}) => {
  const filteredDoctors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return doctors;
    return doctors.filter((doctor) => doctor.name.toLowerCase().includes(query));
  }, [doctors, searchQuery]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {filteredDoctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          isSelected={selectedDoctorId === doctor.id}
          onSelect={onSelect}
        />
      ))}

      {filteredDoctors.length === 0 && (
        <div className="lg:col-span-3 rounded-lg border border-[#c3c6d6] bg-white p-8 text-center">
          <p className="text-base text-[#434654]">Không tìm thấy bác sĩ phù hợp với từ khóa tìm kiếm.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorSelectionSection;
