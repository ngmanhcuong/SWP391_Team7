import {
  ScheduleTimeFilter,
  TodayAppointment,
  TodayAppointmentStatus,
  TodayScheduleData,
} from '../types';
import { resolveDoctorPatientId } from './doctorPatientRegistry';
import {
  buildScheduleStats,
  buildStatusCounts,
  filterAppointmentsByStatus,
  formatVietnameseDate,
  sortAppointmentsByTime,
} from './scheduleUtils';

const createAppointment = (
  appointment: Omit<TodayAppointment, 'patientId'> & { patientId?: string },
): TodayAppointment => ({
  ...appointment,
  patientId: resolveDoctorPatientId(appointment.patientId, appointment.patientName),
});

const APPOINTMENTS: TodayAppointment[] = sortAppointmentsByTime([
  createAppointment({
    id: '1',
    time: '08:00',
    patientName: 'Phan Văn Khoa',
    patientNote: 'Khám định kỳ, theo dõi huyết áp',
    department: 'Nội tiết',
    type: 'followup',
    status: 'waiting',
    timeSlot: 'morning',
  }),
  createAppointment({
    id: '2',
    time: '08:30',
    patientName: 'Trần Văn Phong',
    patientNote: 'Đau thắt ngực, khó thở khi gắng sức',
    department: 'Nội tim mạch',
    type: 'new',
    status: 'waiting',
    timeSlot: 'morning',
  }),
  createAppointment({
    id: '3',
    time: '09:15',
    patientName: 'Nguyễn Thị Lan',
    patientNote: 'Kiểm tra lại sau điều trị 2 tuần',
    department: 'Ngoại tổng quát',
    type: 'followup',
    status: 'confirmed',
    timeSlot: 'morning',
  }),
  createAppointment({
    id: '4',
    time: '09:45',
    patientName: 'Lê Minh Tuấn',
    patientNote: 'Sốt nhẹ, ho khan 3 ngày',
    department: 'Nội tổng quát',
    type: 'new',
    status: 'confirmed',
    timeSlot: 'morning',
  }),
  createAppointment({
    id: '5',
    time: '10:00',
    patientName: 'Phạm Thị Hoa',
    patientNote: 'Tái khám tiểu đường',
    department: 'Nội tiết',
    type: 'followup',
    status: 'confirmed',
    timeSlot: 'morning',
  }),
  createAppointment({
    id: '6',
    time: '10:30',
    patientName: 'Hoàng Văn Đức',
    patientNote: 'Đau bụng vùng thượng vị',
    department: 'Nội tổng quát',
    type: 'new',
    status: 'confirmed',
    timeSlot: 'morning',
  }),
  createAppointment({
    id: '7',
    time: '11:00',
    patientName: 'Võ Thị Mai',
    department: 'Nội tim mạch',
    type: 'followup',
    status: 'confirmed',
    timeSlot: 'morning',
  }),
  createAppointment({
    id: '8',
    time: '11:30',
    patientName: 'Đặng Văn Hùng',
    patientNote: 'Khám định kỳ 6 tháng',
    department: 'Nội tổng quát',
    type: 'followup',
    status: 'waiting',
    timeSlot: 'morning',
  }),
  createAppointment({
    id: '9',
    time: '13:30',
    patientName: 'Bùi Thị Ngọc',
    patientNote: 'Theo dõi huyết áp',
    department: 'Nội tim mạch',
    type: 'followup',
    status: 'confirmed',
    timeSlot: 'afternoon',
  }),
  createAppointment({
    id: '10',
    time: '14:00',
    patientName: 'Ngô Văn Thành',
    patientNote: 'Đau lưng mạn tính',
    department: 'Ngoại tổng quát',
    type: 'new',
    status: 'confirmed',
    timeSlot: 'afternoon',
  }),
  createAppointment({
    id: '11',
    time: '15:30',
    patientName: 'Đinh Thị Thu',
    department: 'Nội tiết',
    type: 'followup',
    status: 'completed',
    timeSlot: 'afternoon',
  }),
  createAppointment({
    id: '12',
    time: '16:00',
    patientName: 'Trương Thị Hằng',
    patientNote: 'Hủy do bận công tác',
    department: 'Nội tổng quát',
    type: 'new',
    status: 'cancelled',
    timeSlot: 'afternoon',
  }),
]);

export const getDoctorScheduleAppointments = (): TodayAppointment[] => APPOINTMENTS;

export const buildDoctorScheduleData = (): TodayScheduleData => {
  const today = new Date();
  const waiting = APPOINTMENTS.filter((appt) => appt.status === 'waiting');

  return {
    dateLabel: formatVietnameseDate(today),
    appointments: APPOINTMENTS,
    stats: buildScheduleStats(APPOINTMENTS),
    alertNote:
      waiting.length > 0
        ? `Có ${waiting.length} bệnh nhân đang chờ khám (#11–#${10 + waiting.length}). Ưu tiên hoàn tất hồ sơ trước khi gọi bệnh nhân tiếp theo.`
        : 'Không có bệnh nhân chờ khám. Bạn có thể xem lại các ca đã hoàn thành trong ngày.',
    statusCounts: buildStatusCounts(APPOINTMENTS),
  };
};

export const filterAppointments = (
  appointments: TodayAppointment[],
  status: TodayAppointmentStatus | 'all',
  timeSlot: ScheduleTimeFilter,
): TodayAppointment[] =>
  sortAppointmentsByTime(
    filterAppointmentsByStatus(appointments, status).filter((appt) => {
      const timeMatch = timeSlot === 'all' || appt.timeSlot === timeSlot;
      return timeMatch;
    }),
  );
