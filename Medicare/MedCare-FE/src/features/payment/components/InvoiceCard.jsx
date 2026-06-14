import { formatCurrency } from '../../../utils/formatDate';
import { Badge, Button, Card } from '../../../components/ui';
import {
  INVOICE_STATUS,
  INVOICE_STATUS_LABEL,
  INVOICE_STATUS_VARIANT,
} from '../constants/paymentStatus';

const InvoiceCard = ({ invoice, onPayOnline }) => {
  const canPayOnline = invoice.status === INVOICE_STATUS.UNPAID;

  return (
    <Card padding="md" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-500">Mã hóa đơn · {invoice.id}</p>
          <h3 className="mt-1 text-base font-semibold text-gray-900" style={{ fontFamily: 'Lexend' }}>
            {invoice.service}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {invoice.doctor} · Khám ngày {invoice.examDate}
          </p>
        </div>
        <Badge variant={INVOICE_STATUS_VARIANT[invoice.status]}>
          {INVOICE_STATUS_LABEL[invoice.status]}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3">
        <div>
          <p className="text-xs text-gray-500">Tổng thanh toán</p>
          <p className="text-xl font-bold text-blue-700" style={{ fontFamily: 'Lexend' }}>
            {formatCurrency(invoice.amount)}
          </p>
        </div>
        {invoice.paymentMethod && (
          <p className="text-sm text-gray-600">
            {invoice.paymentMethod}
            {invoice.paidAt ? ` · ${invoice.paidAt}` : ''}
          </p>
        )}
      </div>

      <p className="text-sm text-gray-600">{invoice.note}</p>

      {canPayOnline && (
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => onPayOnline(invoice.id)}>Thanh toán trên app</Button>
          <Button variant="outline">Thanh toán tại quầy lễ tân</Button>
        </div>
      )}

      {invoice.status === INVOICE_STATUS.PENDING_CONFIRMATION && (
        <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Thanh toán đã gửi. Vui lòng chờ lễ tân xác nhận — sau khi xác nhận bạn mới có thể thực hiện
          các bước tiếp theo (nhận đơn thuốc, đặt lịch tái khám…).
        </p>
      )}
    </Card>
  );
};

export default InvoiceCard;
