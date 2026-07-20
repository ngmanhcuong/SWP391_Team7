import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card } from '../../components/ui';
import Button from '../../components/ui/Button';
import { useAdminReports } from '../../features/admin/hooks';
import { SUPPLY_STATUS_LABELS } from '../../features/admin/constants';
import type { SpecialtyShare, SupplyItem } from '../../features/admin/types';

type ReportPeriod = 'day' | 'week' | 'month' | 'year';

const PERIOD_OPTIONS: { id: ReportPeriod; label: string }[] = [
  { id: 'day', label: 'Ngày' },
  { id: 'week', label: 'Tuần' },
  { id: 'month', label: 'Tháng' },
  { id: 'year', label: 'Năm' },
];

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toMonthInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const formatPeriodDisplay = (period: ReportPeriod, anchorDate: string) => {
  const date = new Date(anchorDate);
  if (Number.isNaN(date.getTime())) return '';

  if (period === 'week') {
    const start = new Date(date);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`;
  }

  if (period === 'month') {
    return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  if (period === 'year') {
    return `Năm ${date.getFullYear()}`;
  }

  return date.toLocaleDateString('vi-VN');
};

const getTrendTitle = (period: ReportPeriod) => {
  if (period === 'day') return 'Biến động bệnh nhân theo giờ';
  if (period === 'week') return 'Biến động bệnh nhân trong tuần';
  if (period === 'month') return 'Biến động bệnh nhân trong tháng';
  return 'Biến động bệnh nhân trong năm';
};

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
  const gridValues = [
    maxValue,
    Math.round(maxValue * 0.75),
    Math.round(maxValue * 0.5),
    Math.round(maxValue * 0.25),
    0,
  ];
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
  const [period, setPeriod] = useState<ReportPeriod>('day');
  const [anchorDate, setAnchorDate] = useState('2026-07-20');

  const reportQuery = useMemo(() => ({ period, anchorDate }), [period, anchorDate]);
  const {
    stats,
    patientTrend,
    specialtyShare,
    specialtyTotal,
    supplies,
    suppliesTotal,
    generatedAt,
    rangeLabel,
    isLoading,
  } = useAdminReports(reportQuery);

  useEffect(() => {
    if (period === 'month' && !/^\d{4}-\d{2}$/.test(anchorDate)) {
      setAnchorDate(toMonthInputValue(new Date(anchorDate)));
      return;
    }

    if (period === 'year' && !/^\d{4}$/.test(anchorDate)) {
      setAnchorDate(String(new Date(anchorDate).getFullYear()));
      return;
    }

    if ((period === 'day' || period === 'week') && !/^\d{4}-\d{2}-\d{2}$/.test(anchorDate)) {
      setAnchorDate(toDateInputValue(new Date(anchorDate)));
    }
  }, [period, anchorDate]);

  const reportDate = useMemo(() => {
    return generatedAt
      ? new Date(generatedAt).toLocaleString('vi-VN')
      : new Date('2026-07-20T00:00:00+07:00').toLocaleString('vi-VN');
  }, [generatedAt]);

  const periodDisplay = useMemo(() => {
    return rangeLabel || formatPeriodDisplay(period, anchorDate);
  }, [anchorDate, period, rangeLabel]);

  const gradientStops = useMemo(() => {
    let acc = 0;
    return specialtyShare
      .map((item: SpecialtyShare) => {
        const start = acc;
        acc += item.percent;
        return `${item.color} ${start}% ${acc}%`;
      })
      .join(', ');
  }, [specialtyShare]);

  const exportRows = useMemo(
    () => [
      ['Loại báo cáo', PERIOD_OPTIONS.find((item) => item.id === period)?.label ?? period],
      ['Khoảng thời gian', periodDisplay],
      ['Ngày xuất', reportDate],
      [],
      ['Chỉ số', 'Giá trị'],
      ['Tổng bệnh nhân mới', stats[0]?.value ?? '0'],
      ['Doanh thu dịch vụ', stats[1]?.value ?? '0'],
      ['Vật tư đã tiêu hao', stats[2]?.value ?? '0'],
      ['Tỷ lệ hoàn thành khám', stats[3]?.value ?? '0'],
      [],
      ['Biểu đồ xu hướng', 'Số lượng'],
      ...patientTrend.map((item: { month: string; value: number }) => [item.month, item.value]),
      [],
      ['Chuyên khoa', 'Tỷ lệ'],
      ...specialtyShare.map((item: SpecialtyShare) => [item.name, `${item.percent}%`]),
      [],
      ['Mã vật tư', 'Tên vật tư', 'Đơn vị', 'Tồn kho', 'Đã sử dụng', 'Trạng thái'],
      ...supplies.map((item: SupplyItem) => [
        item.code,
        item.name,
        item.unit,
        item.stock,
        item.used,
        SUPPLY_STATUS_LABELS[item.status].label,
      ]),
    ],
    [patientTrend, period, periodDisplay, reportDate, specialtyShare, stats, supplies],
  );

  const handleExportExcel = () => {
    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(exportRows);
    worksheet['!cols'] = [
      { wch: 24 },
      { wch: 26 },
      { wch: 14 },
      { wch: 12 },
      { wch: 12 },
      { wch: 18 },
    ];
    utils.book_append_sheet(workbook, worksheet, 'BaoCao');
    writeFile(workbook, `BaoCao_MediCare_${period}_${anchorDate.replace(/[^0-9]/g, '')}.xlsx`);
  };

  const handleExportPdf = () => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('Bao cao & Thong ke chuyen sau - MediCare AI Clinic', 40, 42);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Loai bao cao: ${PERIOD_OPTIONS.find((item) => item.id === period)?.label ?? period}`, 40, 64);
    pdf.text(`Khoang thoi gian: ${periodDisplay}`, 40, 80);
    pdf.text(`Ngay xuat: ${reportDate}`, 40, 96);

    autoTable(pdf, {
      startY: 120,
      theme: 'grid',
      head: [['Chỉ số', 'Giá trị']],
      body: [
        ['Tổng bệnh nhân mới', stats[0]?.value ?? '0'],
        ['Doanh thu dịch vụ', stats[1]?.value ?? '0'],
        ['Vật tư đã tiêu hao', stats[2]?.value ?? '0'],
        ['Tỷ lệ hoàn thành khám', stats[3]?.value ?? '0'],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [26, 86, 219] },
    });

    autoTable(pdf, {
      startY: (pdf as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY
        ? ((pdf as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 140) + 18
        : 220,
      theme: 'striped',
      head: [['Mốc', 'Số lượng bệnh nhân mới']],
      body: patientTrend.map((item: { month: string; value: number }) => [item.month, String(item.value)]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [16, 185, 129] },
    });

    autoTable(pdf, {
      startY: (pdf as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY
        ? ((pdf as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 300) + 18
        : 360,
      theme: 'striped',
      head: [['Chuyên khoa', 'Tỷ lệ']],
      body: specialtyShare.map((item: SpecialtyShare) => [item.name, `${item.percent}%`]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [245, 158, 11] },
    });

    pdf.save(`BaoCao_MediCare_${period}_${anchorDate.replace(/[^0-9]/g, '')}.pdf`);
  };

  const renderPeriodControl = () => {
    if (period === 'month') {
      return (
        <input
          type="month"
          value={anchorDate}
          onChange={(event) => setAnchorDate(event.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      );
    }

    if (period === 'year') {
      return (
        <input
          type="number"
          min={2020}
          max={2035}
          value={anchorDate}
          onChange={(event) => setAnchorDate(event.target.value)}
          className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      );
    }

    return (
      <input
        type="date"
        value={anchorDate}
        onChange={(event) => setAnchorDate(event.target.value)}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <nav className="mb-1 text-xs text-gray-400">
            Báo cáo <span className="mx-1">/</span> Thống kê chuyên sâu
          </nav>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Lexend' }}>
            Báo cáo &amp; Thống kê chuyên sâu
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" leftIcon={<FileSpreadsheet size={16} />} onClick={handleExportExcel}>
            Xuất Excel
          </Button>
          <Button variant="danger" leftIcon={<FileText size={16} />} onClick={handleExportPdf}>
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* ── Filter toolbar ── */}
      <Card padding="none">
        <div className="flex flex-wrap items-center gap-4 px-5 py-3">
          <div className="flex rounded-lg bg-gray-100 p-1">
            {PERIOD_OPTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => setPeriod(item.id)}
                className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-all ${
                  period === item.id
                    ? 'bg-[#1a56db] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-200" />

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays size={16} className="text-gray-400" />
            {renderPeriodControl()}
          </div>

          <div className="h-6 w-px bg-gray-200 hidden sm:block" />

          <span className="hidden text-sm font-medium text-gray-500 sm:inline">
            <span className="text-gray-400">Kỳ báo cáo:</span>{' '}
            <span className="text-gray-700">{periodDisplay}</span>
          </span>
        </div>
      </Card>

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
                    <TrendArrow trend={trend} />
                    {stat.delta}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-500">{stat.label}</p>
              <p className="mt-0.5 text-2xl font-bold">{isLoading ? '...' : stat.value}</p>
              {stat.progress !== undefined && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
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
            <div>
              <h2 className="font-semibold" style={{ fontFamily: 'Lexend' }}>
                {getTrendTitle(period)}
              </h2>
              <p className="mt-1 text-xs text-gray-500">Cập nhật lúc {reportDate}</p>
            </div>
            <span className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-500">{periodDisplay}</span>
          </div>
          <PatientTrendChart data={patientTrend} />
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold" style={{ fontFamily: 'Lexend' }}>
            Tỷ lệ theo chuyên khoa
          </h2>
          <div className="relative mx-auto my-6 flex items-center justify-center" style={{ width: 160, height: 160 }}>
            <div
              className="absolute rotate-45 rounded-2xl"
              style={{
                width: 112,
                height: 112,
                background: `conic-gradient(from 0deg, ${gradientStops || '#cbd5e1 0% 100%'})`,
              }}
            />
            <div
              className="absolute rotate-45 rounded-xl bg-white"
              style={{ width: 84, height: 84 }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{specialtyTotal}</span>
              <span className="text-xs text-gray-500">Tổng cộng</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {specialtyShare.map((item: SpecialtyShare) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-gray-600">
                  {item.name} ({item.percent}%)
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="font-semibold" style={{ fontFamily: 'Lexend' }}>
              Tình hình sử dụng thuốc &amp; vật tư
            </h2>
            <p className="mt-1 text-xs text-gray-500">Tổng số vật tư ghi nhận: {suppliesTotal.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        {supplies.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-gray-500">
            Chưa có dữ liệu kho vật tư thực tế trong khoảng thời gian này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-5 py-3 font-medium">Mã vật tư</th>
                  <th className="px-5 py-3 font-medium">Tên thuốc / vật tư</th>
                  <th className="px-5 py-3 font-medium">Đơn vị</th>
                  <th className="px-5 py-3 text-right font-medium">Tồn kho</th>
                  <th className="px-5 py-3 text-right font-medium">Đã sử dụng</th>
                  <th className="px-5 py-3 text-center font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {supplies.map((item: SupplyItem) => {
                  const status = SUPPLY_STATUS_LABELS[item.status];
                  return (
                    <tr key={item.id}>
                      <td className="px-5 py-4 font-medium text-[#1a56db]">{item.code}</td>
                      <td className="px-5 py-4">{item.name}</td>
                      <td className="px-5 py-4 text-gray-500">{item.unit}</td>
                      <td className="px-5 py-4 text-right">{item.stock.toLocaleString('vi-VN')}</td>
                      <td className="px-5 py-4 text-right">{item.used.toLocaleString('vi-VN')}</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminReportsPage;
