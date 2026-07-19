require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const doctor = await Doctor.findOne({ name: 'BSCKI. Hoàng Văn Đức' }).select('_id name').lean();
  if (!doctor) {
    throw new Error('Doctor not found');
  }

  const targetDate = new Date('2026-07-19T00:00:00+07:00');

  const result = await Appointment.updateMany(
    {
      doctorRef: doctor._id,
      code: { $in: ['#LH-9804', '#LH-9805'] },
    },
    {
      $set: { date: targetDate },
    },
  );

  const appointments = await Appointment.find({ doctorRef: doctor._id })
    .select('code doctor date time status patientName')
    .sort({ date: 1, time: 1 })
    .lean();

  console.log(
    JSON.stringify(
      {
        updated: result.modifiedCount,
        appointments: appointments.map((item) => ({
          code: item.code,
          date: item.date,
          time: item.time,
          status: item.status,
          patientName: item.patientName,
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
