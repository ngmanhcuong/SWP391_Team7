import { DoctorNotification } from '../types';
import { buildDoctorScheduleData } from './buildDoctorScheduleData';
import { getPatientsByHealthStatus } from './doctorPatientRegistry';
import { DOCTOR_PATHS } from './doctorPaths';

export const buildDoctorNotificationsData = (): DoctorNotification[] => {
  const schedule = buildDoctorScheduleData();
  const waitingPatients = getPatientsByHealthStatus('waiting');
  const nextWaiting = schedule.appointments.find((appt) => appt.status === 'waiting');

  const items: DoctorNotification[] = [];

  if (nextWaiting) {
    items.push({
      id: 'notif-waiting-next',
      type: 'appointment',
      title: 'Bệnh nhân chờ khám tiếp theo',
      message: `${nextWaiting.patientName} — ${nextWaiting.time} · ${nextWaiting.department}`,
      timeAgo: 'Vừa xong',
      href: nextWaiting.patientId ? DOCTOR_PATHS.record(nextWaiting.patientId) : DOCTOR_PATHS.schedule,
    });
  }

  if (waitingPatients.length > 0) {
    items.push({
      id: 'notif-waiting-queue',
      type: 'patient',
      title: `${waitingPatients.length} bệnh nhân trong hàng chờ`,
      message: `Ưu tiên hoàn tất hồ sơ #11–#${10 + waitingPatients.length} trước khi gọi BN tiếp theo.`,
      timeAgo: '5 phút trước',
      href: DOCTOR_PATHS.records,
    });
  }

  const confirmedCount = schedule.statusCounts.confirmed;
  if (confirmedCount > 0) {
    items.push({
      id: 'notif-confirmed-today',
      type: 'appointment',
      title: `${confirmedCount} lịch đã xác nhận hôm nay`,
      message: schedule.alertNote,
      timeAgo: '30 phút trước',
      href: DOCTOR_PATHS.schedule,
    });
  }

  items.push({
    id: 'notif-messages',
    type: 'message',
    title: '5 tin nhắn mới từ bệnh nhân',
    message: 'Có câu hỏi về kết quả xét nghiệm và tái khám cần phản hồi.',
    timeAgo: '1 giờ trước',
    href: DOCTOR_PATHS.settings,
  });

  items.push({
    id: 'notif-system-sync',
    type: 'system',
    title: 'Đồng bộ lịch khám thành công',
    message: 'Dữ liệu lịch hôm nay đã được cập nhật với hồ sơ bệnh án.',
    timeAgo: '2 giờ trước',
    href: DOCTOR_PATHS.schedule,
  });

  return items;
};
