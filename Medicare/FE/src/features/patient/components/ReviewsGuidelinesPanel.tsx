import React from 'react';
import { CheckCircle2, Clock, CreditCard, Star } from 'lucide-react';

const ReviewsGuidelinesPanel: React.FC = () => (
  <div className="overflow-hidden rounded-2xl border border-[#c3c6d6]/60 bg-white shadow-sm shadow-[#003d9b]/5">
    <div className="border-b border-[#c3c6d6]/40 bg-gradient-to-r from-[#f8f9fb] to-white px-6 py-4">
      <h3 className="text-lg font-semibold text-[#191c1e]">Khi nào được đánh giá?</h3>
      <p className="mt-0.5 text-xs text-[#737685]">Quy trình hợp lệ</p>
    </div>
    <div className="space-y-4 p-6">
      {[
        {
          icon: CheckCircle2,
          title: 'Hoàn tất khám bệnh',
          desc: 'Bác sĩ đã kết luận và bạn đã nhận hồ sơ hoặc đơn thuốc của lượt khám.',
        },
        {
          icon: CreditCard,
          title: 'Lượt khám đã được ghi nhận',
          desc: 'Sau khi bác sĩ hoàn tất ca khám, hệ thống sẽ mở quyền gửi đánh giá cho lượt khám đó.',
        },
        {
          icon: Star,
          title: 'Gửi đánh giá trong 14 ngày',
          desc: 'Chấm điểm bác sĩ, cơ sở và góp ý để cải thiện chất lượng dịch vụ.',
        },
      ].map((step) => (
        <div key={step.title} className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#003d9b]/10 ring-1 ring-[#003d9b]/10">
            <step.icon size={16} className="text-[#003d9b]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#191c1e]">{step.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#737685]">{step.desc}</p>
          </div>
        </div>
      ))}
      <div className="flex gap-2 rounded-xl border border-[#c3c6d6]/60 bg-[#f8f9fb] px-4 py-3 text-xs text-[#434654]">
        <Clock size={14} className="mt-0.5 shrink-0 text-[#003d9b]" />
        Đánh giá ẩn danh vẫn được ghi nhận nhưng không hiển thị tên bạn với bác sĩ.
      </div>
    </div>
  </div>
);

export default ReviewsGuidelinesPanel;
