import React from 'react';

interface ScheduleProgressBarProps {
  completed: number;
  total: number;
  pending?: number;
  compact?: boolean;
}

const ScheduleProgressBar: React.FC<ScheduleProgressBarProps> = ({
  completed,
  total,
  pending,
  compact = false,
}) => {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <div className={`flex items-center justify-between gap-3 ${compact ? 'text-xs' : 'text-sm'}`}>
        <span className="font-medium text-[#434654]">
          Tiến độ khám:{' '}
          <span className="text-[#191c1e] font-semibold">
            {completed}/{total} ca
          </span>
        </span>
        <span className="font-semibold text-[#003d9b]">{percent}%</span>
      </div>
      <div className={`w-full rounded-full bg-[#e8f0fe] ${compact ? 'h-1.5' : 'h-2'}`}>
        <div
          className={`rounded-full bg-gradient-to-r from-[#003d9b] to-[#4a7fd4] transition-all duration-500 ${compact ? 'h-1.5' : 'h-2'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {pending !== undefined && !compact && (
        <p className="text-xs text-[#737685]">
          Còn <span className="font-semibold text-amber-700">{pending} ca</span> chưa hoàn thành
        </p>
      )}
    </div>
  );
};

export default ScheduleProgressBar;
