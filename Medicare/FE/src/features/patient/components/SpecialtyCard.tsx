import React from 'react';
import { MedicalSpecialty } from '../constants/medicalSpecialties';

interface SpecialtyCardProps {
  specialty: MedicalSpecialty;
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: (specialtyId: string) => void;
}

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({
  specialty,
  isSelected,
  isRecommended,
  onSelect,
}) => {
  const Icon = specialty.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(specialty.id)}
      className={`relative flex flex-col items-start gap-3 rounded-xl border p-6 text-left transition-all hover:shadow-md ${
        isSelected
          ? 'border-[#003d9b] bg-[rgba(0,82,204,0.05)] ring-2 ring-[#003d9b]/20'
          : 'border-gray-100 bg-white hover:border-[#003d9b]/30'
      }`}
    >
      {isRecommended && (
        <span className="absolute top-3 right-3 rounded-full bg-[#006c47] px-2 py-0.5 text-[10px] font-bold text-white">
          AI
        </span>
      )}

      <div
        className="flex items-center justify-center w-12 h-12 rounded-xl transition-transform group-hover:scale-105"
        style={{ background: specialty.iconBg }}
      >
        <Icon size={22} style={{ color: specialty.iconColor }} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900">{specialty.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{specialty.doctorCount} bác sĩ</p>
      </div>
    </button>
  );
};

export default SpecialtyCard;
