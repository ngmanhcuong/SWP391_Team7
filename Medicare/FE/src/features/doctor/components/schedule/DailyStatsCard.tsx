import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../../../components/ui';
import { DOCTOR_PATHS } from '../../utils/doctorPaths';
import { TodayScheduleStats } from '../../types';

interface DailyStatsCardProps {
  stats: TodayScheduleStats;
  progress: {
    completed: number;
    total: number;
    pending: number;
    percent: number;
  };
}

const DailyStatsCard: React.FC<DailyStatsCardProps> = ({ stats, progress }) => (
  <div className="rounded-2xl bg-gradient-to-br from-[#003d9b] to-[#1a56db] p-5 text-white shadow-lg shadow-[#003d9b]/20">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-white/90">Thống kê ngày</h3>
      <span className="text-xs font-bold bg-white/15 px-2 py-1 rounded-full">{progress.percent}%</span>
    </div>

    <div className="grid grid-cols-3 gap-3 mb-5">
      <div className="rounded-xl bg-white/10 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Tổng lịch</p>
        <p className="text-xl font-bold mt-1">{stats.total.toString().padStart(2, '0')}</p>
      </div>
      <div className="rounded-xl bg-white/10 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Hoàn thành</p>
        <p className="text-xl font-bold mt-1">{stats.completed.toString().padStart(2, '0')}</p>
      </div>
      <div className="rounded-xl bg-white/10 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Chờ khám</p>
        <p className="text-xl font-bold mt-1">{stats.waiting.toString().padStart(2, '0')}</p>
      </div>
    </div>

    <div className="h-1.5 rounded-full bg-white/20 mb-4">
      <div
        className="h-1.5 rounded-full bg-white transition-all duration-500"
        style={{ width: `${progress.percent}%` }}
      />
    </div>

    <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/15">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex -space-x-2 shrink-0">
          {stats.waitingPatientNames.map((name) => (
            <Avatar key={name} name={name} size="xs" className="ring-2 ring-[#003d9b]" />
          ))}
        </div>
        <p className="text-xs text-white/80 truncate">
          <span className="font-semibold text-white">{stats.waiting} BN</span> đang chờ
        </p>
      </div>
      <Link to={DOCTOR_PATHS.records} className="text-xs font-semibold text-white hover:underline shrink-0">
        Hồ sơ
      </Link>
    </div>
  </div>
);

export default DailyStatsCard;
