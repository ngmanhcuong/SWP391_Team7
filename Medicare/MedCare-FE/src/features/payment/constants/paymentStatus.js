export const INVOICE_STATUS = {
  UNPAID: 'UNPAID',
  PENDING_CONFIRMATION: 'PENDING_CONFIRMATION',
  PAID: 'PAID',
};

export const INVOICE_STATUS_LABEL = {
  [INVOICE_STATUS.UNPAID]: 'Chưa thanh toán',
  [INVOICE_STATUS.PENDING_CONFIRMATION]: 'Chờ lễ tân xác nhận',
  [INVOICE_STATUS.PAID]: 'Đã thanh toán',
};

export const INVOICE_STATUS_VARIANT = {
  [INVOICE_STATUS.UNPAID]: 'warning',
  [INVOICE_STATUS.PENDING_CONFIRMATION]: 'primary',
  [INVOICE_STATUS.PAID]: 'success',
};

/** Các nghiệp vụ chỉ mở sau khi hóa đơn đã được lễ tân xác nhận thanh toán */
export const POST_PAYMENT_ACTIONS = [
  'Nhận đơn thuốc / kết quả khám',
  'Đặt lịch tái khám',
  'Tải báo cáo sức khỏe chi tiết',
  'Đánh giá dịch vụ',
];
