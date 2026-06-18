import { User } from '../../../types';

export interface DemoAccount {
  email: string;
  password: string;
  label: string;
  user: User;
}

const buildUser = (
  data: Pick<User, 'id' | 'email' | 'fullName' | 'role'> & Partial<User>,
): User => ({
  isEmailVerified: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  ...data,
});

/**
 * Tài khoản demo dùng khi chưa có backend/database.
 * Đăng nhập bằng các thông tin dưới đây sẽ tạo phiên ngay trên frontend.
 */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'admin@medicare.vn',
    password: 'Admin@123',
    label: 'Quản trị viên',
    user: buildUser({
      id: 'demo-admin',
      email: 'admin@medicare.vn',
      fullName: 'Quản trị viên',
      role: 'admin',
    }),
  },
  {
    email: 'doctor@medicare.vn',
    password: 'Doctor@123',
    label: 'Bác sĩ',
    user: buildUser({
      id: 'demo-doctor',
      email: 'doctor@medicare.vn',
      fullName: 'BS. Trần Văn Minh',
      role: 'doctor',
    }),
  },
  {
    email: 'receptionist@medicare.vn',
    password: 'Reception@123',
    label: 'Lễ tân',
    user: buildUser({
      id: 'demo-receptionist',
      email: 'receptionist@medicare.vn',
      fullName: 'Phạm Thu Hà',
      role: 'receptionist',
    }),
  },
  {
    email: 'patient@medicare.vn',
    password: 'Patient@123',
    label: 'Bệnh nhân',
    user: buildUser({
      id: 'demo-patient',
      email: 'patient@medicare.vn',
      fullName: 'Đỗ Quang Huy',
      role: 'patient',
    }),
  },
];

export const matchDemoAccount = (email: string, password: string): User | null => {
  const normalizedEmail = email.trim().toLowerCase();
  const account = DEMO_ACCOUNTS.find(
    (item) => item.email.toLowerCase() === normalizedEmail && item.password === password,
  );
  return account ? account.user : null;
};
