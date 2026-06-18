import React from 'react';
import PlaceholderPage from '../shared/PlaceholderPage';

export const ReceptionistReceptionPage: React.FC = () => (
  <PlaceholderPage title="Tiếp đón & Check-in" description="Đăng ký bệnh nhân đến khám và cấp số thứ tự." />
);

export const ReceptionistPatientsPage: React.FC = () => (
  <PlaceholderPage title="Danh sách bệnh nhân" description="Tra cứu thông tin và lịch sử khám của bệnh nhân." />
);

export const ReceptionistInvoicesPage: React.FC = () => (
  <PlaceholderPage title="Hóa đơn" description="Lập và tra cứu hóa đơn cho bệnh nhân." />
);
