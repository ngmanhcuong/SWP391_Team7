const User = require('../models/User');

const DEV_USERS = [
  {
    fullName: 'Bác sĩ Trực',
    email: 'doctor@test.com',
    phone: '0901000001',
    password: 'Password123',
    role: 'doctor',
    occupation: 'Khoa Nội tổng quát',
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
];

const seedDevUsers = async () => {
  if (process.env.NODE_ENV === 'production' || process.env.SEED_DEV_USERS === 'false') {
    return;
  }

  for (const data of DEV_USERS) {
    await User.deleteOne({ email: data.email.toLowerCase() });
    await User.create({ ...data, email: data.email.toLowerCase() });
    console.log(`🌱 Seeded dev user: ${data.email} (${data.role})`);
  }
};

module.exports = seedDevUsers;
