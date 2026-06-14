import React from 'react';
import PlaceholderPage from '../shared/PlaceholderPage';

export { PatientDashboardPage } from './PatientDashboardPage';

export const PatientAppointmentsPage: React.FC = () => (
  <PlaceholderPage title="Lịch hẹn" description="Xem và quản lý các lịch hẹn khám bệnh của bạn." />
);

export const PatientHealthRecordsPage: React.FC = () => (
  <PlaceholderPage title="Hồ sơ sức khỏe" description="Theo dõi tiền sử bệnh, đơn thuốc và kết quả khám." />
);

export const PatientNotificationsPage: React.FC = () => (
  <PlaceholderPage title="Thông báo" description="Xem tất cả thông báo liên quan đến lịch hẹn và sức khỏe." />
);

export const PatientPaymentsPage: React.FC = () => (
  <PlaceholderPage title="Thanh toán" description="Quản lý hóa đơn và lịch sử thanh toán." />
);

export const PatientReviewsPage: React.FC = () => (
  <PlaceholderPage title="Đánh giá dịch vụ" description="Đánh giá chất lượng dịch vụ khám chữa bệnh." />
);
