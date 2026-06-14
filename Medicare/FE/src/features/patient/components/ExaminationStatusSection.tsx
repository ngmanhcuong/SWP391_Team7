import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ExaminationStep } from '../types';

interface ExaminationStatusSectionProps {
  steps: ExaminationStep[];
}

const dotStyles: Record<ExaminationStep['status'], string> = {
  completed: 'bg-[#1a56db] shadow-[0_0_0_4px_rgba(26,86,219,0.1)]',
  active: 'bg-[#1a56db] shadow-[0_0_0_4px_rgba(26,86,219,0.1)]',
  pending: 'bg-[#c3c6d6]',
};

const ExaminationStatusSection: React.FC<ExaminationStatusSectionProps> = ({ steps }) => (
  <div className="bg-white border border-[rgba(195,198,214,0.3)] rounded-lg shadow-sm p-6 flex flex-col gap-4 h-full">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-base font-semibold text-[#191c1e]">Tiến trình khám hôm nay</h2>
        <p className="text-xs text-[#737685] mt-0.5">Theo dõi lượt khám của bạn</p>
      </div>
      <TrendingUp size={18} className="text-[#434654]" />
    </div>

    {steps.length === 0 ? (
      <div className="text-sm text-[#737685]">
        <p>Hôm nay bạn chưa có lượt khám đang diễn ra.</p>
        <Link to="/patient/lich-hen" className="text-[#1a56db] hover:underline mt-2 inline-block">
          Xem lịch hẹn của bạn
        </Link>
      </div>
    ) : (
      <div className="relative pl-6 flex flex-col gap-6">
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[rgba(195,198,214,0.4)]" />
        {steps.map((step) => (
          <div key={step.id} className={`relative ${step.status === 'pending' ? 'opacity-50' : ''}`}>
            <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full ${dotStyles[step.status]}`} />
            <p className={`text-base ${step.status !== 'pending' ? 'font-bold' : ''} text-[#191c1e]`}>
              {step.title}
            </p>
            <p className="text-base text-[#434654]">{step.subtitle}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ExaminationStatusSection;
