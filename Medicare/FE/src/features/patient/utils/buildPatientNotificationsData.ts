import { User } from '../../../types';
import {
  NotificationStat,
  PatientNotification,
  PatientNotificationsData,
} from '../types';
import { getPendingAppointments } from './appointmentBookingStore';
import { buildPatientPaymentsData } from './buildPatientPaymentsData';
import { getReadNotificationIds } from './notificationReadStore';

const getFirstName = (fullName: string): string =>
  fullName.trim().split(/\s+/).slice(-1)[0] || fullName;

const hoursAgo = (hours: number): { createdAt: string; timeAgo: string } => {
  const createdAt = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  if (hours < 1) return { createdAt, timeAgo: 'Vừa xong' };
  if (hours < 24) return { createdAt, timeAgo: `${Math.round(hours)} giờ trước` };
  const days = Math.round(hours / 24);
  return { createdAt, timeAgo: `${days} ngày trước` };
};

const minutesAgo = (minutes: number): { createdAt: string; timeAgo: string } => {
  const createdAt = new Date(Date.now() - minutes * 60 * 1000).toISOString();
  if (minutes < 60) return { createdAt, timeAgo: `${minutes} phút trước` };
  return hoursAgo(minutes / 60);
};

const applyReadState = (notifications: PatientNotification[]): PatientNotification[] => {
  const readIds = getReadNotificationIds();
  return notifications.map((item) => ({
    ...item,
    isUnread: !readIds.has(item.id),
  }));
};

const buildPendingBookingNotifications = (user: User): PatientNotification[] => {
  const pending = getPendingAppointments().filter((item) => item.patientId === user.id);

  return pending.flatMap((booking) => {
    const items: PatientNotification[] = [];
    const submitted = minutesAgo(
      Math.max(5, Math.round((Date.now() - new Date(booking.submittedAt).getTime()) / 60000)),
    );

    if (booking.status === 'pending_reception_deposit' && !booking.receptionDepositConfirmed) {
      items.push({
        id: `booking-deposit-${booking.id}`,
        title: 'Đặt cọc đang chờ xác nhận',
        description: `Lễ tân đang xác nhận cọc ${booking.depositAmount.toLocaleString('vi-VN')} VND cho lịch ${booking.appointmentDate} lúc ${booking.appointmentTime} với ${booking.doctorName}.`,
        ...submitted,
        type: 'appointment',
        isUnread: true,
        action: { label: 'Xem lịch hẹn', href: '/patient/lich-hen' },
      });
    }

    if (booking.status === 'pending_doctor_confirm' && !booking.doctorConfirmed) {
      items.push({
        id: `booking-doctor-${booking.id}`,
        title: 'Bác sĩ đang xác nhận lịch khám',
        description: `${booking.doctorName} sẽ xác nhận lịch ${booking.specialtyName} vào ${booking.appointmentDate} lúc ${booking.appointmentTime}.`,
        ...minutesAgo(30),
        type: 'appointment',
        isUnread: true,
        action: { label: 'Theo dõi trạng thái', href: '/patient/lich-hen' },
      });
    }

    if (booking.status === 'confirmed') {
      items.push({
        id: `booking-confirmed-${booking.id}`,
        title: 'Lịch khám đã được xác nhận',
        description: `Bạn có lịch ${booking.specialtyName} với ${booking.doctorName} vào ${booking.appointmentDate} lúc ${booking.appointmentTime}. Mã tham chiếu ${booking.referenceCode}.`,
        ...hoursAgo(2),
        type: 'appointment',
        isUnread: true,
        action: { label: 'Xem chi tiết', href: '/patient/lich-hen' },
      });
    }

    return items;
  });
};

export const buildPatientNotificationsData = (user: User): PatientNotificationsData => {
  const firstName = getFirstName(user.fullName);
  const paymentData = buildPatientPaymentsData(user);
  const unpaidAmount = paymentData.totalUnpaid;

  const baseNotifications: PatientNotification[] = [
    {
      id: 'lab-blood-result',
      title: 'Kết quả xét nghiệm máu đã có',
      description: `${firstName} ơi, kết quả xét nghiệm máu tổng quát của bạn đã được cập nhật. Một số chỉ số cần theo dõi thêm.`,
      ...minutesAgo(10),
      type: 'lab',
      isUnread: true,
      action: { label: 'Xem kết quả', href: '/patient/ho-so?tab=labs' },
    },
    {
      id: 'appointment-reminder-today',
      title: 'Nhắc lịch khám hôm nay',
      description: 'Bạn có lịch kiểm tra tim mạch lúc 10:15 với BS. Trần Văn Hùng. Vui lòng đến trước 15 phút để check-in.',
      ...hoursAgo(1),
      type: 'appointment',
      isUnread: true,
      action: { label: 'Xem lịch hẹn', href: '/patient/lich-hen' },
    },
    {
      id: 'prescription-reminder',
      title: 'Nhắc uống thuốc tối nay',
      description: 'Paracetamol 500mg — 2 viên sau ăn tối lúc 20:00. Amoxicillin 250mg — 1 viên sau bữa tối.',
      ...hoursAgo(3),
      type: 'prescription',
      isUnread: false,
      action: { label: 'Xem đơn thuốc', href: '/patient/ho-so?tab=prescriptions' },
    },
    ...(unpaidAmount > 0
      ? [
          {
            id: 'payment-invoice',
            title: 'Hóa đơn khám chưa thanh toán',
            description: `Bạn còn ${unpaidAmount.toLocaleString('vi-VN')} VND cần thanh toán sau khám (đã trừ tiền cọc).`,
            ...hoursAgo(26),
            type: 'payment' as const,
            isUnread: true,
            action: { label: 'Thanh toán ngay', href: '/patient/thanh-toan?filter=unpaid' },
          },
        ]
      : []),
    {
      id: 'lab-pending',
      title: 'Xét nghiệm đang chờ kết quả',
      description: 'Kết quả siêu âm tim sẽ được cập nhật trong 1–2 ngày làm việc. Bạn sẽ nhận thông báo khi có kết quả.',
      ...hoursAgo(48),
      type: 'lab',
      isUnread: false,
      action: { label: 'Theo dõi xét nghiệm', href: '/patient/ho-so?tab=labs' },
    },
    {
      id: 'system-profile',
      title: 'Cập nhật hồ sơ sức khỏe',
      description: 'Hãy kiểm tra thông tin chiều cao, cân nặng và tiền sử dị ứng để bác sĩ có dữ liệu chính xác khi khám.',
      ...hoursAgo(72),
      type: 'system',
      isUnread: false,
      action: { label: 'Cập nhật hồ sơ', href: '/patient/benh-nhan' },
    },
    {
      id: 'appointment-followup',
      title: 'Đến hạn tái khám',
      description: 'Đã 3 tháng kể từ lần khám Nội tổng quát. Bạn nên đặt lịch tái khám để theo dõi sức khỏe định kỳ.',
      ...hoursAgo(120),
      type: 'appointment',
      isUnread: false,
      action: { label: 'Đặt lịch tái khám', href: '/patient/lich-hen' },
    },
  ];

  const pendingNotifications = buildPendingBookingNotifications(user);
  const merged = applyReadState(
    [...pendingNotifications, ...baseNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  const unreadCount = merged.filter((item) => item.isUnread).length;

  const countByType = (type: PatientNotification['type']) =>
    merged.filter((item) => item.type === type).length;

  const stats: NotificationStat[] = [
    {
      id: 'unread',
      label: 'Chưa đọc',
      value: unreadCount,
      filter: 'unread',
      icon: 'bell',
      iconBg: 'bg-[rgba(255,218,214,0.3)]',
    },
    {
      id: 'appointment',
      label: 'Lịch hẹn',
      value: countByType('appointment'),
      filter: 'appointment',
      icon: 'calendar',
      iconBg: 'bg-[rgba(0,82,204,0.1)]',
    },
    {
      id: 'lab',
      label: 'Xét nghiệm',
      value: countByType('lab'),
      filter: 'lab',
      icon: 'flask',
      iconBg: 'bg-[rgba(176,35,0,0.1)]',
    },
    {
      id: 'payment',
      label: 'Thanh toán',
      value: countByType('payment'),
      filter: 'payment',
      icon: 'receipt',
      iconBg: 'bg-[rgba(130,249,190,0.2)]',
    },
  ];

  return { notifications: merged, stats, unreadCount };
};

export const toDashboardNotifications = (
  data: PatientNotificationsData,
  limit = 3,
) =>
  data.notifications.slice(0, limit).map((item) => ({
    id: item.id,
    title: item.title,
    timeAgo: item.timeAgo,
    type: item.type === 'prescription' || item.type === 'payment' ? 'system' as const : item.type,
    isUnread: item.isUnread,
  }));
