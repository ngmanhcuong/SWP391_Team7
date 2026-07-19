require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const EMAIL_MAPPING = {
  'nguyen.van.an@medicare.vn': 'nguyen.van.an@medicare.com',
  'pham.thu.dung@medicare.vn': 'pham.thu.dung@medicare.com',
  'nguyen.thi.giang@medicare.vn': 'nguyen.thi.giang@medicare.com',
  'tran.anh.khoa@medicare.vn': 'tran.anh.khoa@medicare.com',
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

  const doctorUsers = await User.find({ role: 'doctor' })
    .select('fullName email role')
    .sort({ email: 1 })
    .lean();

  console.log(
    JSON.stringify(
      {
        migration: report,
        doctorEmails: doctorUsers.map((user) => ({
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        })),
      },
      null,
      2,
    ),
  );

  await mongoose.connection.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
