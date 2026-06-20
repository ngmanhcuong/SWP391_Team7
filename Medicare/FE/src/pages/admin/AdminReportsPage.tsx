import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  ListFilter,
  MoreHorizontal,
} from 'lucide-react';
import { Card } from '../../components/ui';
import Button from '../../components/ui/Button';
import { useAdminReports } from '../../features/admin/hooks';
import { SUPPLY_STATUS_LABELS } from '../../features/admin/constants';
import { exportReportToPdf } from '../../features/admin/utils/reportExport';

const PERIODS = ['Ngày', 'Tuần', 'Tháng', 'Năm'] as const;
type ReportPeriod = (typeof PERIODS)[number];
type SupplyStatusFilter = 'all' | 'safe' | 'low';
type SupplySort = 'used-desc' | 'stock-asc' | 'name-asc';

const PERIOD_CONFIG: Record<ReportPeriod, { range: string; chartTitle: string; chartBadge: string; multiplier: number }> = {
  Ngày: { range: 'Hôm nay', chartTitle: 'Lượng bệnh nhân theo khung giờ', chartBadge: 'Trong ngày', multiplier: 0.04 },
  Tuần: { range: '7 ngày gần nhất', chartTitle: 'Lượng bệnh nhân theo ngày', chartBadge: 'Tuần này', multiplier: 0.28 },
  Tháng: { range: '30 ngày gần nhất', chartTitle: 'Lượng bệnh nhân theo tuần', chartBadge: 'Tháng này', multiplier: 1 },
  Năm: { range: '12 tháng gần nhất', chartTitle: 'Lượng bệnh nhân theo tháng', chartBadge: 'Năm 2026', multiplier: 12 },
};

const formatReportValue = (raw: string, multiplier: number) => {
  if (raw.includes('%')) return raw;
  const value = Number(raw.replace(/[^\d.]/g, ''));
  if (!value) return raw;
  if (raw.toLowerCase().includes('b')) return `${(value * multiplier).toFixed(multiplier < 1 ? 2 : 1)}B VND`;
  return Math.max(1, Math.round(value * multiplier)).toLocaleString('vi-VN');
};

const PatientTrendChart: React.FC<{ data: { month: string; value: number }[] }> = ({ data }) => {
  const width = 560;
  const height = 230;
  const padX = 36;
  const padY = 20;
  const maxDataValue = Math.max(...data.map((point) => point.value), 1);
  const maxValue = Math.ceil((maxDataValue * 1.15) / 100) * 100;
  const minValue = 0;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = data.map((point, index) => {
    const x = padX + (innerW * index) / Math.max(data.length - 1, 1);
    const y = padY + innerH * (1 - (point.value - minValue) / (maxValue - minValue));
    return { ...point, x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padY + innerH} L ${points[0].x} ${padY + innerH} Z`;
  const gridValues = [1, 0.75, 0.5, 0.25, 0].map((ratio) => Math.round(maxValue * ratio));
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
        const y = padY + innerH * (1 - (value - minValue) / (maxValue - minValue));
        return (
          <g key={value}>
            <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="#e5e7eb" strokeDasharray="4 4" />
            <text x={4} y={y + 4} fontSize="10" fill="#9ca3af">
              {value}
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill="url(#patientArea)" />
      <path d={linePath} fill="none" stroke="#1a56db" strokeWidth={2.5} strokeLinecap="round" />
      {points.map((p) => (
        <text key={p.month} x={p.x} y={height + 4} fontSize="10" fill="#9ca3af" textAnchor="middle">
          {p.month}
        </text>
      ))}
      <circle cx={highlight.x} cy={highlight.y} r={5} fill="#1a56db" stroke="#fff" strokeWidth={2} />
    </svg>
  );
};

const TrendArrow: React.FC<{ trend: 'up' | 'down' | 'flat' }> = ({ trend }) => {
  if (trend === 'down') return <ArrowDownRight size={16} className="text-rose-500" />;
  if (trend === 'flat') return <ArrowRight size={16} className="text-gray-400" />;
  return <ArrowUpRight size={16} className="text-emerald-500" />;
};

export const AdminReportsPage: React.FC = () => {
  const { stats, patientTrend, specialtyShare, specialtyTotal, supplies, suppliesTotal } =
    useAdminReports();
  const [period, setPeriod] = useState<ReportPeriod>('Tháng');
  const [supplyStatus, setSupplyStatus] = useState<SupplyStatusFilter>('all');
  const [supplySort, setSupplySort] = useState<SupplySort>('used-desc');
  const [supplyPage, setSupplyPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const periodConfig = PERIOD_CONFIG[period];
  const reportRange = periodConfig.range;
  const displayStats = useMemo(
    () =>
      stats.map((stat) => ({
        ...stat,
        value: formatReportValue(stat.value, periodConfig.multiplier),
      })),
    [periodConfig.multiplier, stats],
  );
  const displayTrend = useMemo(() => {
    const labels: Record<ReportPeriod, string[]> = {
      Ngày: ['07h', '09h', '11h', '13h', '15h', '17h'],
      Tuần: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      Tháng: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      Năm: patientTrend.map((point) => point.month),
    };
    const source = patientTrend.slice(-labels[period].length);
    return labels[period].map((label, index) => ({
      month: label,
      value: Math.max(
        1,
        Math.round((source[index]?.value ?? patientTrend[index % patientTrend.length].value) * periodConfig.multiplier),
      ),
    }));
  }, [patientTrend, period, periodConfig.multiplier]);
  const reportOptions = useMemo(
    () => ({
      title: 'Báo cáo & Thống kê chuyên sâu',
      filePrefix: 'bao-cao-admin',
      rangeLabel: reportRange,
      tables: [
        {
          title: 'Chỉ số tổng quan',
          headers: ['Chỉ số', 'Giá trị', 'Biến động'],
          rows: displayStats.map((stat) => [stat.label, stat.value, stat.delta ?? '-']),
        },
        {
          title: periodConfig.chartTitle,
          headers: ['Mốc thời gian', 'Số bệnh nhân'],
          rows: displayTrend.map((item) => [item.month, item.value]),
        },
        {
          title: `Tỷ lệ theo chuyên khoa (${specialtyTotal} tổng cộng)`,
          headers: ['Chuyên khoa', 'Tỷ lệ'],
          rows: specialtyShare.map((item) => [item.name, `${item.percent}%`]),
        },
        {
          title: `Thuốc & vật tư (${supplies.length}/${suppliesTotal})`,
          headers: ['Mã', 'Tên', 'Đơn vị', 'Tồn kho', 'Đã dùng', 'Trạng thái'],
          rows: supplies.map((item) => [
            item.code,
            item.name,
            item.unit,
            item.stock,
            item.used,
            SUPPLY_STATUS_LABELS[item.status].label,
          ]),
        },
      ],
    }),
    [displayStats, displayTrend, periodConfig.chartTitle, reportRange, specialtyShare, specialtyTotal, supplies, suppliesTotal],
  );
  const supplyPageSize = 4;
  const filteredSupplies = useMemo(() => {
    const filtered = supplies.filter((item) => supplyStatus === 'all' || item.status === supplyStatus);
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (supplySort === 'stock-asc') return a.stock - b.stock;
      if (supplySort === 'name-asc') return a.name.localeCompare(b.name, 'vi');
      return b.used - a.used;
    });
    return sorted;
  }, [supplies, supplySort, supplyStatus]);
  const supplyTotalPages = Math.max(1, Math.ceil(filteredSupplies.length / supplyPageSize));
  const visibleSupplies = filteredSupplies.slice((supplyPage - 1) * supplyPageSize, supplyPage * supplyPageSize);
  const lowSupplyCount = supplies.filter((item) => item.status === 'low').length;

  // Tạo conic-gradient cho biểu đồ hình thoi theo tỷ lệ chuyên khoa
  let acc = 0;
  const gradientStops = specialtyShare
    .map((item) => {
      const start = acc;
      acc += item.percent;
      return `${item.color} ${start}% ${acc}%`;
    })
    .join(', ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="text-xs text-gray-400 mb-1">
            Báo cáo <span className="mx-1">/</span> Thống kê chuyên sâu
          </nav>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Lexend' }}>
            Báo cáo &amp; Thống kê chuyên sâu
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-white/90 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-[#1a56db] dark:bg-blue-950/40">
            <CalendarDays size={16} />
            {reportRange}
          </div>
          <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-slate-700">
            {PERIODS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-all ${
                  period === item
                    ? 'bg-[#1a56db] text-white shadow'
                    : 'text-gray-500 hover:bg-white hover:text-gray-800 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <Button variant="danger" leftIcon={<FileText size={16} />} onClick={() => exportReportToPdf(reportOptions)}>
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {displayStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.id} hover>
              <div className="flex items-start justify-between">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={18} />
                </span>
                {stat.delta && (
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      stat.trend === 'down' ? 'text-rose-500' : 'text-emerald-600'
                    }`}
                  >
                    {stat.trend === 'down' ? (
                      <ArrowDownRight size={14} />
                    ) : (
                      <ArrowUpRight size={14} />
                    )}
                    {stat.delta}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
              {stat.progress !== undefined && (
                <div className="mt-3 h-1.5 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
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

      {/* Charts row */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Patient trend */}
        <Card className="xl:col-span-2">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="font-semibold" style={{ fontFamily: 'Lexend' }}>
              {periodConfig.chartTitle}
            </h2>
            <span className="rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-1 text-xs text-gray-500 dark:text-slate-300">
              {periodConfig.chartBadge}
            </span>
          </div>
          <PatientTrendChart data={displayTrend} />
        </Card>

        {/* Specialty share */}
        <Card>
          <h2 className="font-semibold mb-4" style={{ fontFamily: 'Lexend' }}>
            Tỷ lệ theo chuyên khoa
          </h2>
          <div className="relative w-40 h-40 mx-auto my-2">
            <div
              className="absolute inset-0 rotate-45 rounded-2xl"
              style={{ background: `conic-gradient(from 0deg, ${gradientStops})` }}
            />
            <div className="absolute inset-[14px] rotate-45 rounded-xl bg-white dark:bg-slate-800" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{specialtyTotal}</span>
              <span className="text-xs text-gray-500 dark:text-slate-400">Tổng cộng</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {specialtyShare.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="text-gray-600 dark:text-slate-300">
                  {item.name} ({item.percent}%)
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Supplies table */}
      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
          <h2 className="font-semibold" style={{ fontFamily: 'Lexend' }}>
            Tình hình sử dụng thuốc &amp; vật tư
          </h2>
          <div className="relative flex items-center gap-3 text-gray-400">
            <button
              type="button"
              onClick={() => {
                setFilterOpen((open) => !open);
                setMenuOpen(false);
              }}
              className={`rounded-lg p-1.5 hover:bg-gray-100 hover:text-gray-600 ${
                filterOpen ? 'bg-blue-50 text-[#1a56db]' : ''
              }`}
              title="Lọc vật tư"
            >
              <ListFilter size={18} />
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen((open) => !open);
                setFilterOpen(false);
              }}
              className={`rounded-lg p-1.5 hover:bg-gray-100 hover:text-gray-600 ${
                menuOpen ? 'bg-blue-50 text-[#1a56db]' : ''
              }`}
              title="Thao tác"
            >
              <MoreHorizontal size={18} />
            </button>
            {filterOpen && (
              <div className="absolute right-8 top-8 z-20 w-72 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                <p className="text-sm font-semibold text-gray-800">Bộ lọc vật tư</p>
                <label className="mt-3 block text-xs font-medium text-gray-500">Trạng thái</label>
                <select
                  value={supplyStatus}
                  onChange={(event) => {
                    setSupplyStatus(event.target.value as SupplyStatusFilter);
                    setSupplyPage(1);
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none"
                >
                  <option value="all">Tất cả</option>
                  <option value="safe">An toàn</option>
                  <option value="low">Sắp hết</option>
                </select>
                <label className="mt-3 block text-xs font-medium text-gray-500">Sắp xếp</label>
                <select
                  value={supplySort}
                  onChange={(event) => {
                    setSupplySort(event.target.value as SupplySort);
                    setSupplyPage(1);
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none"
                >
                  <option value="used-desc">Đã sử dụng nhiều nhất</option>
                  <option value="stock-asc">Tồn kho thấp nhất</option>
                  <option value="name-asc">Tên A-Z</option>
                </select>
              </div>
            )}
            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setSupplyStatus('low');
                    setSupplyPage(1);
                    setMenuOpen(false);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Xem vật tư sắp hết ({lowSupplyCount})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSupplyStatus('all');
                    setSupplySort('used-desc');
                    setSupplyPage(1);
                    setMenuOpen(false);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-slate-400 border-b border-gray-100 dark:border-slate-700">
                <th className="px-5 py-3 font-medium">MÃ VẬT TƯ</th>
                <th className="px-5 py-3 font-medium">TÊN THUỐC / VẬT TƯ</th>
                <th className="px-5 py-3 font-medium">ĐƠN VỊ</th>
                <th className="px-5 py-3 font-medium text-right">TỒN KHO</th>
                <th className="px-5 py-3 font-medium text-right">ĐÃ SỬ DỤNG</th>
                <th className="px-5 py-3 font-medium text-center">TRẠNG THÁI</th>
                <th className="px-5 py-3 font-medium text-center">BIẾN ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {visibleSupplies.map((item) => {
                const status = SUPPLY_STATUS_LABELS[item.status];
                return (
                  <tr key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-700/30">
                    <td className="px-5 py-3 font-medium text-gray-700 dark:text-slate-200">
                      {item.code}
                    </td>
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
          {visibleSupplies.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-500">Không có vật tư phù hợp.</div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-slate-700">
          <span className="text-sm text-gray-500 dark:text-slate-400">
            Hiển thị {visibleSupplies.length} trên {filteredSupplies.length.toLocaleString('vi-VN')} vật tư
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={supplyPage <= 1}
              onClick={() => setSupplyPage((page) => Math.max(1, page - 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 hover:bg-gray-50 disabled:text-gray-300 dark:hover:bg-slate-700"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: supplyTotalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setSupplyPage(page)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                  page === supplyPage
                    ? 'bg-[#1a56db] text-white'
                    : 'border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={supplyPage >= supplyTotalPages}
              onClick={() => setSupplyPage((page) => Math.min(supplyTotalPages, page + 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 disabled:text-gray-300 dark:hover:bg-slate-700"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminReportsPage;
