/**
 * Tạo (hoặc nâng cấp) tài khoản admin.
 *
 * Cách dùng:
 *   node src/seed/createAdmin.js
 *   node src/seed/createAdmin.js --email=admin@medicare.vn --password=Admin@123 --name="Quản trị viên"
 *
 * Hoặc qua biến môi trường: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 *
 * Nếu email đã tồn tại: script sẽ nâng quyền tài khoản đó lên admin
 * và đặt lại mật khẩu theo giá trị truyền vào.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const getArg = (name) => {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
};

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || getArg('email') || 'admin@medicare.vn')
  .toLowerCase()
  .trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || getArg('password') || 'Admin@123';
const ADMIN_NAME = process.env.ADMIN_NAME || getArg('name') || 'Quản trị viên';

const run = async () => {
  if (ADMIN_PASSWORD.length < 8) {
    console.error('❌ Mật khẩu admin phải có ít nhất 8 ký tự.');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/medicare_ai';

  try {
    await mongoose.connect(uri);
    console.log(`✅ Đã kết nối MongoDB: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ Không kết nối được MongoDB:', error.message);
    console.error('   Kiểm tra MONGODB_URI trong file .env hoặc MongoDB đã chạy chưa.');
    process.exit(1);
  }

  try {
    let admin = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

    if (admin) {
      admin.role = 'admin';
      admin.fullName = ADMIN_NAME;
      admin.isActive = true;
      admin.isEmailVerified = true;
      admin.password = ADMIN_PASSWORD;
      await admin.save();
      console.log('♻️  Đã nâng cấp tài khoản hiện có lên quyền ADMIN.');
    } else {
      admin = await User.create({
        fullName: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
      });
      console.log('✨ Đã tạo tài khoản ADMIN mới.');
    }

    console.log('\n──────── THÔNG TIN ĐĂNG NHẬP ADMIN ────────');
    console.log(`  Email   : ${ADMIN_EMAIL}`);
    console.log(`  Mật khẩu: ${ADMIN_PASSWORD}`);
    console.log(`  Vai trò : admin`);
    console.log('───────────────────────────────────────────\n');
    console.log('⚠️  Hãy đổi mật khẩu sau lần đăng nhập đầu tiên.');
  } catch (error) {
    console.error('❌ Lỗi khi tạo admin:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
