require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const keepEmail = 'adminmedicare@medicare.com';
  const oldAdminEmails = ['nguyen.thi.lan@medicare.vn', 'do.quang.huy@medicare.vn'];

  await User.updateMany(
    { email: { $in: oldAdminEmails } },
    { $set: { isActive: false, role: 'patient' } },
  );

  let admin = await User.findOne({ email: keepEmail });
  if (!admin) {
    admin = await User.create({
      fullName: 'Admin Medicare',
      email: keepEmail,
      phone: '0906112204',
      password: 'Medicare@123',
      role: 'admin',
      isEmailVerified: true,
      gender: 'other',
      address: '10 Dien Bien Phu, Phuong Da Kao, Quan 1, TP.HCM',
      occupation: 'Quan tri he thong',
    });
  } else {
    admin.fullName = 'Admin Medicare';
    admin.phone = '0906112204';
    admin.role = 'admin';
    admin.isActive = true;
    admin.isEmailVerified = true;
    admin.gender = 'other';
    admin.address = '10 Dien Bien Phu, Phuong Da Kao, Quan 1, TP.HCM';
    admin.occupation = 'Quan tri he thong';
    admin.password = 'Medicare@123';
    await admin.save();
  }

  const admins = await User.find({ role: 'admin' }).select('fullName email phone isActive').lean();
  console.log(JSON.stringify(admins, null, 2));

  await mongoose.connection.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
