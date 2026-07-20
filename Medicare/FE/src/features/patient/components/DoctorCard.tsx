import React from 'react';
import { Award, GraduationCap, Sparkles, Star } from 'lucide-react';
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
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon: <Award size={13} />,
  },
  phd: {
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
    icon: <GraduationCap size={13} />,
  },
  elite: {
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
    icon: <Sparkles size={13} />,
  },
  potential: {
    className: 'bg-teal-50 text-teal-700 border border-teal-200',
    icon: <Award size={13} />,
  },
};

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, isSelected, onSelect }) => {
  const tagStyle = tagStyles[doctor.tag.variant];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 ${
        isSelected
          ? 'border-[#003d9b] shadow-lg shadow-blue-100 ring-2 ring-blue-100'
          : 'border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="flex h-full flex-col p-5">
        {/* Top: Avatar + Rating */}
        <div className="flex items-start justify-between pb-4">
          <div className="relative">
            <div
              className="overflow-hidden rounded-2xl p-0.5"
              style={{ background: doctor.avatarBg }}
            >
              <Avatar name={doctor.name} size="xl" className="rounded-2xl" />
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                doctor.isAvailable ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            />
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5">
              <Star size={14} className="fill-amber-500 text-amber-500" />
              <span className="text-sm font-bold text-amber-700">{doctor.rating.toFixed(1)}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">{doctor.reviewCount} đánh giá</p>
          </div>
        </div>

        {/* Doctor info */}
        <div className="pb-3">
          <h3 className="text-[15px] font-semibold text-gray-900">{doctor.name}</h3>
          <p className="mt-0.5 text-sm text-gray-500">{doctor.departmentLabel}</p>
        </div>

        {/* Tag */}
        <div className="pb-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${tagStyle.className}`}
          >
            {tagStyle.icon}
            {doctor.tag.label}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-gray-400">Phòng khám</p>
              {doctor.roomCode ? (
                <p className="text-sm font-medium text-emerald-600">{doctor.roomCode}</p>
              ) : (
                <p className="text-sm italic text-gray-400">Chưa phân phòng</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onSelect(doctor.id)}
              className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-[#003d9b] to-[#2563eb] text-white shadow-md shadow-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-[#003d9b] hover:to-[#2563eb] hover:text-white hover:shadow-md hover:shadow-blue-200'
              }`}
            >
              {isSelected ? '✓ Đã chọn' : 'Chọn'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
