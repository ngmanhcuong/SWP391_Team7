import React from 'react';
import { CheckCircle2, Clock, CreditCard, Star } from 'lucide-react';

const ReviewsGuidelinesPanel: React.FC = () => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
    <div className="border-b border-[#c3c6d6]/40 bg-gradient-to-r from-[#f8f9fb] to-white px-6 py-4">
      <h3 className="text-lg font-semibold text-[#191c1e]">Khi nào được đánh giá?</h3>
      <p className="text-xs text-[#737685] mt-0.5">Quy trình hợp lệ</p>
    </div>
    <div className="p-6 space-y-4">
      {[
        {
          icon: CheckCircle2,
          title: 'Hoàn tất khám bệnh',
          desc: 'Bác sĩ đã kết luận và bạn nhận hồ sơ/đơn thuốc.',
        },
        {
          icon: CreditCard,
          title: 'Thanh toán xong hóa đơn',
          desc: 'Hóa đơn sau khám đã thanh toán đủ (đã trừ tiền cọc).',
        },
        {
          icon: Star,
          title: 'Gửi đánh giá trong 14 ngày',
          desc: 'Chấm điểm bác sĩ, cơ sở và góp ý để cải thiện dịch vụ.',
        },
      ].map((step) => (
        <div key={step.title} className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#003d9b]/10 ring-1 ring-[#003d9b]/10">
            <step.icon size={16} className="text-[#003d9b]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#191c1e]">{step.title}</p>
            <p className="text-xs text-[#737685] mt-0.5 leading-relaxed">{step.desc}</p>
          </div>
        </div>
      ))}
      <div className="rounded-xl bg-[#f8f9fb] border border-[#c3c6d6]/60 px-4 py-3 flex gap-2 text-xs text-[#434654]">
        <Clock size={14} className="text-[#003d9b] shrink-0 mt-0.5" />
        Đánh giá ẩn danh vẫn được ghi nhận nhưng không hiển thị tên bạn với bác sĩ.
      </div>
    </div>
  </div>
);

export default ReviewsGuidelinesPanel;
