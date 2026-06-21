import {
  LabResult,
  MedicalHistoryItem,
  PatientHealthRecordsData,
  PrescriptionRecord,
  VisitRecord,
} from '../types';

interface ExportHealthRecordsParams {
  patientName: string;
  recordCode: string;
  updatedAt: string;
  visits: VisitRecord[];
  prescriptions: PrescriptionRecord[];
  labResults: LabResult[];
  medicalHistory: MedicalHistoryItem[];
  patientSummary: {
    bloodType?: string;
    height?: string;
    weight?: string;
    lastCheckup?: string;
  };
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const LAB_STATUS_LABEL: Record<LabResult['status'], string> = {
  normal: 'Bình thường',
  abnormal: 'Bất thường',
  pending: 'Đang chờ',
};

const HISTORY_TYPE_LABEL: Record<MedicalHistoryItem['type'], string> = {
  allergy: 'Dị ứng',
  chronic: 'Bệnh mãn tính',
  surgery: 'Phẫu thuật',
  family: 'Tiền sử gia đình',
};

const buildHtml = (params: ExportHealthRecordsParams): string => {
  const {
    patientName,
    recordCode,
    updatedAt,
    visits,
    prescriptions,
    labResults,
    medicalHistory,
    patientSummary,
  } = params;

  const printedAt = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

  const summaryRows = [
    ['Nhóm máu', patientSummary.bloodType],
    ['Chiều cao', patientSummary.height],
    ['Cân nặng', patientSummary.weight],
    ['Khám gần nhất', patientSummary.lastCheckup],
  ]
    .filter(([, value]) => Boolean(value))
    .map(
      ([label, value]) =>
        `<tr><td class="k">${escapeHtml(label as string)}</td><td>${escapeHtml(
          value as string,
        )}</td></tr>`,
    )
    .join('');

  const visitsHtml = visits.length
    ? visits
        .map(
          (visit) => `
        <div class="item">
          <div class="item-head">
            <strong>${escapeHtml(visit.specialty)} — ${escapeHtml(visit.doctorName)}</strong>
            <span class="muted">${escapeHtml(visit.date)}</span>
          </div>
          <div class="muted">${escapeHtml(visit.facility)}</div>
          <div><span class="k">Chẩn đoán:</span> ${escapeHtml(visit.diagnosis)}</div>
          <div><span class="k">Triệu chứng:</span> ${escapeHtml(visit.symptoms)}</div>
          <div><span class="k">Điều trị:</span> ${escapeHtml(visit.treatment)}</div>
        </div>`,
        )
        .join('')
    : '<div class="muted">Không có dữ liệu.</div>';

  const prescriptionsHtml = prescriptions.length
    ? `<table class="grid">
        <thead><tr><th>Thuốc</th><th>Liều dùng</th><th>Bác sĩ</th><th>Thời gian</th><th>Trạng thái</th></tr></thead>
        <tbody>
        ${prescriptions
          .map(
            (rx) => `<tr>
              <td>${escapeHtml(rx.name)}</td>
              <td>${escapeHtml(rx.dosage)}</td>
              <td>${escapeHtml(rx.doctorName)}</td>
              <td>${escapeHtml(rx.duration)}</td>
              <td>${rx.status === 'active' ? 'Đang dùng' : 'Hoàn tất'}</td>
            </tr>`,
          )
          .join('')}
        </tbody>
      </table>`
    : '<div class="muted">Không có dữ liệu.</div>';

  const labsHtml = labResults.length
    ? `<table class="grid">
        <thead><tr><th>Xét nghiệm</th><th>Ngày</th><th>Bác sĩ</th><th>Kết quả</th><th>Trạng thái</th></tr></thead>
        <tbody>
        ${labResults
          .map(
            (lab) => `<tr>
              <td>${escapeHtml(lab.name)}</td>
              <td>${escapeHtml(lab.date)}</td>
              <td>${escapeHtml(lab.doctorName)}</td>
              <td>${escapeHtml(lab.summary)}</td>
              <td>${LAB_STATUS_LABEL[lab.status]}</td>
            </tr>`,
          )
          .join('')}
        </tbody>
      </table>`
    : '<div class="muted">Không có dữ liệu.</div>';

  const historyHtml = medicalHistory.length
    ? medicalHistory
        .map(
          (item) => `
        <div class="item">
          <div class="item-head">
            <strong>${escapeHtml(item.label)}</strong>
            <span class="tag">${HISTORY_TYPE_LABEL[item.type]}</span>
          </div>
          <div class="muted">${escapeHtml(item.detail)}${
            item.since ? ` · Từ ${escapeHtml(item.since)}` : ''
          }</div>
        </div>`,
        )
        .join('')
    : '<div class="muted">Không có dữ liệu.</div>';

  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<title>Ho so benh an - ${escapeHtml(patientName)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 32px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; }
  .brand { font-size: 20px; font-weight: 800; color: #2563eb; }
  .brand small { display: block; font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: #64748b; }
  .meta { text-align: right; font-size: 12px; color: #64748b; line-height: 1.6; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: .05em; color: #2563eb; margin: 28px 0 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
  .muted { color: #64748b; font-size: 13px; }
  .k { color: #475569; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.kv td { padding: 4px 8px; border: none; }
  table.kv td.k { width: 140px; }
  table.grid th, table.grid td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
  table.grid th { background: #f1f5f9; font-size: 12px; text-transform: uppercase; letter-spacing: .03em; color: #475569; }
  .item { padding: 10px 0; border-bottom: 1px solid #eef2f7; font-size: 13px; line-height: 1.6; }
  .item-head { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 2px; }
  .tag { font-size: 11px; background: #eff6ff; color: #2563eb; padding: 2px 8px; border-radius: 999px; }
  .footer { margin-top: 36px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">MediCare AI<small>Clinic Management</small></div>
    <div class="meta">
      Mã hồ sơ: <strong>${escapeHtml(recordCode)}</strong><br/>
      Cập nhật: ${escapeHtml(updatedAt)}<br/>
      Xuất ngày: ${escapeHtml(printedAt)}
    </div>
  </div>

  <h1>Hồ sơ bệnh án</h1>
  <div class="muted">Bệnh nhân: <strong style="color:#0f172a">${escapeHtml(patientName)}</strong></div>

  <h2>Thông tin sức khỏe</h2>
  <table class="kv">${summaryRows || '<tr><td class="muted">Không có dữ liệu.</td></tr>'}</table>

  <h2>Lịch sử khám (${visits.length})</h2>
  ${visitsHtml}

  <h2>Đơn thuốc (${prescriptions.length})</h2>
  ${prescriptionsHtml}

  <h2>Kết quả xét nghiệm (${labResults.length})</h2>
  ${labsHtml}

  <h2>Tiền sử bệnh (${medicalHistory.length})</h2>
  ${historyHtml}

  <div class="footer">Tài liệu được tạo từ hệ thống MediCare AI Clinic Management. Vui lòng tham khảo ý kiến bác sĩ trước khi sử dụng.</div>
</body>
</html>`;
};

export const exportHealthRecordsPdf = (params: ExportHealthRecordsParams): void => {
  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Vui lòng cho phép cửa sổ bật lên (pop-up) để tải hồ sơ PDF.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(buildHtml(params));
  printWindow.document.close();
  printWindow.focus();

  // Wait for the new document to render before invoking the print dialog.
  setTimeout(() => {
    printWindow.print();
  }, 350);
};
