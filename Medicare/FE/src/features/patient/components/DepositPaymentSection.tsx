import React from 'react';
import { AlertCircle, Building2, CreditCard, ShieldCheck, Smartphone, Wallet } from 'lucide-react';
import { Spinner } from '../../../components/ui';
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

const PAYMENT_METHODS: {
  id: DepositPaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'vnpay',
    label: 'VNPay',
    description: 'Thẻ ATM / Visa / Mastercard',
    icon: <CreditCard size={18} className="text-[#003d9b]" />,
  },
  {
    id: 'momo',
    label: 'MoMo',
    description: 'Ví điện tử MoMo',
    icon: <Smartphone size={18} className="text-[#a50064]" />,
  },
  {
    id: 'banking',
    label: 'Chuyển khoản',
    description: 'Ngân hàng nội địa',
    icon: <Building2 size={18} className="text-[#006c47]" />,
  },
];

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

  return (
    <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-[#c3c6d6] px-6 py-5 flex items-center gap-2">
        <Wallet size={18} className="text-[#003d9b]" />
        <h3 className="text-lg font-medium text-[#191c1e]">Đặt cọc giữ lịch</h3>
        <span className="ml-auto text-xs font-medium text-[#851800] bg-[#fff1eb] px-2 py-1 rounded">
          Bắt buộc
        </span>
      </div>

      <div className="p-6 space-y-5">
        <div className="rounded-lg bg-[#fff8e6] border border-[#f5d080] px-4 py-3 text-sm text-[#7a4f01] leading-5">
          Bạn cần đặt cọc {Math.round(DEPOSIT_RATE * 100)}% phí khám để giữ lịch. Không đặt cọc sẽ
          không thể đăng ký lịch hẹn. Số tiền còn lại thanh toán khi đến khám.
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-[#434654]">
            <span>Phí khám dự kiến</span>
            <span>{formatCurrencyVnd(consultationFee)}</span>
          </div>
          <div className="flex items-center justify-between font-medium text-[#003d9b]">
            <span>Tiền cọc cần thanh toán ({Math.round(DEPOSIT_RATE * 100)}%)</span>
            <span>{formatCurrencyVnd(depositAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-[#434654]">
            <span>Còn lại khi khám</span>
            <span>{formatCurrencyVnd(remainingFee)}</span>
          </div>
        </div>

        {!depositPaid ? (
          <>
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#191c1e]">Chọn phương thức thanh toán</p>
              <div className="grid gap-2">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => onPaymentMethodChange(method.id)}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                        isSelected
                          ? 'border-[#003d9b] bg-[#003d9b]/5 ring-1 ring-[#003d9b]/20'
                          : 'border-[#c3c6d6] hover:border-[#003d9b]/40 hover:bg-[#f8f9fb]'
                      }`}
                    >
                      {method.icon}
                      <div>
                        <p className="text-sm font-medium text-[#191c1e]">{method.label}</p>
                        <p className="text-xs text-[#434654]">{method.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={onPayDeposit}
              disabled={!paymentMethod || isPayingDeposit}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-base transition-colors ${
                paymentMethod && !isPayingDeposit
                  ? 'bg-[#003d9b] text-white hover:bg-[#002d75]'
                  : 'bg-[#003d9b]/40 text-white cursor-not-allowed'
              }`}
            >
              {isPayingDeposit ? (
                <>
                  <Spinner size="sm" color="#ffffff" />
                  Đang xử lý thanh toán...
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  Thanh toán cọc {formatCurrencyVnd(depositAmount)}
                </>
              )}
            </button>
          </>
        ) : (
          <div className="rounded-lg border border-[#006c47]/30 bg-[#006c47]/5 px-4 py-4 space-y-2">
            <div className="flex items-center gap-2 text-[#006c47]">
              <ShieldCheck size={18} />
              <span className="font-medium">Đã thanh toán cọc thành công</span>
            </div>
            <p className="text-sm text-[#434654]">
              Số tiền {formatCurrencyVnd(depositAmount)} đã được ghi nhận. Lễ tân sẽ xác nhận cọc,
              sau đó bác sĩ sẽ xác nhận lịch hẹn của bạn.
            </p>
          </div>
        )}

        {!depositPaid && (
          <p className="text-xs text-[#851800] flex items-center gap-1.5">
            <AlertCircle size={12} className="shrink-0" />
            Chưa đặt cọc — không thể hoàn tất đăng ký lịch hẹn.
          </p>
        )}
      </div>
    </div>
  );
};

export default DepositPaymentSection;
