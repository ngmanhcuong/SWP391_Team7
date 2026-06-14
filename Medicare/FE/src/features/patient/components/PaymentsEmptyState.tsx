import React from 'react';
import { CreditCard } from 'lucide-react';
import { PaymentFilter } from '../types';

interface PaymentsEmptyStateProps {
  filter: PaymentFilter;
}

const MESSAGES: Record<PaymentFilter, { title: string; description: string }> = {
  all: {
    title: 'Chưa có hóa đơn',
    description: 'Hóa đơn sẽ được tạo sau khi bạn hoàn tất khám bệnh.',
  },
  unpaid: {
    title: 'Không có hóa đơn chưa thanh toán',
    description: 'Bạn đã thanh toán đủ các hóa đơn phát sinh sau khám.',
  },
  awaiting_visit: {
    title: 'Không có lịch đã cọc',
    description: 'Tiền cọc khi đặt lịch sẽ hiển thị tại đây trước ngày khám.',
  },
  paid: {
    title: 'Chưa có hóa đơn đã thanh toán',
    description: 'Lịch sử thanh toán sẽ được lưu sau khi bạn hoàn tất thanh toán.',
  },
};

const PaymentsEmptyState: React.FC<PaymentsEmptyStateProps> = ({ filter }) => {
  const message = MESSAGES[filter];

  return (
    <div className="rounded-lg border border-dashed border-[#c3c6d6] bg-[#f8f9fb] px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#edeef0]">
        <CreditCard size={22} className="text-[#737685]" />
      </div>
      <p className="text-base font-medium text-[#191c1e]">{message.title}</p>
      <p className="text-sm text-[#434654] mt-2 max-w-md mx-auto">{message.description}</p>
    </div>
  );
};

export default PaymentsEmptyState;
