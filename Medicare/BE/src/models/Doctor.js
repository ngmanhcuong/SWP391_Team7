const mongoose = require('mongoose');

const DOCTOR_TAG_VARIANTS = ['expert', 'phd', 'elite', 'potential'];

// Hồ sơ bác sĩ trong danh bạ đặt lịch (thay cho bookingDoctors.ts ở FE)
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specialty: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialty', required: true },
  specialtySlug: { type: String, required: true, trim: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 0 },
  experienceYears: { type: Number, default: 5 },
  tag: {
    label: { type: String, default: '' },
    variant: { type: String, enum: DOCTOR_TAG_VARIANTS, default: 'potential' },
  },
  isAvailable: { type: Boolean, default: true },
  nextAvailableSlot: { type: String, default: null },
  roomCode: { type: String, default: null, trim: true },
  roomName: { type: String, default: null, trim: true },
  avatarBg: { type: String, default: 'rgba(218,226,255,0.3)' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('Doctor', doctorSchema);
module.exports.DOCTOR_TAG_VARIANTS = DOCTOR_TAG_VARIANTS;
