import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { ChartDataPoint } from '../types';
import { DOCTOR_PATHS } from '../utils/doctorPaths';

interface ExaminationFrequencyChartProps {
  data: ChartDataPoint[];
  average: string;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral';
}

const PERIOD_OPTIONS = ['Tuần này', 'Tuần trước', 'Tháng này'];

const trendColor: Record<string, string> = {
  positive: 'text-emerald-600',
  negative: 'text-rose-600',
  neutral: 'text-slate-500',
};

const ExaminationFrequencyChart: React.FC<ExaminationFrequencyChartProps> = ({
  data,
  average,
  trend,
  trendType,
}) => {
  const [period, setPeriod] = useState(PERIOD_OPTIONS[0]);
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 p-5 sm:p-6 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-[#191c1e]">Tần suất khám bệnh</h2>
          <Link to={DOCTOR_PATHS.schedule} className="text-[11px] text-[#003d9b] hover:underline mt-0.5 inline-block">
            Xem chi tiết lịch khám
          </Link>
        </div>
        <div className="relative shrink-0">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none text-sm font-medium text-[#434654] bg-[#f8f9fb] border border-[#c3c6d6]/60 rounded-lg pl-3 pr-8 py-1.5 outline-none focus:border-[#003d9b] cursor-pointer"
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737685] pointer-events-none"
          />
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2 sm:gap-3 min-h-[160px] px-1">
        {data.map((point) => {
          const barHeight = Math.max(Math.round((point.count / maxCount) * 120), 10);
          return (
            <div key={point.day} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-semibold text-[#737685]">{point.count}</span>
              <div className="w-full flex items-end justify-center h-[120px]">
                <div
                  className="w-full max-w-[36px] rounded-t-lg bg-gradient-to-t from-[#003d9b] to-[#4a7fd4] transition-all duration-300 hover:from-[#002d75] hover:to-[#003d9b]"
                  style={{ height: `${barHeight}px` }}
                  title={`${point.count} ca khám`}
                />
              </div>
              <span className="text-xs font-medium text-[#737685]">{point.day}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-[#c3c6d6]/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#737685]">
          Trung bình:{' '}
          <span className="text-[#191c1e] normal-case tracking-normal">{average}</span>
        </p>
        <p className={`inline-flex items-center gap-1 text-xs font-semibold ${trendColor[trendType]}`}>
          <TrendingUp size={14} />
          {trend}
        </p>
      </div>
    </div>
  );
};

export default ExaminationFrequencyChart;
