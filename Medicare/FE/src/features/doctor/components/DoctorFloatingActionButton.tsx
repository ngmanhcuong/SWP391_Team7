import React from 'react';
import { Plus } from 'lucide-react';

interface DoctorFloatingActionButtonProps {
  onClick?: () => void;
}

const DoctorFloatingActionButton: React.FC<DoctorFloatingActionButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#003d9b] text-white rounded-full shadow-lg shadow-[#003d9b]/30 flex items-center justify-center hover:bg-[#002d75] transition-colors"
    aria-label="Thêm mới"
  >
    <Plus size={24} strokeWidth={2.5} />
  </button>
);

export default DoctorFloatingActionButton;
