import React from 'react';
import { Plus } from 'lucide-react';

interface DoctorFloatingActionButtonProps {
  onClick?: () => void;
}

const DoctorFloatingActionButton: React.FC<DoctorFloatingActionButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#2563eb] to-[#06b6d4] text-white rounded-full shadow-lg shadow-blue-500/40 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
    aria-label="Thêm mới"
  >
    <Plus size={24} strokeWidth={2.5} className="transition-transform duration-300 group-hover:rotate-90" />
  </button>
);

export default DoctorFloatingActionButton;
