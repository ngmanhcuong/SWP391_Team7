import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { DOCTOR_PATHS } from '../../utils/doctorPaths';
import { PatientListSummary } from '../../types';

interface PatientListSummaryCardsProps {
  summary: PatientListSummary;
}

const PatientListSummaryCards: React.FC<PatientListSummaryCardsProps> = ({ summary }) => {
  const maxChart = Math.max(...summary.weeklyChart, 1);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl bg-gradient-to-br from-[#003d9b] to-[#1a56db] p-5 text-white shadow-lg shadow-[#003d9b]/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-white/70">Tổng số bệnh nhân quản lý</p>
            <p className="text-3xl font-bold mt-2">
              {summary.totalManaged.toLocaleString('vi-VN')}
            </p>
            <p className="text-xs text-emerald-200 mt-2 font-medium">{summary.totalTrend}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Users size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm p-5">
        <p className="text-xs font-medium text-[#737685]">Bệnh nhân mới tuần này</p>
        <p className="text-3xl font-bold text-[#191c1e] mt-2">{summary.newThisWeek}</p>
        <div className="flex items-end gap-1.5 h-10 mt-4">
          {summary.weeklyChart.map((value, index) => (
            <div
              key={index}
              className="flex-1 rounded-sm bg-emerald-400/80 min-h-[4px]"
              style={{ height: `${(value / maxChart) * 100}%` }}
            />
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm p-5 sm:col-span-2 lg:col-span-1">
        <p className="text-xs font-medium text-[#737685]">Chờ tái khám</p>
        <p className="text-3xl font-bold text-[#191c1e] mt-2">{summary.waitingReExam}</p>
        <Link
          to={DOCTOR_PATHS.schedule}
          className="inline-block mt-4 text-sm font-medium text-[#003d9b] hover:underline"
        >
          Xem danh sách chờ
        </Link>
      </div>
    </div>
  );
};

export default PatientListSummaryCards;
