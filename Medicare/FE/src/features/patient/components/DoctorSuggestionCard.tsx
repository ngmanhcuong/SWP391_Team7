import React from 'react';
import { Sparkles } from 'lucide-react';

interface DoctorSuggestionCardProps {
  onSuggest: () => void;
}

const DoctorSuggestionCard: React.FC<DoctorSuggestionCardProps> = ({ onSuggest }) => (
  <div
    className="relative overflow-hidden rounded-lg p-8 flex flex-col justify-between min-h-[395px] shadow-lg lg:col-span-2"
    style={{ background: 'linear-gradient(135deg, #0052cc 0%, #003d9b 100%)' }}
  >
    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
    <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#0052cc]/40 blur-2xl" />

    <div className="relative space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20">
          <Sparkles size={20} className="text-white" />
        </div>
        <h3 className="text-base text-white">Bạn chưa biết chọn bác sĩ nào?</h3>
      </div>
      <p className="text-base leading-6 text-[#dae2ff] max-w-lg">
        Đừng lo lắng, chúng tôi có thể tự động đề xuất bác sĩ phù hợp nhất dựa trên các triệu
        chứng lâm sàng của bạn.
      </p>
    </div>

    <div className="relative flex flex-wrap gap-4 pt-8">
      <button
        type="button"
        onClick={onSuggest}
        className="rounded bg-white px-8 py-3 text-base text-[#003d9b] hover:bg-[#f8f9fb] transition-colors"
      >
        Đề xuất cho tôi
      </button>
      <button
        type="button"
        className="rounded border border-white/40 px-8 py-3 text-base text-white hover:bg-white/10 transition-colors"
      >
        Xem chi tiết khoa
      </button>
    </div>
  </div>
);

export default DoctorSuggestionCard;
