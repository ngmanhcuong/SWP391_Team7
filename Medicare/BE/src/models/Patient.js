const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  nationalId: { type: String, trim: true },
  dob: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  avatar: { type: String, default: null },
  insurance: {
    code: { type: String, trim: true, default: '' },
    expiry: { type: Date, default: null },
    place: { type: String, trim: true, default: '' },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

patientSchema.index({ fullName: 'text', phone: 'text', code: 'text' });

module.exports = mongoose.model('Patient', patientSchema);
