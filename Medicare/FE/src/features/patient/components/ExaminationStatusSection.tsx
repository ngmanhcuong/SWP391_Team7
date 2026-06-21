import React from 'react';
import { Activity, Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ExaminationStep } from '../types';

interface ExaminationStatusSectionProps {
  steps: ExaminationStep[];
}

const ExaminationStatusSection: React.FC<ExaminationStatusSectionProps> = ({ steps }) => (
  <div className="bg-white border border-slate-200/70 rounded-[24px] shadow-soft p-6 flex flex-col gap-5 h-full">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
        <Activity size={18} className="text-emerald-600" />
      </div>
      <div>
        <h2 className="text-base font-bold text-slate-900">Tiến trình khám hôm nay</h2>
        <p className="text-xs text-slate-500 mt-0.5">Theo dõi lượt khám của bạn</p>
      </div>
    </div>

    {steps.length === 0 ? (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        <p>Hôm nay bạn chưa có lượt khám đang diễn ra.</p>
        <Link
          to="/patient/lich-hen"
          className="inline-flex items-center gap-1 text-[#2563eb] font-medium hover:underline mt-3"
        >
          Xem lịch hẹn
          <ChevronRight size={14} />
        </Link>
      </div>
    ) : (
      <ol className="flex flex-col">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isCompleted = step.status === 'completed';
          const isActive = step.status === 'active';

          return (
            <li key={step.id} className="flex gap-3.5">
              {/* Marker + connector */}
              <div className="flex flex-col items-center">
                <div
                  className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isActive
                        ? 'bg-[#2563eb] text-white'
                        : 'border-2 border-slate-200 bg-white'
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-[#2563eb]/30 animate-ping" />
                  )}
                  {isCompleted ? (
                    <Check size={15} strokeWidth={3} className="relative" />
                  ) : isActive ? (
                    <span className="relative h-2 w-2 rounded-full bg-white" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 my-1 rounded-full ${
                      isCompleted ? 'bg-emerald-400' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-5'} ${step.status === 'pending' ? 'opacity-70' : ''}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className={`text-sm ${
                      isActive ? 'font-bold text-[#2563eb]' : 'font-semibold text-slate-900'
                    }`}
                  >
                    {step.title}
                  </p>
                  {isActive && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#2563eb] ring-1 ring-[#2563eb]/15">
                      Hiện tại
                    </span>
                  )}
                  {isCompleted && (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 ring-1 ring-emerald-200">
                      Hoàn tất
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{step.subtitle}</p>
              </div>
            </li>
          );
        })}
      </ol>
    )}
  </div>
);

export default ExaminationStatusSection;
