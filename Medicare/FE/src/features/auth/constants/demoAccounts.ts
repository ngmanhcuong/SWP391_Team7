export interface DemoAccount {
  email: string;
  password: string;
  label: string;
  role: 'admin' | 'doctor' | 'receptionist' | 'patient';
}

/**
 * Tài khoản mẫu để đăng nhập nhanh khi phát triển.
 * Các tài khoản này được seed sẵn ở backend (xem BE/src/config/seedDevUsers.js),
 * nên khi bấm đăng nhập nhanh sẽ đi qua API thật và nhận JWT hợp lệ —
 * dùng được với mọi tính năng cần xác thực (lễ tân, bác sĩ, ...).
 */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: 'admin@test.com', password: 'Password123', label: 'Quản trị viên', role: 'admin' },
  { email: 'doctor@test.com', password: 'Password123', label: 'Bác sĩ', role: 'doctor' },
  { email: 'receptionist@test.com', password: 'Password123', label: 'Lễ tân', role: 'receptionist' },
  { email: 'patient@test.com', password: 'Password123', label: 'Bệnh nhân', role: 'patient' },
  { email: 'letan1@medicare.com', password: 'Password123', label: 'Lễ tân (Thu Hà)', role: 'receptionist' },
  { email: 'letan2@medicare.com', password: 'Password123', label: 'Lễ tân (Văn Đại)', role: 'receptionist' },
  { email: 'admin1@medicare.com', password: 'Password123', label: 'Quản trị (Hoàng)', role: 'admin' },
];
