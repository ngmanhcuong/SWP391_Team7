import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  ListFilter,
  MoreHorizontal,
} from 'lucide-react';
import { Card } from '../../components/ui';
import Button from '../../components/ui/Button';
import { useAdminReports } from '../../features/admin/hooks';
import { SUPPLY_STATUS_LABELS } from '../../features/admin/constants';

const PERIODS = ['Ngày', 'Tuần', 'Tháng', 'Năm'] as const;
type ReportPeriod = (typeof PERIODS)[number];

const formatDate = (date: Date) =>
  date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const getPeriodRange = (period: ReportPeriod) => {
  const end = new Date();
  const start = new Date(end);

  if (period === 'Ngày') {
    return formatDate(end);
  }

  if (period === 'Tuần') {
    start.setDate(end.getDate() - 6);
  } else if (period === 'Tháng') {
    start.setMonth(end.getMonth() - 1);
  } else {
    start.setFullYear(end.getFullYear() - 1);
  }

  return `${formatDate(start)} - ${formatDate(end)}`;
};

const getReportFileName = (period: ReportPeriod, extension: string) => {
  const safeDate = new Date().toISOString().slice(0, 10);
  return `bao-cao-admin-${period.toLowerCase()}-${safeDate}.${extension}`;
};

const escapeHtml = (value: string | number) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const PatientTrendChart: React.FC<{ data: { month: string; value: number }[] }> = ({ data }) => {
  const width = 560;
  const height = 230;
  const padX = 36;
  const padY = 20;
  const maxValue = 5000;
  const minValue = 1000;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = data.map((point, index) => {
    const x = padX + (innerW * index) / (data.length - 1);
    const y = padY + innerH * (1 - (point.value - minValue) / (maxValue - minValue));
    return { ...point, x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padY + innerH} L ${points[0].x} ${padY + innerH} Z`;
  const gridValues = [5000, 4000, 3000, 2000, 1000];
  const highlight = points[3];

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
  const [period, setPeriod] = useState<ReportPeriod>('Ngày');
  const reportRange = useMemo(() => getPeriodRange(period), [period]);

  const reportHtml = useMemo(() => {
    const statRows = stats
      .map(
        (stat) =>
          `<tr><td>${escapeHtml(stat.label)}</td><td>${escapeHtml(stat.value)}</td><td>${escapeHtml(
            stat.delta ?? '-',
          )}</td></tr>`,
      )
      .join('');
    const trendRows = patientTrend
      .map((item) => `<tr><td>${escapeHtml(item.month)}</td><td>${escapeHtml(item.value)}</td></tr>`)
      .join('');
    const specialtyRows = specialtyShare
      .map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.percent)}%</td></tr>`)
      .join('');
    const supplyRows = supplies
      .map((item) => {
        const status = SUPPLY_STATUS_LABELS[item.status];
        return `<tr><td>${escapeHtml(item.code)}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(
          item.unit,
        )}</td><td>${escapeHtml(item.stock)}</td><td>${escapeHtml(item.used)}</td><td>${escapeHtml(
          status.label,
        )}</td></tr>`;
      })
      .join('');

    return `
      <h1>Báo cáo & Thống kê chuyên sâu</h1>
      <p>Kỳ báo cáo: ${escapeHtml(period)} | ${escapeHtml(reportRange)}</p>
      <h2>Chỉ số tổng quan</h2>
      <table><thead><tr><th>Chỉ số</th><th>Giá trị</th><th>Biến động</th></tr></thead><tbody>${statRows}</tbody></table>
      <h2>Lượng bệnh nhân theo tháng</h2>
      <table><thead><tr><th>Tháng</th><th>Số bệnh nhân</th></tr></thead><tbody>${trendRows}</tbody></table>
      <h2>Tỷ lệ theo chuyên khoa (${escapeHtml(specialtyTotal)} tổng cộng)</h2>
      <table><thead><tr><th>Chuyên khoa</th><th>Tỷ lệ</th></tr></thead><tbody>${specialtyRows}</tbody></table>
      <h2>Tình hình thuốc & vật tư (${escapeHtml(supplies.length)} / ${escapeHtml(suppliesTotal)})</h2>
      <table><thead><tr><th>Mã vật tư</th><th>Tên thuốc / vật tư</th><th>Đơn vị</th><th>Tồn kho</th><th>Đã sử dụng</th><th>Trạng thái</th></tr></thead><tbody>${supplyRows}</tbody></table>
    `;
  }, [patientTrend, period, reportRange, specialtyShare, specialtyTotal, stats, supplies, suppliesTotal]);

  const handleExportExcel = () => {
    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta charset="UTF-8" /></head>
        <body>${reportHtml}</body>
      </html>
    `;
    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getReportFileName(period, 'xls');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    const printWindow = window.open('', '_blank', 'width=960,height=720');
    if (!printWindow) return;

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${escapeHtml(getReportFileName(period, 'pdf'))}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
            h1 { color: #1a56db; margin-bottom: 4px; }
            h2 { margin-top: 24px; font-size: 18px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
            th { background: #eef2ff; text-align: left; }
            th, td { border: 1px solid #d1d5db; padding: 8px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>${reportHtml}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

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
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg bg-gray-100 dark:bg-slate-700 p-1">
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
            {reportRange}
          </span>
          <Button variant="primary" leftIcon={<FileSpreadsheet size={16} />} onClick={handleExportExcel}>
            Xuất Excel
          </Button>
          <Button variant="danger" leftIcon={<FileText size={16} />} onClick={handleExportPdf}>
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
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
              Lượng bệnh nhân theo tháng
            </h2>
            <span className="rounded-lg border border-gray-200 dark:border-slate-600 px-3 py-1 text-xs text-gray-500 dark:text-slate-300">
              Năm 2023
            </span>
          </div>
          <PatientTrendChart data={patientTrend} />
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
          <div className="flex items-center gap-3 text-gray-400">
            <button className="hover:text-gray-600">
              <ListFilter size={18} />
            </button>
            <button className="hover:text-gray-600">
              <MoreHorizontal size={18} />
            </button>
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
              {supplies.map((item) => {
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
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-slate-700">
          <span className="text-sm text-gray-500 dark:text-slate-400">
            Hiển thị {supplies.length} trên {suppliesTotal.toLocaleString('vi-VN')} vật tư
          </span>
          <div className="flex items-center gap-1">
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700">
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                  page === 1
                    ? 'bg-[#1a56db] text-white'
                    : 'border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminReportsPage;
