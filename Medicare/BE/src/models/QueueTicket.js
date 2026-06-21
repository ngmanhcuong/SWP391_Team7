const mongoose = require('mongoose');

const QUEUE_STATUSES = ['waiting', 'in-progress', 'skipped', 'done'];
const ROOM_KEYS = ['P101', 'P102', 'P201', 'P202', 'P301', 'P302', 'P401', 'P402'];

const queueTicketSchema = new mongoose.Schema({
  ticket: { type: Number, required: true, unique: true },
  patientName: { type: String, required: true, trim: true },
  code: { type: String, trim: true, default: '' },
  doctor: { type: String, trim: true, default: '' },
  room: { type: String, trim: true, default: '' },
  department: { type: String, trim: true, default: '' },
  roomKey: { type: String, enum: ROOM_KEYS, default: 'P101' },
  status: { type: String, enum: QUEUE_STATUSES, default: 'waiting' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
  calledAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Minutes the patient has been waiting (since the ticket was created).
queueTicketSchema.virtual('waitMinutes').get(function waitMinutes() {
  const ref = this.calledAt || new Date();
  const created = this.createdAt || ref;
  return Math.max(0, Math.round((ref.getTime() - created.getTime()) / 60000));
});

module.exports = mongoose.model('QueueTicket', queueTicketSchema);
module.exports.QUEUE_STATUSES = QUEUE_STATUSES;
module.exports.ROOM_KEYS = ROOM_KEYS;
