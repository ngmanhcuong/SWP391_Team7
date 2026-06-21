const User = require('../models/User');

// Tài khoản seed dùng cho phát triển — giữ _id ổn định qua mỗi lần restart.
const DEV_USERS = [
  {
    fullName: 'Bác sĩ Trực',
    email: 'doctor@test.com',
    phone: '0901000001',
    password: 'Password123',
    role: 'doctor',
    occupation: 'Tim mạch',
    isEmailVerified: true,
  },
  {
    fullName: 'Nguyễn Văn Bệnh',
    email: 'patient@test.com',
    phone: '0901000002',
    password: 'Password123',
    role: 'patient',
    isEmailVerified: true,
  },
  {
    fullName: 'Nguyễn Thị Tâm An',
    email: 'receptionist@test.com',
    phone: '0901000003',
    password: 'Password123',
    role: 'receptionist',
    isEmailVerified: true,
  },
  {
    fullName: 'Quản trị viên',
    email: 'admin@test.com',
    phone: '0901000004',
    password: 'Password123',
    role: 'admin',
    isEmailVerified: true,
  },
  {
    fullName: 'Trần Thị Thu Hà',
    email: 'letan1@medicare.com',
    phone: '0901000005',
    password: 'Password123',
    role: 'receptionist',
    isEmailVerified: true,
  },
  {
    fullName: 'Phạm Văn Đại',
    email: 'letan2@medicare.com',
    phone: '0901000006',
    password: 'Password123',
    role: 'receptionist',
    isEmailVerified: true,
  },
  {
    fullName: 'Lê Hoàng Quản Trị',
    email: 'admin1@medicare.com',
    phone: '0901000007',
    password: 'Password123',
    role: 'admin',
    isEmailVerified: true,
  },
];

const seedDevUsers = async () => {
  if (process.env.NODE_ENV === 'production' || process.env.SEED_DEV_USERS === 'false') {
    return;
  }

  for (const data of DEV_USERS) {
    const email = data.email.toLowerCase();
    const existing = await User.findOne({ email });

    if (!existing) {
      // Tạo mới: pre('save') hook sẽ tự hash mật khẩu.
      await User.create({ ...data, email });
      console.log(`🌱 Seeded dev user: ${email} (${data.role})`);
      continue;
    }

    // Giữ nguyên _id để dữ liệu liên kết (lịch hẹn, hóa đơn...) không bị mồ côi sau mỗi lần
    // restart. Vẫn cập nhật thông tin + reset mật khẩu qua save() để hook hash chạy.
    existing.fullName = data.fullName;
    existing.phone = data.phone;
    existing.role = data.role;
    existing.occupation = data.occupation;
    existing.isEmailVerified = data.isEmailVerified;
    existing.password = data.password;
    await existing.save();
    console.log(`🌱 Refreshed dev user: ${email} (${data.role})`);
  }
};

module.exports = seedDevUsers;
