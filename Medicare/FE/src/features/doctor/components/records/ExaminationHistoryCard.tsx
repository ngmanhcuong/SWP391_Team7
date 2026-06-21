import React from 'react';
import { History } from 'lucide-react';
import { ExaminationHistoryEntry } from '../../types';

interface ExaminationHistoryCardProps {
  history: ExaminationHistoryEntry[];
}

const ExaminationHistoryCard: React.FC<ExaminationHistoryCardProps> = ({ history }) => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#2563eb]/5 overflow-hidden">
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#c3c6d6]/40">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f0fe]">
        <History size={16} className="text-[#2563eb]" />
      </div>
      <h3 className="text-sm font-semibold text-[#191c1e]">Lịch sử khám bệnh</h3>
    </div>

    <div className="divide-y divide-[#c3c6d6]/20">
      {history.map((entry) => (
        <div key={entry.id} className="px-5 py-3.5 hover:bg-[#f8f9fb]/40 transition-colors">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-[#2563eb]">{entry.date}</span>
            <span className="text-xs text-[#737685]">{entry.doctor}</span>
          </div>
          <p className="text-sm text-[#434654]">{entry.diagnosis}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ExaminationHistoryCard;
