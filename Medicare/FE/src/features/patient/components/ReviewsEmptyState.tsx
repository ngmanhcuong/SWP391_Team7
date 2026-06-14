import React from 'react';
import { Star } from 'lucide-react';
import { ReviewFilter } from '../types';

interface ReviewsEmptyStateProps {
  filter: ReviewFilter;
}

const MESSAGES: Record<ReviewFilter, { title: string; description: string }> = {
  all: {
    title: 'Chưa có lượt khám để đánh giá',
    description: 'Sau khi hoàn tất khám và thanh toán, bạn có thể đánh giá dịch vụ tại đây.',
  },
  pending: {
    title: 'Không có lượt khám chờ đánh giá',
    description: 'Bạn đã đánh giá hết các lượt khám đã thanh toán gần đây.',
  },
  submitted: {
    title: 'Chưa có đánh giá nào',
    description: 'Các đánh giá bạn gửi sẽ được lưu và hiển thị tại đây.',
  },
};

const ReviewsEmptyState: React.FC<ReviewsEmptyStateProps> = ({ filter }) => {
  const message = MESSAGES[filter];

  return (
    <div className="rounded-2xl border border-dashed border-[#c3c6d6] bg-[#f8f9fb] px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 ring-1 ring-amber-100">
        <Star size={22} className="text-amber-500" />
      </div>
      <p className="text-base font-medium text-[#191c1e]">{message.title}</p>
      <p className="text-sm text-[#434654] mt-2 max-w-md mx-auto">{message.description}</p>
    </div>
  );
};

export default ReviewsEmptyState;
