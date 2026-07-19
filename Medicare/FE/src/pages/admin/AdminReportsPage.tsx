import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  FileSpreadsheet,
  FileText,
  ListFilter,
  MoreHorizontal,
} from 'lucide-react';
import { Card } from '../../components/ui';
import Button from '../../components/ui/Button';
import { useAdminReports } from '../../features/admin/hooks';
import { SUPPLY_STATUS_LABELS } from '../../features/admin/constants';
import type { SpecialtyShare, SupplyItem } from '../../features/admin/types';

const PERIODS = ['Ngày', 'Tuần', 'Tháng', 'Năm'] as const;

const PatientTrendChart: React.FC<{ data: { month: string; value: number }[] }> = ({ data }) => {
  const width = 560;
  const height = 230;
  const padX = 36;
  const padY = 20;
  const values = data.map((item) => item.value);
  const maxValue = Math.max(...values, 1);
  const minValue = 0;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = data.map((point, index) => {
    const x = data.length > 1 ? padX + (innerW * index) / (data.length - 1) : width / 2;
    const y = padY + innerH * (1 - (point.value - minValue) / Math.max(maxValue - minValue, 1));
    return { ...point, x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${padY + innerH} L ${points[0].x} ${padY + innerH} Z`
    : '';
  const gridValues = [maxValue, Math.round(maxValue * 0.75), Math.round(maxValue * 0.5), Math.round(maxValue * 0.25), 0];
  const highlight = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height + 24}`} className="w-full" role="img">
      <defs>
        <linearGradient id="patientArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a56db" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#1a56db" stopOpacity="0" />
        </linearGradient>
      </defs>

      {gridValues.map((value) => {
        const y = padY + innerH * (1 - (value - minValue) / Math.max(maxValue - minValue, 1));
        return (
          <g key={value}>
            <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="#e5e7eb" strokeDasharray="4 4" />
            <text x={4} y={y + 4} fontSize="10" fill="#9ca3af">
              {value}
            </text>
          </g>
        );
      })}

      {points.length > 0 && (
        <>
          <path d={areaPath} fill="url(#patientArea)" />
          <path d={linePath} fill="none" stroke="#1a56db" strokeWidth={2.5} strokeLinecap="round" />
          {points.map((p) => (
            <text key={p.month} x={p.x} y={height + 4} fontSize="10" fill="#9ca3af" textAnchor="middle">
              {p.month}
            </text>
          ))}
          {highlight && <circle cx={highlight.x} cy={highlight.y} r={5} fill="#1a56db" stroke="#fff" strokeWidth={2} />}
        </>
      )}
    </svg>
  );
};

const TrendArrow: React.FC<{ trend: 'up' | 'down' | 'flat' }> = ({ trend }) => {
  if (trend === 'down') return <ArrowDownRight size={16} className="text-rose-500" />;
  if (trend === 'flat') return <ArrowRight size={16} className="text-gray-400" />;
  return <ArrowUpRight size={16} className="text-emerald-500" />;
};

export const AdminReportsPage: React.FC = () => {
  const { stats, patientTrend, specialtyShare, specialtyTotal, supplies, suppliesTotal, generatedAt } =
    useAdminReports();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('Ngày');

  const reportDate = useMemo(() => {
    const date = generatedAt ? new Date(generatedAt) : new Date('2026-07-19T00:00:00+07:00');
    return date.toLocaleDateString('vi-VN');
  }, [generatedAt]);

  let acc = 0;
  const gradientStops = specialtyShare
    .map((item: SpecialtyShare) => {
      const start = acc;
      acc += item.percent;
      return `${item.color} ${start}% ${acc}%`;
    })
    .join(', ');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="mb-1 text-xs text-gray-400">
            Báo cáo <span className="mx-1">/</span> Thống kê chuyên sâu
          </nav>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Lexend' }}>
            Báo cáo &amp; Thống kê chuyên sâu
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-slate-700">
            {PERIODS.map((item) => (
              <button
                key={item}
                onClick={() => setPeriod(item)}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                  period === item
                    ? 'bg-[#1a56db] text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-slate-300'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <span className="hidden text-sm text-gray-500 dark:text-slate-400 sm:inline">
            Báo cáo ngày {reportDate}
          </span>

          <Button variant="primary" leftIcon={<FileSpreadsheet size={16} />}>
            Xuất Excel
          </Button>
          <Button variant="danger" leftIcon={<FileText size={16} />}>
            Xuất PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const trend = stat.trend ?? 'up';
          return (
            <Card key={stat.id} hover>
              <div className="flex items-start justify-between">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon size={18} />
                </span>
                {stat.delta && (
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      trend === 'down' ? 'text-rose-500' : 'text-emerald-600'
                    }`}
                  >
                    {trend === 'down' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                    {stat.delta}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">{stat.label}</p>
              <p className="mt-0.5 text-2xl font-bold">{stat.value}</p>
              {stat.progress !== undefined && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                  <div
                    className={`h-full rounded-full ${stat.barColor ?? 'bg-blue-500'}`}
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="font-semibold" style={{ fontFamily: 'Lexend' }}>
              Lượng bệnh nhân theo tháng
            </h2>
            <span className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-500 dark:border-slate-600 dark:text-slate-300">
              Năm 2026
            </span>
          </div>
          <PatientTrendChart data={patientTrend} />
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold" style={{ fontFamily: 'Lexend' }}>
            Tỷ lệ theo chuyên khoa
          </h2>
          <div className="relative mx-auto my-2 h-40 w-40">
            <div
              className="absolute inset-0 rotate-45 rounded-2xl"
              style={{ background: `conic-gradient(from 0deg, ${gradientStops || '#cbd5e1 0% 100%'})` }}
            />
            <div className="absolute inset-[14px] rotate-45 rounded-xl bg-white dark:bg-slate-800" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{specialtyTotal}</span>
              <span className="text-xs text-gray-500 dark:text-slate-400">Tổng cộng</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {specialtyShare.map((item: SpecialtyShare) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-gray-600 dark:text-slate-300">
                  {item.name} ({item.percent}%)
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-700">
          <h2 className="font-semibold" style={{ fontFamily: 'Lexend' }}>
            Tình hình sử dụng thuốc &amp; vật tư
          </h2>
          <div className="flex items-center gap-3 text-gray-400">
            <button className="hover:text-gray-600">
              <ListFilter size={18} />
            </button>
            <button className="hover:text-gray-600">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {supplies.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-gray-500 dark:text-slate-400">
            Chưa có dữ liệu kho vật tư thực tế trong hệ thống, nên phần này đang để trống thay vì hiển thị số liệu mẫu.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="px-5 py-3 font-medium">Mã vật tư</th>
                  <th className="px-5 py-3 font-medium">Tên thuốc / vật tư</th>
                  <th className="px-5 py-3 font-medium">Đơn vị</th>
                  <th className="px-5 py-3 text-right font-medium">Tồn kho</th>
                  <th className="px-5 py-3 text-right font-medium">Đã sử dụng</th>
                  <th className="px-5 py-3 text-center font-medium">Trạng thái</th>
                  <th className="px-5 py-3 text-center font-medium">Biến động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {supplies.map((item: SupplyItem) => {
                  const status = SUPPLY_STATUS_LABELS[item.status];
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-700/30">
                      <td className="px-5 py-3 font-medium text-gray-700 dark:text-slate-200">{item.code}</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-slate-300">{item.name}</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-slate-300">{item.unit}</td>
                      <td className="px-5 py-3 text-right text-gray-600 dark:text-slate-300">
                        {item.stock.toLocaleString('vi-VN')}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-600 dark:text-slate-300">
                        {item.used.toLocaleString('vi-VN')}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-center">
                          <TrendArrow trend={item.trend} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-gray-100 px-5 py-4 dark:border-slate-700">
          <span className="text-sm text-gray-500 dark:text-slate-400">
            Hiển thị {supplies.length} trên {suppliesTotal.toLocaleString('vi-VN')} vật tư
          </span>
        </div>
      </Card>
    </div>
  );
};

export default AdminReportsPage;
