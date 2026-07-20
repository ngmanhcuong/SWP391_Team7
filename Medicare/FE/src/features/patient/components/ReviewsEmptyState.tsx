import React from 'react';
import { Star } from 'lucide-react';
import { ReviewFilter } from '../types';

interface ReviewsEmptyStateProps {
  filter: ReviewFilter;
}

const MESSAGES: Record<ReviewFilter, { title: string; description: string }> = {
  all: {
    title: 'Chưa có lượt khám để đánh giá',
    description: 'Sau khi bác sĩ hoàn tất ca khám, lượt khám đủ điều kiện sẽ xuất hiện tại đây để bạn đánh giá.',
  },
  pending: {
    title: 'Không có lượt khám chờ đánh giá',
    description: 'Bạn đã đánh giá hết các lượt khám đã hoàn tất gần đây.',
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
      <p className="mx-auto mt-2 max-w-md text-sm text-[#434654]">{message.description}</p>
    </div>
  );
};

export default ReviewsEmptyState;
