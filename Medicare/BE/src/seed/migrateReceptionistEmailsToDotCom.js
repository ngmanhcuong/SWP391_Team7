require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const EMAIL_MAPPING = {
  'truong.my.duyen@medicare.vn': 'truong.my.duyen@medicare.com',
  'pham.thu.ha@medicare.vn': 'pham.thu.ha@medicare.com',
  'le.hoang.minh@medicare.vn': 'le.hoang.minh@medicare.com',
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const report = [];

  for (const [oldEmail, newEmail] of Object.entries(EMAIL_MAPPING)) {
    const oldUser = await User.findOne({ email: oldEmail });
    const newUser = await User.findOne({ email: newEmail });

    if (oldUser && !newUser) {
      oldUser.email = newEmail;
      await oldUser.save();
      report.push({ from: oldEmail, to: newEmail, status: 'updated' });
      continue;
    }

    if (oldUser && newUser) {
      report.push({ from: oldEmail, to: newEmail, status: 'both-exist' });
      continue;
    }

    if (!oldUser && newUser) {
      report.push({ from: oldEmail, to: newEmail, status: 'already-migrated' });
      continue;
    }

    report.push({ from: oldEmail, to: newEmail, status: 'missing' });
  }

  const receptionists = await User.find({ role: 'receptionist' })
    .select('fullName email role')
    .sort({ email: 1 })
    .lean();

  console.log(JSON.stringify({ migration: report, receptionists }, null, 2));

  await mongoose.connection.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
