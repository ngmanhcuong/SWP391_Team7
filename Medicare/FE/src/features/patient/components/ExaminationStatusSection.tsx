import React from 'react';
import { Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ExaminationStep } from '../types';

interface ExaminationStatusSectionProps {
  steps: ExaminationStep[];
}

const dotStyles: Record<ExaminationStep['status'], string> = {
  completed: 'bg-[#006c47] ring-4 ring-emerald-100',
  active: 'bg-[#003d9b] ring-4 ring-blue-100 animate-pulse',
  pending: 'bg-[#c3c6d6] ring-4 ring-slate-100',
};

const lineStyles: Record<ExaminationStep['status'], string> = {
  completed: 'bg-emerald-200',
  active: 'bg-gradient-to-b from-emerald-200 to-[#003d9b]/30',
  pending: 'bg-[#c3c6d6]/40',
};

const ExaminationStatusSection: React.FC<ExaminationStatusSectionProps> = ({ steps }) => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 p-6 flex flex-col gap-4 h-full">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
          <Activity size={18} className="text-[#006c47]" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#191c1e]">Tiến trình khám hôm nay</h2>
          <p className="text-xs text-[#737685] mt-0.5">Theo dõi lượt khám của bạn</p>
        </div>
      </div>
    </div>

    {steps.length === 0 ? (
      <div className="rounded-xl border border-dashed border-[#c3c6d6] bg-[#f8f9fb] px-4 py-8 text-center text-sm text-[#737685]">
        <p>Hôm nay bạn chưa có lượt khám đang diễn ra.</p>
        <Link
          to="/patient/lich-hen"
          className="inline-flex items-center gap-1 text-[#003d9b] font-medium hover:underline mt-3"
        >
          Xem lịch hẹn
          <ChevronRight size={14} />
        </Link>
      </div>
    ) : (
      <div className="relative pl-7 flex flex-col gap-5">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {index < steps.length - 1 && (
              <div
                className={`absolute left-[5px] top-4 h-[calc(100%+12px)] w-0.5 ${lineStyles[step.status]}`}
              />
            )}
            <div className={`relative flex gap-4 ${step.status === 'pending' ? 'opacity-60' : ''}`}>
              <div className={`absolute -left-7 top-0.5 w-3 h-3 rounded-full ${dotStyles[step.status]}`} />
              <div>
                <p
                  className={`text-sm ${
                    step.status === 'active' ? 'font-bold text-[#003d9b]' : 'font-semibold text-[#191c1e]'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-sm text-[#737685] mt-0.5">{step.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ExaminationStatusSection;
