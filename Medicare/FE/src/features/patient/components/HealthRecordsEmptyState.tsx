import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { HealthRecordTab } from '../types';

interface HealthRecordsEmptyStateProps {
  tab: HealthRecordTab;
}

const MESSAGES: Record<HealthRecordTab, { title: string; description: string }> = {
  visits: {
    title: 'Chưa có lịch sử khám',
    description: 'Các lần khám của bạn sẽ được lưu tại đây sau khi hoàn tất khám bệnh.',
  },
  prescriptions: {
    title: 'Chưa có đơn thuốc',
    description: 'Đơn thuốc do bác sĩ kê sẽ hiển thị tại đây.',
  },
  labs: {
    title: 'Chưa có kết quả xét nghiệm',
    description: 'Kết quả xét nghiệm sẽ được cập nhật sau khi phòng lab trả kết quả.',
  },
  history: {
    title: 'Chưa có tiền sử bệnh',
    description: 'Thông tin dị ứng, bệnh mạn tính sẽ được bác sĩ ghi nhận khi khám.',
  },
};

const HealthRecordsEmptyState: React.FC<HealthRecordsEmptyStateProps> = ({ tab }) => {
  const message = MESSAGES[tab];

  return (
    <div className="rounded-lg border border-dashed border-[#c3c6d6] bg-[#f8f9fb] px-6 py-10 text-center">
      <p className="text-base font-medium text-[#191c1e]">{message.title}</p>
      <p className="text-sm text-[#434654] mt-2 max-w-md mx-auto">{message.description}</p>
      {tab === 'visits' && (
        <Link
          to="/patient/lich-hen"
          className="inline-flex items-center gap-2 mt-5 rounded-lg bg-[#003d9b] px-5 py-2.5 text-sm text-white hover:bg-[#002d75] transition-colors"
        >
          <Calendar size={16} />
          Đặt lịch khám
        </Link>
      )}
    </div>
  );
};

export default HealthRecordsEmptyState;
