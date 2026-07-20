import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Landmark,
  ShieldCheck,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { Spinner } from '../../../components/ui';
import bidvQrImage from '../../../assets/payment/bidv-qr.png';
import momoQrImage from '../../../assets/payment/momo-qr.png';
import {
  DEPOSIT_RATE,
  formatCurrencyVnd,
  getConsultationFee,
  getDepositAmount,
} from '../constants/consultationFees';
import { DepositPaymentMethod } from '../types';

interface DepositPaymentSectionProps {
  specialtyId: string | null;
  paymentMethod: DepositPaymentMethod | null;
  depositPaid: boolean;
  isPayingDeposit: boolean;
  onPaymentMethodChange: (method: DepositPaymentMethod) => void;
  onPayDeposit: () => void;
}

interface PaymentMethodCard {
  id: Extract<DepositPaymentMethod, 'momo' | 'banking'>;
  label: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  qrImage: string;
  accountName: string;
  accountNumber: string;
  bankLabel: string;
  note: string;
}

const PAYMENT_METHODS: PaymentMethodCard[] = [
  {
    id: 'momo',
    label: 'MoMo',
    description: 'Quét mã QR MoMo của bạn',
    icon: <Smartphone size={20} className="text-[#a50064]" />,
    iconBg: 'bg-pink-50',
    qrImage: momoQrImage,
    accountName: 'NGUYEN MANH CUONG',
    accountNumber: 'PSP2606114400000224',
    bankLabel: 'MoMo / VietQR / NAPAS 247',
    note: 'Chuyển đúng số tiền cọc rồi nhấn xác nhận để lễ tân kiểm tra giao dịch.',
  },
  {
    id: 'banking',
    label: 'Chuyển khoản ngân hàng',
    description: 'Quét mã QR BIDV của bạn',
    icon: <Landmark size={20} className="text-[#006c47]" />,
    iconBg: 'bg-emerald-50',
    qrImage: bidvQrImage,
    accountName: 'NGUYEN MANH CUONG',
    accountNumber: '8813287294',
    bankLabel: 'BIDV - PGD Nguyễn Trãi',
    note: 'Lễ tân sẽ đối chiếu số tiền cọc và xác nhận lịch sau khi nhận được chuyển khoản.',
  },
];

const PAYMENT_LABELS: Record<PaymentMethodCard['id'], string> = {
  momo: 'QR MoMo',
  banking: 'QR BIDV',
};

const DepositPaymentSection: React.FC<DepositPaymentSectionProps> = ({
  specialtyId,
  paymentMethod,
  depositPaid,
  isPayingDeposit,
  onPaymentMethodChange,
  onPayDeposit,
}) => {
  const consultationFee = getConsultationFee(specialtyId);
  const depositAmount = getDepositAmount(specialtyId);
  const remainingFee = consultationFee - depositAmount;
  const selectedMethod = PAYMENT_METHODS.find((method) => method.id === paymentMethod) ?? null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-gray-100 bg-gray-50/60 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#003d9b]/10">
          <Wallet size={16} className="text-[#003d9b]" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">Đặt cọc giữ lịch</h3>
        <span className="ml-auto rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-600">
          Bắt buộc
        </span>
      </div>

      <div className="space-y-5 p-6">
        {/* Warning banner */}
        <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 text-sm leading-5 text-amber-800">
          Bạn cần đặt cọc {Math.round(DEPOSIT_RATE * 100)}% phí khám để giữ lịch. Sau khi bạn
          chuyển khoản và bấm xác nhận, lễ tân sẽ kiểm tra đúng số tiền cọc trước khi duyệt lịch
          hẹn.
        </div>

        {/* Cost breakdown */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span>Phí khám dự kiến</span>
            <span>{formatCurrencyVnd(consultationFee)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-[#003d9b]">
            <span>Tiền cọc cần thanh toán ({Math.round(DEPOSIT_RATE * 100)}%)</span>
            <span>{formatCurrencyVnd(depositAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-gray-500">
            <span>Còn lại khi khám</span>
            <span>{formatCurrencyVnd(remainingFee)}</span>
          </div>
        </div>

        {!depositPaid ? (
          <>
            {/* Payment method selection */}
            <div className="space-y-2.5">
              <p className="text-sm font-semibold text-gray-900">Chọn phương thức thanh toán</p>
              <div className="grid gap-2.5">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => onPaymentMethodChange(method.id)}
                      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
                        isSelected
                          ? 'border-[#003d9b] bg-blue-50/50 shadow-sm'
                          : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${method.iconBg}`}>
                        {method.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                        <p className="text-xs text-gray-500">{method.description}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 size={18} className="ml-auto shrink-0 text-[#003d9b]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QR display */}
            {selectedMethod && (
              <div className="space-y-3 rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/50 to-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#003d9b]">
                      {PAYMENT_LABELS[selectedMethod.id]}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">{selectedMethod.note}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#003d9b] shadow-sm ring-1 ring-blue-100">
                    {formatCurrencyVnd(depositAmount)}
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white">
                  <div className="flex justify-center bg-gray-50/50 px-4 pt-5">
                    <img
                      src={selectedMethod.qrImage}
                      alt={`Mã QR ${selectedMethod.label}`}
                      className="max-h-[520px] w-full max-w-[420px] object-contain"
                    />
                  </div>

                  <div className="border-t border-gray-100 bg-white px-4 py-4 text-sm space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-gray-500">Chủ tài khoản</span>
                      <span className="text-right font-bold text-gray-900">
                        {selectedMethod.accountName}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-gray-500">Số tài khoản</span>
                      <span className="text-right font-bold text-gray-900">
                        {selectedMethod.accountNumber}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-gray-500">Ngân hàng / Kênh nhận</span>
                      <span className="text-right font-medium text-gray-900">
                        {selectedMethod.bankLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pay button */}
            <button
              type="button"
              onClick={onPayDeposit}
              disabled={!paymentMethod || isPayingDeposit}
              className={`inline-flex w-full items-center justify-center gap-2.5 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${
                paymentMethod && !isPayingDeposit
                  ? 'bg-gradient-to-r from-[#003d9b] to-[#2563eb] text-white shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 active:scale-[0.98]'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
              }`}
            >
              {isPayingDeposit ? (
                <>
                  <Spinner size="sm" color="#ffffff" />
                  Đang ghi nhận xác nhận của bạn...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Đã Thanh Toán Đặt Cọc
                </>
              )}
            </button>
          </>
        ) : (
          <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck size={18} />
              <span className="font-semibold">Đã Ghi Nhận Thanh Toán Đặt Cọc</span>
            </div>
            <p className="text-sm text-gray-600 leading-5">
              Khoản cọc {formatCurrencyVnd(depositAmount)} qua{' '}
              {selectedMethod ? PAYMENT_LABELS[selectedMethod.id] : 'phương thức đã chọn'} đã được
              ghi nhận ở trạng thái chờ duyệt. Lễ tân sẽ là người xác nhận số tiền đặt cọc trước
              khi bác sĩ duyệt lịch khám.
            </p>
          </div>
        )}

        {!depositPaid && (
          <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
            <AlertCircle size={12} className="shrink-0" />
            Chưa xác nhận đã chuyển cọc, nên chưa thể hoàn tất đăng ký lịch hẹn.
          </p>
        )}
      </div>
    </div>
  );
};

export default DepositPaymentSection;
