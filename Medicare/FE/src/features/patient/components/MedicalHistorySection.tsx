import React from 'react';
import { AlertCircle, HeartPulse, Scissors, Users } from 'lucide-react';
import { MedicalHistoryItem } from '../types';
import HealthRecordsEmptyState from './HealthRecordsEmptyState';
interface MedicalHistorySectionProps {
  items: MedicalHistoryItem[];
}

const typeConfig: Record<
  MedicalHistoryItem['type'],
  { icon: React.ReactNode; accent: string }
> = {
  allergy: {
    icon: <AlertCircle size={16} />,
    accent: 'text-[#ba1a1a] bg-[rgba(255,218,214,0.3)]',
  },
  chronic: {
    icon: <HeartPulse size={16} />,
    accent: 'text-[#003d9b] bg-[rgba(0,82,204,0.1)]',
  },
  surgery: {
    icon: <Scissors size={16} />,
    accent: 'text-[#434654] bg-[#edeef0]',
  },
  family: {
    icon: <Users size={16} />,
    accent: 'text-[#006c47] bg-[rgba(130,249,190,0.2)]',
  },
};

const typeLabels: Record<MedicalHistoryItem['type'], string> = {
  allergy: 'Dị ứng',
  chronic: 'Bệnh mạn tính',
  surgery: 'Phẫu thuật',
  family: 'Gia đình',
};

const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({ items }) => {
  if (items.length === 0) {
    return <HealthRecordsEmptyState tab="history" />;
  }

  return (
  <div className="grid gap-3 sm:grid-cols-2">
    {items.map((item) => {        const config = typeConfig[item.type];
        return (
          <div
            key={item.id}
            className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm p-5 space-y-2"
          >
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${config.accent}`}
              >
                {config.icon}
              </span>
              <div>
                <p className="text-xs text-[#737685]">{typeLabels[item.type]}</p>
                <p className="text-base font-medium text-[#191c1e]">{item.label}</p>
              </div>
            </div>
            <p className="text-sm text-[#434654]">{item.detail}</p>
            {item.since && (
              <p className="text-xs text-[#737685]">Từ năm {item.since}</p>
            )}
          </div>
        );
      })}
  </div>
  );
};

export default MedicalHistorySection;