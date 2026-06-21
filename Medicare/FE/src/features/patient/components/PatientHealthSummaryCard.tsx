import React from 'react';
import { Activity, Droplets, Ruler, Scale } from 'lucide-react';
import { Avatar } from '../../../components/ui';
import { User } from '../../../types';

interface PatientHealthSummaryCardProps {
  user: User;
  summary: {
    bloodType?: string;
    height?: string;
    weight?: string;
    lastCheckup?: string;
  };
  allergyCount: number;
}

const PatientHealthSummaryCard: React.FC<PatientHealthSummaryCardProps> = ({
  user,
  summary,
  allergyCount,
}) => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
    <div className="border-b border-[#c3c6d6]/60 px-6 py-5">
      <h3 className="text-lg font-semibold text-[#191c1e]">Thông tin sức khỏe</h3>
    </div>
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-4">
        <Avatar name={user.fullName} src={user.avatar} size="lg" />
        <div className="min-w-0">
          <p className="text-base font-medium text-[#191c1e]">{user.fullName}</p>
          <p className="text-sm text-[#434654]">{user.email}</p>
          {user.phone && <p className="text-sm text-[#434654]">{user.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#f8f9fb] border border-[#c3c6d6]/60 p-3 transition-colors hover:border-[#003d9b]/20">
          <div className="flex items-center gap-2 text-[#737685] text-xs mb-1">
            <Droplets size={14} />
            Nhóm máu
          </div>
          <p className="text-base font-semibold text-[#191c1e]">{summary.bloodType ?? '—'}</p>
        </div>
        <div className="rounded-xl bg-[#f8f9fb] border border-[#c3c6d6]/60 p-3 transition-colors hover:border-[#003d9b]/20">
          <div className="flex items-center gap-2 text-[#737685] text-xs mb-1">
            <Activity size={14} />
            Khám gần nhất
          </div>
          <p className="text-base font-semibold text-[#191c1e]">{summary.lastCheckup ?? '—'}</p>
        </div>
        <div className="rounded-xl bg-[#f8f9fb] border border-[#c3c6d6]/60 p-3 transition-colors hover:border-[#003d9b]/20">
          <div className="flex items-center gap-2 text-[#737685] text-xs mb-1">
            <Ruler size={14} />
            Chiều cao
          </div>
          <p className="text-base font-semibold text-[#191c1e]">{summary.height ?? '—'}</p>
        </div>
        <div className="rounded-xl bg-[#f8f9fb] border border-[#c3c6d6]/60 p-3 transition-colors hover:border-[#003d9b]/20">
          <div className="flex items-center gap-2 text-[#737685] text-xs mb-1">
            <Scale size={14} />
            Cân nặng
          </div>
          <p className="text-base font-semibold text-[#191c1e]">{summary.weight ?? '—'}</p>
        </div>
      </div>

      {allergyCount > 0 && (
        <div className="rounded-xl border border-[#ba1a1a]/20 bg-[#fff1f0] px-4 py-3 text-sm text-[#ba1a1a]">
          Bạn có {allergyCount} dị ứng đã ghi nhận. Vui lòng thông báo bác sĩ trước khi kê đơn.
        </div>
      )}
    </div>
  </div>
);

export default PatientHealthSummaryCard;
