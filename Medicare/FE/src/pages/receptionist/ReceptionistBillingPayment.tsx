import React, { useMemo, useState } from 'react';
import {
  Banknote,
  CheckCircle2,
  Landmark,
  ListFilter,
  LucideIcon,
  QrCode,
  WalletCards,
} from 'lucide-react';
import { Card } from '../../components/ui';
import bidvQrImage from '../../assets/payment/bidv-qr.png';
import momoQrImage from '../../assets/payment/momo-qr.png';
import {
  RECEPTIONIST_INVOICE_RECORDS,
  ReceptionistInvoiceRecord,
} from '../../features/receptionist/constants';

type Method = 'cash' | 'transfer' | 'momo';

interface MethodConfig {
  id: Method;
  label: string;
  icon: LucideIcon;
}

interface PaymentDetailCard {
  title: string;
  description: string;
  image?: string;
  accountName?: string;
  accountNumber?: string;
  bankLabel?: string;
  note: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

const PENDING_INVOICES: ReceptionistInvoiceRecord[] = RECEPTIONIST_INVOICE_RECORDS.filter(
  (invoice) => invoice.status === 'pending',
);

const METHODS: MethodConfig[] = [
  { id: 'cash', label: 'Tiền mặt', icon: Banknote },
  { id: 'transfer', label: 'Chuyển khoản BIDV', icon: Landmark },
  { id: 'momo', label: 'MoMo QR', icon: QrCode },
];

const METHOD_DETAILS: Record<Method, PaymentDetailCard> = {
  cash: {
    title: 'Thanh toán tại quầy',
    description:
      'Lễ tân thu tiền trực tiếp tại quầy, đối chiếu hóa đơn và cập nhật ngay trạng thái thanh toán cho bệnh nhân.',
    note: 'Sau khi nhận đủ tiền mặt, lễ tân bấm xác nhận để lưu giao dịch vào hệ thống.',
  },
  transfer: {
    title: 'Quét mã BIDV',
    description:
      'Mã QR đã gắn sẵn thông tin tài khoản thật để bệnh nhân có thể chuyển khoản nhanh và lễ tân dễ đối chiếu.',
    image: bidvQrImage,
    accountName: 'NGUYEN MANH CUONG',
    accountNumber: '8813287294',
    bankLabel: 'BIDV - PGD Nguyễn Trãi',
    note: 'Ưu tiên dùng khi bệnh nhân thanh toán phần còn lại sau khi đã trừ tiền cọc.',
  },
  momo: {
    title: 'Quét mã MoMo',
    description:
      'Mã QR MoMo dùng chung tài khoản thật của bạn, thuận tiện để bệnh nhân quét thanh toán ngay tại quầy.',
    image: momoQrImage,
    accountName: 'NGUYEN MANH CUONG',
    accountNumber: 'PSP2606114400000224',
    bankLabel: 'MoMo / VietQR / NAPAS 247',
    note: 'Sau khi bệnh nhân báo đã quét thanh toán, lễ tân kiểm tra giao dịch và xác nhận trên hệ thống.',
  },
};

const ReceptionistBillingPayment: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState(PENDING_INVOICES[0]?.code ?? '');
  const [method, setMethod] = useState<Method>('transfer');

  const selectedInvoice = useMemo(
    () => PENDING_INVOICES.find((invoice) => invoice.code === selectedCode) ?? PENDING_INVOICES[0],
    [selectedCode],
  );

  const paymentDetail = METHOD_DETAILS[method];

  if (!selectedInvoice) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-6">
        <h1 className="text-2xl font-bold text-[#1a56db]" style={{ fontFamily: 'Lexend' }}>
          Thanh toán viện phí
        </h1>
        <Card>
          <p className="text-sm text-gray-500">Hiện không có hóa đơn nào ở trạng thái chờ thanh toán.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <h1 className="text-2xl font-bold text-[#1a56db]" style={{ fontFamily: 'Lexend' }}>
        Thanh toán viện phí
      </h1>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card padding="none" className="h-fit overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold">Chờ thanh toán ({PENDING_INVOICES.length})</p>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#1a56db]"
            >
              <ListFilter size={14} /> Lọc
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {PENDING_INVOICES.map((invoice) => {
              const active = invoice.code === selectedInvoice.code;
              return (
                <button
                  key={invoice.code}
                  type="button"
                  onClick={() => setSelectedCode(invoice.code)}
                  className={`w-full border-l-4 px-4 py-3 text-left transition-colors ${
                    active
                      ? 'border-[#1a56db] bg-blue-50/70'
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-gray-400">{invoice.code}</span>
                    {invoice.urgent && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                        Khẩn
                      </span>
                    )}
                  </div>
                  <p className={`mt-0.5 font-semibold ${active ? 'text-[#1a56db]' : ''}`}>
                    {invoice.name}
                  </p>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-500">{invoice.department}</span>
                    <span className="text-sm font-bold">{formatCurrency(invoice.amount)}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] italic text-gray-400">
                    Cập nhật lúc {invoice.time}, {invoice.date}
                  </p>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Thông tin bệnh nhân</h2>
              <span className="text-sm font-semibold text-[#1a56db]">{selectedInvoice.code}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">Họ và tên</p>
                <p className="mt-1 font-medium">{selectedInvoice.name}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">Mã BN</p>
                <p className="mt-1 font-medium">{selectedInvoice.patientId}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">Ngày sinh</p>
                <p className="mt-1 font-medium">{selectedInvoice.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">Bảo hiểm</p>
                <p
                  className={`mt-1 font-medium ${
                    selectedInvoice.insurance === 'Không' ? 'text-gray-700' : 'text-emerald-600'
                  }`}
                >
                  {selectedInvoice.insurance}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">Bác sĩ phụ trách</p>
                <p className="mt-1 font-medium">{selectedInvoice.doctor}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">Khoa khám</p>
                <p className="mt-1 font-medium">{selectedInvoice.department}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">Số điện thoại</p>
                <p className="mt-1 font-medium">{selectedInvoice.phone}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-semibold">Chi tiết viện phí</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    <th className="py-2">Dịch vụ</th>
                    <th className="py-2 text-center">Số lượng</th>
                    <th className="py-2 text-right">Đơn giá</th>
                    <th className="py-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedInvoice.serviceLines.map((line) => (
                    <tr key={line.service}>
                      <td className="py-3">{line.service}</td>
                      <td className="py-3 text-center text-gray-500">{line.qty}</td>
                      <td className="py-3 text-right text-gray-500">{formatCurrency(line.unit)}</td>
                      <td className="py-3 text-right font-medium">{formatCurrency(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính:</span>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(selectedInvoice.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>BHYT giảm trừ:</span>
                  <span className="font-medium text-emerald-600">
                    - {formatCurrency(selectedInvoice.insuranceDeduction)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tiền đặt cọc (khấu trừ):</span>
                  <span className="font-medium text-emerald-600">
                    - {formatCurrency(selectedInvoice.depositDeduction)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2 text-base">
                  <span className="font-semibold">Tổng tiền:</span>
                  <span className="font-bold text-[#1a56db]">
                    {formatCurrency(selectedInvoice.amount)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-base font-semibold">Phương thức thanh toán</h2>

            <div className="grid grid-cols-3 gap-3">
              {METHODS.map(({ id, label, icon: Icon }) => {
                const active = method === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMethod(id)}
                    className={`relative flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 transition-colors ${
                      active
                        ? 'border-[#1a56db] bg-blue-50/60'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute right-2 top-2 h-3.5 w-3.5 rounded-full border ${
                        active ? 'border-[#1a56db] bg-[#1a56db]' : 'border-gray-300'
                      }`}
                    />
                    <Icon size={24} className={active ? 'text-[#1a56db]' : 'text-gray-500'} />
                    <span className={`text-sm font-medium ${active ? 'text-[#1a56db]' : ''}`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-[#fbfdff] p-4">
              {paymentDetail.image ? (
                <div className="overflow-hidden rounded-2xl border border-[#d6e4ff] bg-white">
                  <div className="flex justify-center bg-[#fcfcfd] px-4 pt-5">
                    <img
                      src={paymentDetail.image}
                      alt={paymentDetail.title}
                      className="max-h-[520px] w-full max-w-[420px] object-contain"
                    />
                  </div>

                  <div className="border-t border-[#e3e8f3] bg-white px-4 py-4 text-sm">
                    <div className="mb-3">
                      <p className="font-semibold text-[#191c1e]">{paymentDetail.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#5b6473]">
                        {paymentDetail.description}
                      </p>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[#434654]">Chủ tài khoản</span>
                      <span className="text-right font-semibold text-[#191c1e]">
                        {paymentDetail.accountName}
                      </span>
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <span className="text-[#434654]">Số tài khoản</span>
                      <span className="text-right font-semibold text-[#191c1e]">
                        {paymentDetail.accountNumber}
                      </span>
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <span className="text-[#434654]">Ngân hàng / Kênh nhận</span>
                      <span className="text-right font-medium text-[#191c1e]">
                        {paymentDetail.bankLabel}
                      </span>
                    </div>
                    <p className="mt-4 rounded-lg bg-[#f8fbff] px-3 py-2 text-xs leading-5 text-[#516072]">
                      {paymentDetail.note}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 rounded-2xl border border-[#d6e4ff] bg-white p-4">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-[#e3e8f3] bg-[#fcfcfd]">
                    <WalletCards size={44} className="text-[#1a56db]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#191c1e]">{paymentDetail.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#5b6473]">
                      {paymentDetail.description}
                    </p>
                    <p className="mt-3 rounded-lg bg-[#f8fbff] px-3 py-2 text-xs leading-5 text-[#516072]">
                      {paymentDetail.note}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e293b] px-5 py-3.5 font-semibold text-white transition-colors hover:bg-[#0f172a]"
            >
              <CheckCircle2 size={18} /> Xác nhận thanh toán ({formatCurrency(selectedInvoice.amount)})
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistBillingPayment;
