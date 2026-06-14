import React, { useState } from 'react';
import {
  Building2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Smartphone,
  Stethoscope,
} from 'lucide-react';
import { Spinner } from '../../../components/ui';
import { formatCurrencyVnd } from '../constants/consultationFees';
import { DepositPaymentMethod, PaymentInvoice } from '../types';

interface PaymentInvoiceCardProps {
  invoice: PaymentInvoice;
  isPaying: boolean;
  onPay: (invoiceId: string, method: DepositPaymentMethod) => void;
}

const STATUS_CONFIG: Record<
  PaymentInvoice['status'],
  { label: string; className: string }
> = {
  awaiting_visit: {
    label: 'Đã cọc · Chờ khám',
    className: 'bg-[rgba(0,82,204,0.1)] text-[#003d9b]',
  },
  pending_payment: {
    label: 'Chưa thanh toán',
    className: 'bg-[rgba(255,218,214,0.3)] text-[#ba1a1a]',
  },
  paid: {
    label: 'Đã thanh toán',
    className: 'bg-[rgba(130,249,190,0.2)] text-[#006c47]',
  },
};

const PAYMENT_METHOD_LABELS: Record<DepositPaymentMethod, string> = {
  vnpay: 'VNPay',
  momo: 'MoMo',
  banking: 'Chuyển khoản',
};

const PAYMENT_METHODS: { id: DepositPaymentMethod; label: string; icon: React.ReactNode }[] = [
  { id: 'vnpay', label: 'VNPay', icon: <CreditCard size={16} className="text-[#003d9b]" /> },
  { id: 'momo', label: 'MoMo', icon: <Smartphone size={16} className="text-[#a50064]" /> },
  { id: 'banking', label: 'Chuyển khoản', icon: <Building2 size={16} className="text-[#006c47]" /> },
];

const PaymentInvoiceCard: React.FC<PaymentInvoiceCardProps> = ({
  invoice,
  isPaying,
  onPay,
}) => {
  const [expanded, setExpanded] = useState(invoice.status === 'pending_payment');
  const [paymentMethod, setPaymentMethod] = useState<DepositPaymentMethod | null>('vnpay');
  const status = STATUS_CONFIG[invoice.status];
  const chargeItems = invoice.lineItems.filter((item) => item.type === 'charge');

  return (
    <article
      className={`bg-white border rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden transition-all duration-200 hover:shadow-md ${
        invoice.status === 'pending_payment'
          ? 'border-rose-200/80 ring-1 ring-rose-100'
          : 'border-[#c3c6d6]/60'
      }`}
    >
      <div className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 min-w-0 border-l-4 border-[#003d9b] pl-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-[#003d9b] bg-[#003d9b]/10 px-2.5 py-1 rounded">
                {invoice.invoiceCode}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded ${status.className}`}>
                {status.label}
              </span>
            </div>
            <h3 className="text-base font-semibold text-[#191c1e]">
              Khám {invoice.specialtyName} · {invoice.visitDate}
            </h3>
            <p className="text-sm text-[#434654] inline-flex items-center gap-1.5">
              <Stethoscope size={14} className="text-[#003d9b]" />
              {invoice.doctorName}
            </p>
          </div>

          <div className="text-right shrink-0">
            {invoice.status === 'awaiting_visit' ? (
              <>
                <p className="text-xs text-[#737685]">Đã cọc</p>
                <p className="text-lg font-semibold text-[#006c47]">
                  {formatCurrencyVnd(invoice.depositAmount)}
                </p>
                {invoice.estimatedRemaining != null && invoice.estimatedRemaining > 0 && (
                  <p className="text-xs text-[#434654] mt-1">
                    Ước tính còn {formatCurrencyVnd(invoice.estimatedRemaining)} sau khám
                  </p>
                )}
              </>
            ) : invoice.status === 'pending_payment' ? (
              <>
                <p className="text-xs text-[#737685]">Còn phải trả</p>
                <p className="text-lg font-semibold text-[#ba1a1a]">
                  {formatCurrencyVnd(invoice.totalDue)}
                </p>
                {invoice.dueDate && (
                  <p className="text-xs text-[#7a4f01] mt-1">Hạn: {invoice.dueDate}</p>
                )}
              </>
            ) : (
              <>
                <p className="text-xs text-[#737685]">Đã thanh toán</p>
                <p className="text-lg font-semibold text-[#006c47]">
                  {formatCurrencyVnd(invoice.subtotal - invoice.depositAmount)}
                </p>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#003d9b] hover:underline"
        >
          {expanded ? (
            <>
              Thu gọn chi tiết
              <ChevronUp size={16} />
            </>
          ) : (
            <>
              Xem chi tiết hóa đơn
              <ChevronDown size={16} />
            </>
          )}
        </button>

        {expanded && (
          <div className="mt-5 pt-5 border-t border-[#c3c6d6] space-y-4">
            <div className="rounded-lg border border-[#c3c6d6] overflow-hidden">
              <div className="bg-[#f8f9fb] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#737685]">
                Chi tiết chi phí
              </div>
              <div className="divide-y divide-[#c3c6d6]">
                {chargeItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-[#434654]">{item.label}</span>
                    <span className="font-medium text-[#191c1e]">{formatCurrencyVnd(item.amount)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 text-sm bg-[#f8f9fb]">
                  <span className="font-medium text-[#191c1e]">Tạm tính dịch vụ</span>
                  <span className="font-semibold text-[#191c1e]">{formatCurrencyVnd(invoice.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-[#006c47]">
                    Tiền cọc đã thanh toán
                    {invoice.depositPaymentMethod && (
                      <span className="text-[#737685] ml-1">
                        ({PAYMENT_METHOD_LABELS[invoice.depositPaymentMethod]})
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-[#006c47]">
                    −{formatCurrencyVnd(invoice.depositAmount)}
                  </span>
                </div>
                {invoice.status !== 'awaiting_visit' && (
                  <div className="flex items-center justify-between px-4 py-3 text-sm bg-[rgba(0,82,204,0.05)]">
                    <span className="font-semibold text-[#003d9b]">
                      {invoice.status === 'paid' ? 'Đã thanh toán' : 'Còn phải trả'}
                    </span>
                    <span
                      className={`text-base font-semibold ${
                        invoice.status === 'paid' ? 'text-[#006c47]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {formatCurrencyVnd(invoice.status === 'paid' ? 0 : invoice.totalDue)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {invoice.status === 'awaiting_visit' && (
              <p className="text-xs text-[#737685] leading-relaxed">
                Chi phí xét nghiệm và thuốc (nếu có) sẽ được cộng vào hóa đơn sau khi khám. Tiền cọc{' '}
                {formatCurrencyVnd(invoice.depositAmount)} sẽ được trừ vào tổng thanh toán cuối cùng.
              </p>
            )}

            {invoice.status === 'pending_payment' && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#191c1e]">Thanh toán phần còn lại</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                          isSelected
                            ? 'border-[#003d9b] bg-[rgba(0,82,204,0.05)] text-[#003d9b]'
                            : 'border-[#c3c6d6] text-[#434654] hover:border-[#003d9b]/40'
                        }`}
                      >
                        {method.icon}
                        {method.label}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  disabled={!paymentMethod || isPaying}
                  onClick={() => paymentMethod && onPay(invoice.id, paymentMethod)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#003d9b] px-5 py-3 text-sm font-medium text-white hover:bg-[#002d75] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPaying ? (
                    <>
                      <Spinner size="sm" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>Thanh toán {formatCurrencyVnd(invoice.totalDue)}</>
                  )}
                </button>
              </div>
            )}

            {invoice.status === 'paid' && invoice.paidAt && (
              <p className="text-xs text-[#737685]">
                Đã thanh toán đủ vào{' '}
                {new Date(invoice.paidAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default PaymentInvoiceCard;
