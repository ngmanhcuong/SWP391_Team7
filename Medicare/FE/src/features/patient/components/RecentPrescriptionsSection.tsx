import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Prescription } from '../types';

interface RecentPrescriptionsSectionProps {
  prescriptions: Prescription[];
}

const RecentPrescriptionsSection: React.FC<RecentPrescriptionsSectionProps> = ({ prescriptions }) => (
  <div className="bg-white border border-[rgba(195,198,214,0.3)] rounded-lg shadow-sm p-6 flex flex-col gap-4 h-full">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-base font-semibold text-[#191c1e]">Đơn thuốc của bạn</h2>
        <p className="text-xs text-[#737685] mt-0.5">Đơn đang được sử dụng</p>
      </div>
      <Link to="/patient/ho-so" className="text-[#1a56db] hover:opacity-80" aria-label="Xem hồ sơ thuốc">
        <Plus size={18} />
      </Link>
    </div>

    {prescriptions.length === 0 ? (
      <p className="text-sm text-[#737685]">Bạn chưa có đơn thuốc nào đang dùng.</p>
    ) : (
      <div className="flex flex-col gap-4">
        {prescriptions.map((rx) => (
          <div key={rx.id} className="border border-[rgba(195,198,214,0.2)] rounded p-2.5">
            <p className="text-base text-[#1a56db]">{rx.name}</p>
            <p className="text-base text-[#434654]">{rx.dosage}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default RecentPrescriptionsSection;
