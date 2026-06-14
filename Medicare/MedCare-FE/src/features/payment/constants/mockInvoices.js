import { INVOICE_STATUS } from './paymentStatus';

export const MOCK_INVOICES = [
  {
    id: 'INV-2023-1012',
    examDate: '12/10/2023',
    service: 'Khám nội tổng quát + xét nghiệm máu',
    doctor: 'BS. Nguyễn Văn Tuấn',
    amount: 850000,
    status: INVOICE_STATUS.UNPAID,
    note: 'Hóa đơn phát sinh sau khi khám xong. Vui lòng thanh toán tại quầy hoặc trên app.',
  },
  {
    id: 'INV-2023-1005',
    examDate: '05/10/2023',
    service: 'Tái khám tim mạch',
    doctor: 'BS. Trần Thị Lan',
    amount: 350000,
    status: INVOICE_STATUS.PENDING_CONFIRMATION,
    paidAt: '05/10/2023 16:20',
    paymentMethod: 'Chuyển khoản qua app',
    note: 'Bạn đã thanh toán online. Lễ tân sẽ xác nhận trong thời gian sớm nhất.',
  },
];

export const getUnpaidSummary = (invoices = MOCK_INVOICES) => {
  const unpaid = invoices.filter((inv) => inv.status === INVOICE_STATUS.UNPAID);
  const pending = invoices.filter((inv) => inv.status === INVOICE_STATUS.PENDING_CONFIRMATION);
  const totalUnpaid = unpaid.reduce((sum, inv) => sum + inv.amount, 0);

  return {
    unpaidCount: unpaid.length,
    pendingCount: pending.length,
    totalUnpaid,
  };
};
