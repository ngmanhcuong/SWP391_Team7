import { RoomKey } from './types';

// ─────────────────────────────────────────────────────────────
// Nguồn dữ liệu duy nhất cho phòng khám của lễ tân.
// Bệnh viện có 4 khoa, mỗi khoa 2 phòng khám → tổng 8 phòng,
// mỗi phòng cố định 1 bác sĩ phụ trách.
// Mọi trang lễ tân (hàng chờ, tiếp đón, lịch hẹn, dashboard)
// đều phải lấy dữ liệu khoa/phòng/bác sĩ từ file này.
// (Backend mirror file này tại receptionistController.ROOM_DIRECTORY)
// ─────────────────────────────────────────────────────────────

export interface ClinicRoom {
  key: RoomKey;
  label: string;
  department: string;
  doctor: string;
}

export const CLINIC_ROOMS: ClinicRoom[] = [
  { key: 'P101', label: 'Phòng 101', department: 'Khoa Nội', doctor: 'BS. Phan Minh Hưng' },
  { key: 'P102', label: 'Phòng 102', department: 'Khoa Nội', doctor: 'BS. Lê Minh Hoàng' },
  { key: 'P201', label: 'Phòng 201', department: 'Khoa Ngoại', doctor: 'BS. Lê Quang' },
  { key: 'P202', label: 'Phòng 202', department: 'Khoa Ngoại', doctor: 'BS. Đặng Quốc Anh' },
  { key: 'P301', label: 'Phòng 301', department: 'Khoa Sản', doctor: 'BS. Nguyễn Lan Anh' },
  { key: 'P302', label: 'Phòng 302', department: 'Khoa Sản', doctor: 'BS. Nguyễn Thu Thủy' },
  { key: 'P401', label: 'Phòng 401', department: 'Khoa Nhi', doctor: 'BS. Trần Thu Hà' },
  { key: 'P402', label: 'Phòng 402', department: 'Khoa Nhi', doctor: 'BS. Vũ Hà Phương' },
];

export const CLINIC_DEPARTMENTS: string[] = Array.from(
  new Set(CLINIC_ROOMS.map((room) => room.department)),
);

export const CLINIC_DOCTORS: string[] = CLINIC_ROOMS.map((room) => room.doctor);

// Dịch vụ khám tương ứng từng khoa.
export const DEPARTMENT_SERVICES: Record<string, string[]> = {
  'Khoa Nội': ['Khám nội tổng quát', 'Khám tim mạch', 'Tư vấn nội tiết'],
  'Khoa Ngoại': ['Khám ngoại tổng quát', 'Tiểu phẫu', 'Khám chấn thương'],
  'Khoa Sản': ['Khám phụ khoa', 'Siêu âm thai', 'Tư vấn tiền sản'],
  'Khoa Nhi': ['Khám nhi tổng quát', 'Tiêm chủng', 'Tư vấn dinh dưỡng'],
};

export const getRoomByKey = (key: RoomKey): ClinicRoom | undefined =>
  CLINIC_ROOMS.find((room) => room.key === key);

export const getDoctorsByDepartment = (department: string): string[] =>
  CLINIC_ROOMS.filter((room) => room.department === department).map((room) => room.doctor);

export const getDepartmentByDoctor = (doctor: string): string | undefined =>
  CLINIC_ROOMS.find((room) => room.doctor === doctor)?.department;

export const getServicesByDepartment = (department: string): string[] =>
  DEPARTMENT_SERVICES[department] ?? [];
