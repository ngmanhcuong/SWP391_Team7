import React from 'react';
import { PrescriptionRecord } from '../types';
import HealthRecordsEmptyState from './HealthRecordsEmptyState';

interface PrescriptionsHistorySectionProps {
  prescriptions: PrescriptionRecord[];
}

const PrescriptionsHistorySection: React.FC<PrescriptionsHistorySectionProps> = ({
  prescriptions,
}) => {
  if (prescriptions.length === 0) {
    return <HealthRecordsEmptyState tab="prescriptions" />;
  }

  return (
    <div className="divide-y divide-[#c3c6d6] rounded-lg border border-[#c3c6d6] bg-white overflow-hidden">
      {prescriptions.map((rx) => (
        <div key={rx.id} className="px-6 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-medium text-[#003d9b]">{rx.name}</p>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${
                  rx.status === 'active'
                    ? 'bg-[#006c47]/10 text-[#006c47]'
                    : 'bg-[#edeef0] text-[#434654]'
                }`}
              >
                {rx.status === 'active' ? 'Đang dùng' : 'Đã hoàn thành'}
              </span>
            </div>
            <p className="text-sm text-[#434654] mt-0.5">{rx.dosage}</p>
            <p className="text-xs text-[#737685] mt-1">
              {rx.doctorName} · Kê ngày {rx.prescribedDate} · {rx.duration}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionsHistorySection;
