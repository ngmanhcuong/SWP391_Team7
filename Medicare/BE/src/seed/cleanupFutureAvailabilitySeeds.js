require('dotenv').config({ path: './Medicare/BE/.env' });
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const start = new Date('2026-07-20T00:00:00.000Z');
  const end = new Date('2026-07-21T23:59:59.999Z');

  const appointments = await Appointment.find({
    isSeed: true,
    source: 'patient',
    date: { $gte: start, $lte: end },
  }).select('_id code');

  const appointmentIds = appointments.map((item) => item._id);
  const appointmentCodes = appointments.map((item) => item.code);

  const deletedInvoices = await Invoice.deleteMany({
    $or: [
      { appointment: { $in: appointmentIds } },
      { bookingReferenceCode: { $in: appointmentCodes } },
    ],
  });

  const deletedAppointments = await Appointment.deleteMany({
    _id: { $in: appointmentIds },
  });

  console.log(
    JSON.stringify(
      {
        deletedAppointments: deletedAppointments.deletedCount || 0,
        deletedInvoices: deletedInvoices.deletedCount || 0,
      },
      null,
      2,
    ),
  );

  await mongoose.connection.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
