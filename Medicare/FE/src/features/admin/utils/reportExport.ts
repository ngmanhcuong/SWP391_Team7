export type AdminReportPeriod = 'Ngày' | 'Tuần' | 'Tháng' | 'Năm';

export const ADMIN_REPORT_PERIODS: AdminReportPeriod[] = ['Ngày', 'Tuần', 'Tháng', 'Năm'];

export interface ReportTable {
  title: string;
  headers: string[];
  rows: Array<Array<string | number>>;
}

export interface ReportExportOptions {
  title: string;
  period: AdminReportPeriod;
  rangeLabel: string;
  filePrefix: string;
  tables: ReportTable[];
}

const formatDate = (date: Date) =>
  date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const getPeriodRangeLabel = (period: AdminReportPeriod) => {
  const end = new Date();
  const start = new Date(end);

  if (period === 'Ngày') return formatDate(end);
  if (period === 'Tuần') start.setDate(end.getDate() - 6);
  if (period === 'Tháng') start.setMonth(end.getMonth() - 1);
  if (period === 'Năm') start.setFullYear(end.getFullYear() - 1);

  return `${formatDate(start)} - ${formatDate(end)}`;
};

export const getPeriodCaption = (period: AdminReportPeriod) => {
  if (period === 'Ngày') return 'Hôm nay';
  if (period === 'Tuần') return '7 ngày gần nhất';
  if (period === 'Tháng') return '30 ngày gần nhất';
  return '12 tháng gần nhất';
};

export const parseVietnameseDate = (value: string) => {
  const match = value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return null;
  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const isWithinReportPeriod = (dateValue: string, period: AdminReportPeriod, referenceDate: Date) => {
  const date = parseVietnameseDate(dateValue);
  if (!date) return true;

  const current = startOfDay(date).getTime();
  const end = startOfDay(referenceDate);
  const start = new Date(end);

  if (period === 'Ngày') {
    return current === end.getTime();
  }
  if (period === 'Tuần') {
    start.setDate(end.getDate() - 6);
  } else if (period === 'Tháng') {
    start.setMonth(end.getMonth() - 1);
  } else {
    start.setFullYear(end.getFullYear() - 1);
  }

  return current >= start.getTime() && current <= end.getTime();
};

export const getLatestReportDate = (dateValues: string[]) => {
  const dates = dateValues
    .map(parseVietnameseDate)
    .filter((date): date is Date => Boolean(date));
  return dates.length > 0 ? new Date(Math.max(...dates.map((date) => date.getTime()))) : new Date();
};

export const escapeHtml = (value: string | number) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const buildReportHtml = ({ title, period, rangeLabel, tables }: ReportExportOptions) => {
  const tableHtml = tables
    .map(
      (table) => `
        <h2>${escapeHtml(table.title)}</h2>
        <table>
          <thead>
            <tr>${table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${table.rows
              .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
              .join('')}
          </tbody>
        </table>
      `,
    )
    .join('');

  return `
    <h1>${escapeHtml(title)}</h1>
    <p>Kỳ báo cáo: ${escapeHtml(period)} (${escapeHtml(getPeriodCaption(period))})</p>
    <p>Thời gian: ${escapeHtml(rangeLabel)}</p>
    ${tableHtml}
  `;
};

const getFileName = (filePrefix: string, period: AdminReportPeriod, extension: string) => {
  const safeDate = new Date().toISOString().slice(0, 10);
  return `${filePrefix}-${period.toLowerCase()}-${safeDate}.${extension}`;
};

export const exportReportToExcel = (options: ReportExportOptions) => {
  const excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8" /></head>
      <body>${buildReportHtml(options)}</body>
    </html>
  `;
  const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = getFileName(options.filePrefix, options.period, 'xls');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportReportToPdf = (options: ReportExportOptions) => {
  const printWindow = window.open('', '_blank', 'width=960,height=720');
  if (!printWindow) return;

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(getFileName(options.filePrefix, options.period, 'pdf'))}</title>
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
      <body>${buildReportHtml(options)}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};
