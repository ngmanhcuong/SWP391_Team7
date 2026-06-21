import React from 'react';
import ReceptionistAppointmentManagement from './ReceptionistAppointmentManagement';

// Trang "Lịch hẹn" chỉ quản lý lịch hẹn. Việc check-in được thực hiện ở trang
// "Tiếp đón & Check-in" (/receptionist/tiep-nhan) hoặc qua nút Check-in ở
// chi tiết lịch hẹn đã xác nhận — cả hai đều dùng chung dữ liệu thật.
const ReceptionistAppointmentsPage: React.FC = () => (
  <div className="max-w-[1200px] mx-auto">
    <ReceptionistAppointmentManagement />
  </div>
);

export default ReceptionistAppointmentsPage;
