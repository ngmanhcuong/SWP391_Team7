const mongoose = require('mongoose');

// Kết quả xét nghiệm / chẩn đoán hình ảnh
const labResultSchema = new mongoose.Schema({
  patientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  visit: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit', default: null },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  doctorName: { type: String, default: '' },
  status: { type: String, enum: ['normal', 'abnormal', 'pending'], default: 'pending' },
  summary: { type: String, default: '' },
  isSeed: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('LabResult', labResultSchema);
