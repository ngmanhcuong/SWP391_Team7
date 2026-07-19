export interface DemoAccount {
  email: string;
  password: string;
  label: string;
  role: 'admin' | 'doctor' | 'receptionist' | 'patient';
}

/**
 * Tài khoản mẫu để đăng nhập nhanh khi phát triển.
 * Các tài khoản này được seed sẵn ở backend (xem BE/src/config/seedDevUsers.js),
 * nên khi bấm đăng nhập nhanh sẽ đi qua API thật và nhận JWT hợp lệ -
 * dùng được với mọi tính năng cần xác thực (lễ tân, bác sĩ, ...).
 */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: 'nguyen.thi.lan@medicare.vn', password: 'Medicare@123', label: 'Quản trị viên', role: 'admin' },
  { email: 'nguyen.van.an@medicare.com', password: 'Medicare@123', label: 'Bác sĩ Tim mạch', role: 'doctor' },
  { email: 'truong.my.duyen@medicare.com', password: 'Medicare@123', label: 'Lễ tân', role: 'receptionist' },
  { email: 'nguyen.minh.khoi@example.com', password: 'Medicare@123', label: 'Bệnh nhân', role: 'patient' },
  { email: 'pham.thu.ha@medicare.com', password: 'Medicare@123', label: 'Lễ tân (Thu Hà)', role: 'receptionist' },
  { email: 'do.quang.huy@medicare.vn', password: 'Medicare@123', label: 'Quản trị vận hành', role: 'admin' },
  { email: 'pham.thu.dung@medicare.com', password: 'Medicare@123', label: 'Bác sĩ Cơ xương khớp', role: 'doctor' },
];
