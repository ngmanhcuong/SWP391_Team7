const mongoose = require('mongoose');

const APPOINTMENT_STATUSES = ['pending', 'confirmed', 'cancelled', 'checked-in', 'done'];

const appointmentSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  // Denormalized snapshot so the list renders without populate.
  patientName: { type: String, required: true, trim: true },
  patientCode: { type: String, trim: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  doctor: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  room: { type: String, trim: true, default: '' },
  date: { type: Date, required: true },
  time: { type: String, required: true, trim: true },
  service: { type: String, trim: true, default: 'Khám tổng quát' },
  insured: { type: Boolean, default: false },
  status: { type: String, enum: APPOINTMENT_STATUSES, default: 'pending' },
  checkedInAt: { type: Date, default: null },
  queueTicket: { type: Number, default: null },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
module.exports.APPOINTMENT_STATUSES = APPOINTMENT_STATUSES;
