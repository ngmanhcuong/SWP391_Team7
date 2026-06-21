const mongoose = require('mongoose');

// Chuyên khoa của phòng khám (thay cho clinicSpecialties.ts + consultationFees.ts ở FE)
const specialtySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  departmentLabel: { type: String, required: true, trim: true },
  consultationFee: { type: Number, required: true },
  depositRate: { type: Number, default: 0.3 },
  iconKey: { type: String, default: '' },
  description: { type: String, default: '' },
  color: { type: String, default: 'from-blue-500 to-blue-700' },
  doctorCount: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('Specialty', specialtySchema);
