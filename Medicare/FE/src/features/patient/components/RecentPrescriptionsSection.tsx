import React from 'react';
import { ChevronRight, Pill, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Prescription } from '../types';

interface RecentPrescriptionsSectionProps {
  prescriptions: Prescription[];
}

const RecentPrescriptionsSection: React.FC<RecentPrescriptionsSectionProps> = ({ prescriptions }) => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 p-6 flex flex-col gap-4 h-full">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003d9b]/10 ring-1 ring-[#003d9b]/10">
          <Pill size={18} className="text-[#003d9b]" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#191c1e]">Đơn thuốc của bạn</h2>
          <p className="text-xs text-[#737685] mt-0.5">Đơn đang được sử dụng</p>
        </div>
      </div>
      <Link
        to="/patient/ho-so?tab=prescriptions"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-[#003d9b] hover:bg-[#003d9b]/5 transition-colors"
        aria-label="Xem hồ sơ thuốc"
      >
        <Plus size={18} />
      </Link>
    </div>

    {prescriptions.length === 0 ? (
      <p className="text-sm text-[#737685] py-4">Bạn chưa có đơn thuốc nào đang dùng.</p>
    ) : (
      <div className="flex flex-col gap-3">
        {prescriptions.map((rx, index) => (
          <div
            key={rx.id}
            className="group flex items-start gap-3 rounded-xl border border-[#c3c6d6]/50 bg-[#f8f9fb]/50 px-4 py-3 hover:border-[#003d9b]/25 hover:bg-white transition-colors"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-[#003d9b] ring-1 ring-[#003d9b]/10">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#003d9b]">{rx.name}</p>
              <p className="text-sm text-[#434654] mt-0.5">{rx.dosage}</p>
            </div>
            <ChevronRight size={16} className="text-[#c3c6d6] group-hover:text-[#003d9b] mt-1 shrink-0 transition-colors" />
          </div>
        ))}
      </div>
    )}
  </div>
);

export default RecentPrescriptionsSection;
