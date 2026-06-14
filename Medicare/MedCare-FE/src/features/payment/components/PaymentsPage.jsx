import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../components/ui';
import { MOCK_INVOICES } from '../constants/mockInvoices';
import { INVOICE_STATUS, POST_PAYMENT_ACTIONS } from '../constants/paymentStatus';
import InvoiceCard from './InvoiceCard';

const PaymentsPage = () => {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);

  const hasBlockingInvoice = useMemo(
    () => invoices.some((inv) => inv.status !== INVOICE_STATUS.PAID),
    [invoices],
  );

  const handlePayOnline = (invoiceId) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: INVOICE_STATUS.PENDING_CONFIRMATION,
              paymentMethod: 'Chuyển khoản qua app',
              paidAt: new Date().toLocaleString('vi-VN'),
              note: 'Bạn đã thanh toán online. Lễ tân sẽ xác nhận trong thời gian sớm nhất.',
            }
          : inv,
      ),
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Lexend' }}>
          Thanh toán
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Hóa đơn chỉ phát sinh sau khi bạn khám xong. Thanh toán tại quầy hoặc trên app — lễ tân xác
          nhận xong mới mở các nghiệp vụ tiếp theo.
        </p>
      </div>

      <Card padding="md" className="border-blue-100 bg-blue-50/60">
        <div className="flex gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div className="space-y-2 text-sm text-blue-900">
            <p className="font-semibold">Quy trình thanh toán</p>
            <ol className="list-decimal space-y-1 pl-4 text-blue-800">
              <li>Khám bệnh xong → hệ thống tạo hóa đơn</li>
              <li>Bệnh nhân thanh toán trực tiếp tại quầy hoặc trên app</li>
              <li>Lễ tân xác nhận thanh toán</li>
              <li>Mới thực hiện được các bước tiếp theo</li>
            </ol>
          </div>
        </div>
      </Card>

      {hasBlockingInvoice && (
        <Card padding="md" className="border-amber-100 bg-amber-50">
          <p className="text-sm font-medium text-amber-900">
            Các nghiệp vụ sau sẽ khóa cho đến khi hóa đơn được lễ tân xác nhận đã thanh toán:
          </p>
          <ul className="mt-3 space-y-2">
            {POST_PAYMENT_ACTIONS.map((action) => (
              <li key={action} className="flex items-center gap-2 text-sm text-amber-800">
                <CheckCircle2 className="h-4 w-4 shrink-0 opacity-50" />
                {action}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="space-y-4">
        {invoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} onPayOnline={handlePayOnline} />
        ))}
      </div>
    </div>
  );
};

export default PaymentsPage;
