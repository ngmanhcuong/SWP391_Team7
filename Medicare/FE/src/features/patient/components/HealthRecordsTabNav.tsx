import React from 'react';
import { HealthRecordTab } from '../types';

interface HealthRecordsTabNavProps {
  activeTab: HealthRecordTab;
  onTabChange: (tab: HealthRecordTab) => void;
  counts: Record<HealthRecordTab, number>;
}

const TABS: { id: HealthRecordTab; label: string }[] = [
  { id: 'visits', label: 'Lịch sử khám' },
  { id: 'prescriptions', label: 'Đơn thuốc' },
  { id: 'labs', label: 'Xét nghiệm' },
  { id: 'history', label: 'Tiền sử bệnh' },
];

const HealthRecordsTabNav: React.FC<HealthRecordsTabNavProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => (
  <div className="flex flex-wrap gap-2 p-1 bg-[#f8f9fb] border border-[#c3c6d6] rounded-lg">
    {TABS.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            isActive
              ? 'bg-white text-[#003d9b] shadow-sm border border-[#c3c6d6]'
              : 'text-[#434654] hover:text-[#003d9b]'
          }`}
        >
          {tab.label}
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              isActive ? 'bg-[#003d9b]/10 text-[#003d9b]' : 'bg-[#edeef0] text-[#434654]'
            }`}
          >
            {counts[tab.id]}
          </span>
        </button>
      );
    })}
  </div>
);

export default HealthRecordsTabNav;
