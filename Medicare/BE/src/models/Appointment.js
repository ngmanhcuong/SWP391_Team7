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
  // ── Lịch do bệnh nhân tự đặt (module Bệnh nhân) ──
  patientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  specialty: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialty', default: null },
  doctorRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
  symptoms: { type: String, trim: true, default: '' },
  additionalNotes: { type: String, trim: true, default: '' },
  consultationFee: { type: Number, default: 0 },
  depositAmount: { type: Number, default: 0 },
  source: { type: String, enum: ['reception', 'patient'], default: 'reception' },
  isSeed: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
module.exports.APPOINTMENT_STATUSES = APPOINTMENT_STATUSES;
