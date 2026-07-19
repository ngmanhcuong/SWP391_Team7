const mongoose = require('mongoose');

// Đánh giá dịch vụ sau khám
const reviewSchema = new mongoose.Schema({
  patientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  visit: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit', default: null },
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', default: null },
  doctorName: { type: String, required: true },
  specialtyName: { type: String, default: '' },
  facility: { type: String, default: 'Phòng khám Medicare' },
  visitDate: { type: Date, default: null },
  overallRating: { type: Number, required: true, min: 1, max: 5 },
  doctorRating: { type: Number, default: 0 },
  facilityRating: { type: Number, default: 0 },
  comment: { type: String, default: '' },
  tags: { type: [String], default: [] },
  isAnonymous: { type: Boolean, default: false },
  status: { type: String, enum: ['visible', 'hidden'], default: 'visible', index: true },
  submittedAt: { type: Date, default: Date.now },
  isSeed: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('Review', reviewSchema);
