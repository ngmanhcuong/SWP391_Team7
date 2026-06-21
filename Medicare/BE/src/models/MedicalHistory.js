const mongoose = require('mongoose');

// Tiền sử bệnh / dị ứng / phẫu thuật / tiền sử gia đình
const medicalHistorySchema = new mongoose.Schema({
  patientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['allergy', 'chronic', 'surgery', 'family'], required: true },
  label: { type: String, required: true },
  detail: { type: String, default: '' },
  since: { type: String, default: '' },
  isSeed: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
