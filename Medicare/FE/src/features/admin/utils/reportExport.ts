export interface ReportTable {
  title: string;
  headers: string[];
  rows: Array<Array<string | number>>;
}

interface ReportOptions {
  title: string;
  filePrefix: string;
  tables: ReportTable[];
  rangeLabel?: string;
}

const escapeHtml = (value: string | number) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const getFileName = (prefix: string, extension: string) =>
  `${prefix}-${new Date().toISOString().slice(0, 10)}.${extension}`;

const buildHtml = ({ title, rangeLabel, tables }: ReportOptions) => `
  <h1>${escapeHtml(title)}</h1>
  ${rangeLabel ? `<p>Thời gian: ${escapeHtml(rangeLabel)}</p>` : ''}
  ${tables
    .map(
      (table) => `
        <h2>${escapeHtml(table.title)}</h2>
        <table>
          <thead><tr>${table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>
          <tbody>
            ${table.rows
              .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
              .join('')}
          </tbody>
        </table>
      `,
    )
    .join('')}
`;

export const exportReportToExcel = (options: ReportOptions) => {
  const html = `<html><head><meta charset="UTF-8" /></head><body>${buildHtml(options)}</body></html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = getFileName(options.filePrefix, 'xls');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportReportToPdf = (options: ReportOptions) => {
  const printWindow = window.open('', '_blank', 'width=960,height=720');
  if (!printWindow) return;

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(getFileName(options.filePrefix, 'pdf'))}</title>
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
      <body>${buildHtml(options)}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};
