import React from 'react';
import { BellOff } from 'lucide-react';
import { NotificationFilter } from '../types';

interface NotificationsEmptyStateProps {
  filter: NotificationFilter;
}

const MESSAGES: Record<NotificationFilter, { title: string; description: string }> = {
  all: {
    title: 'Chưa có thông báo',
    description: 'Các cập nhật về lịch khám, xét nghiệm và thanh toán sẽ hiển thị tại đây.',
  },
  unread: {
    title: 'Không còn thông báo chưa đọc',
    description: 'Bạn đã xem hết thông báo. Quay lại sau để kiểm tra cập nhật mới.',
  },
  appointment: {
    title: 'Không có thông báo lịch hẹn',
    description: 'Nhắc lịch khám và trạng thái đặt lịch sẽ xuất hiện khi bạn có lịch hẹn.',
  },
  lab: {
    title: 'Không có thông báo xét nghiệm',
    description: 'Kết quả và trạng thái xét nghiệm sẽ được thông báo tại đây.',
  },
  prescription: {
    title: 'Không có nhắc thuốc',
    description: 'Lịch uống thuốc và đơn mới sẽ hiển thị khi bác sĩ kê đơn.',
  },
  payment: {
    title: 'Không có thông báo thanh toán',
    description: 'Hóa đơn và nhắc thanh toán sẽ xuất hiện khi phát sinh chi phí.',
  },
  system: {
    title: 'Không có thông báo hệ thống',
    description: 'Cập nhật tài khoản và hướng dẫn sử dụng sẽ hiển thị tại đây.',
  },
};

const NotificationsEmptyState: React.FC<NotificationsEmptyStateProps> = ({ filter }) => {
  const message = MESSAGES[filter];

  return (
    <div className="rounded-lg border border-dashed border-[#c3c6d6] bg-[#f8f9fb] px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#edeef0]">
        <BellOff size={22} className="text-[#737685]" />
      </div>
      <p className="text-base font-medium text-[#191c1e]">{message.title}</p>
      <p className="text-sm text-[#434654] mt-2 max-w-md mx-auto">{message.description}</p>
    </div>
  );
};

export default NotificationsEmptyState;
