import React from 'react';
import { ArrowRight, ChevronRight, Pill } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Prescription } from '../types';

interface RecentPrescriptionsSectionProps {
  prescriptions: Prescription[];
}

const PILL_PALETTES = [
  'bg-[#2563eb]/10 text-[#2563eb] ring-[#2563eb]/15',
  'bg-emerald-50 text-emerald-600 ring-emerald-200',
  'bg-amber-50 text-amber-600 ring-amber-200',
  'bg-violet-50 text-violet-600 ring-violet-200',
];

const RecentPrescriptionsSection: React.FC<RecentPrescriptionsSectionProps> = ({ prescriptions }) => (
  <div className="bg-white border border-slate-200/70 rounded-[24px] shadow-soft p-6 flex flex-col gap-4 h-full">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb]/10 ring-1 ring-[#2563eb]/15">
          <Pill size={18} className="text-[#2563eb]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Đơn thuốc của bạn</h2>
          <p className="text-xs text-slate-500 mt-0.5">Đơn đang được sử dụng</p>
        </div>
      </div>
      <Link
        to="/patient/ho-so?tab=prescriptions"
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#2563eb] hover:bg-[#2563eb]/5 transition-colors shrink-0"
      >
        Xem tất cả
        <ArrowRight size={14} />
      </Link>
    </div>

    {prescriptions.length === 0 ? (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        Bạn chưa có đơn thuốc nào đang dùng.
      </div>
    ) : (
      <div className="flex flex-col gap-2.5">
        {prescriptions.map((rx, index) => {
          const palette = PILL_PALETTES[index % PILL_PALETTES.length];
          return (
            <Link
              key={rx.id}
              to="/patient/ho-so?tab=prescriptions"
              className="group flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/60 px-3.5 py-3 hover:border-[#2563eb]/30 hover:bg-white hover:shadow-sm transition-all"
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${palette}`}>
                <Pill size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 truncate">{rx.name}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{rx.dosage}</p>
              </div>
              <ChevronRight
                size={18}
                className="shrink-0 text-slate-300 transition-all group-hover:text-[#2563eb] group-hover:translate-x-0.5"
              />
            </Link>
          );
        })}
      </div>
    )}
  </div>
);

export default RecentPrescriptionsSection;
