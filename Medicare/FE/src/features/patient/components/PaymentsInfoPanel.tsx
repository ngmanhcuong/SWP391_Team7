import React from 'react';
import { DEPOSIT_RATE } from '../constants/consultationFees';

const PaymentsInfoPanel: React.FC = () => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
    <div className="border-b border-[#c3c6d6] px-6 py-4">
      <h3 className="text-lg font-medium text-[#191c1e]">Cách tính phí</h3>
      <p className="text-xs text-[#737685] mt-0.5">Quy trình thanh toán sau khám</p>
    </div>
    <div className="p-6 space-y-4 text-sm text-[#434654]">
      <div className="space-y-2">
        <p className="font-medium text-[#191c1e]">1. Đặt cọc khi đặt lịch</p>
        <p>
          Bạn đặt cọc {Math.round(DEPOSIT_RATE * 100)}% phí khám (tối thiểu 100.000 VND) để giữ lịch hẹn.
        </p>
      </div>
      <div className="space-y-2">
        <p className="font-medium text-[#191c1e]">2. Khám và phát sinh chi phí</p>
        <p>
          Sau khám, hóa đơn bao gồm phí khám, xét nghiệm, thuốc (nếu có).
        </p>
      </div>
      <div className="space-y-2">
        <p className="font-medium text-[#191c1e]">3. Trừ tiền cọc</p>
        <p>
          Tiền cọc đã thanh toán được trừ trực tiếp vào tổng hóa đơn. Bạn chỉ thanh toán phần còn lại.
        </p>
      </div>
      <div className="rounded-lg bg-[rgba(0,82,204,0.05)] border border-[#003d9b]/20 px-4 py-3 text-xs leading-relaxed">
        <span className="font-semibold text-[#003d9b]">Ví dụ:</span> Tổng 950.000 VND − Cọc 100.000 VND ={' '}
        <span className="font-semibold text-[#191c1e]">850.000 VND</span> cần thanh toán.
      </div>
    </div>
  </div>
);

export default PaymentsInfoPanel;
