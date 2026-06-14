import React from 'react';
import { Award, Briefcase, GraduationCap, Sparkles, Star } from 'lucide-react';
import { Avatar } from '../../../components/ui';
import { BookingDoctor, DoctorTagVariant } from '../types';

interface DoctorCardProps {
  doctor: BookingDoctor;
  isSelected: boolean;
  onSelect: (doctorId: string) => void;
}

const tagStyles: Record<
  DoctorTagVariant,
  { className: string; icon: React.ReactNode }
> = {
  expert: {
    className: 'bg-[rgba(130,249,190,0.3)] text-[#00734c]',
    icon: <Award size={14} />,
  },
  phd: {
    className: 'bg-[rgba(218,226,255,0.3)] text-[#0040a2]',
    icon: <GraduationCap size={14} />,
  },
  elite: {
    className: 'bg-[rgba(255,218,210,0.3)] text-[#8b1a00]',
    icon: <Sparkles size={14} />,
  },
  potential: {
    className: 'bg-[rgba(130,249,190,0.3)] text-[#00734c]',
    icon: <Briefcase size={14} />,
  },
};

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, isSelected, onSelect }) => {
  const tagStyle = tagStyles[doctor.tag.variant];

  return (
    <div
      className={`bg-white border rounded-lg overflow-hidden transition-all ${
        isSelected
          ? 'border-[#003d9b] ring-2 ring-[#003d9b]/20 shadow-md'
          : 'border-[#c3c6d6] shadow-sm'
      }`}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between pb-4">
          <div className="relative">
            <div
              className="rounded-lg p-1"
              style={{ background: doctor.avatarBg }}
            >
              <Avatar name={doctor.name} size="xl" className="rounded-lg" />
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                doctor.isAvailable ? 'bg-[#006c47]' : 'bg-[#c3c6d6]'
              }`}
            />
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1">
              <Star size={15} className="fill-[#851800] text-[#851800]" />
              <span className="text-base text-[#851800]">{doctor.rating.toFixed(1)}</span>
            </div>
            <p className="text-base text-[#434654]">{doctor.reviewCount} đánh giá</p>
          </div>
        </div>

        <div className="pb-6">
          <h3 className="text-base font-medium text-[#191c1e]">{doctor.name}</h3>
          <p className="text-base text-[#434654]">{doctor.departmentLabel}</p>
        </div>

        <div className="flex flex-col gap-2 pb-8">
          <span className="inline-flex items-center gap-1.5 w-fit rounded-xl bg-[#edeef0] px-3 py-1.5 text-base text-[#434654]">
            <Briefcase size={14} />
            {doctor.experienceYears} năm KN
          </span>
          <span
            className={`inline-flex items-center gap-1.5 w-fit rounded-xl px-3 py-1.5 text-base ${tagStyle.className}`}
          >
            {tagStyle.icon}
            {doctor.tag.label}
          </span>
        </div>

        <div className="mt-auto border-t border-[#c3c6d6] pt-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-base text-[#434654]">Lịch trống gần nhất</p>
            {doctor.isAvailable && doctor.nextAvailableSlot ? (
              <p className="text-base text-[#006c47]">{doctor.nextAvailableSlot}</p>
            ) : (
              <p className="text-base italic text-[#434654]">Đang bận</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onSelect(doctor.id)}
            className={`rounded px-6 py-2 text-base text-white transition-colors ${
              isSelected ? 'bg-[#003d9b]' : 'bg-[#0052cc] hover:bg-[#003d9b]'
            }`}
          >
            Chọn
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
