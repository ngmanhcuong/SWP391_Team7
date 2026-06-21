const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, default: '' },
  duration: { type: String, default: '' },
  status: { type: String, enum: ['active', 'completed'], default: 'completed' },
}, { _id: false });

// Lần khám đã hoàn tất của bệnh nhân (kèm đơn thuốc)
const visitSchema = new mongoose.Schema({
  patientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
  doctorName: { type: String, required: true },
  specialty: { type: String, required: true },
  facility: { type: String, default: 'Phòng khám Medicare' },
  date: { type: Date, required: true },
  diagnosis: { type: String, default: '' },
  symptoms: { type: String, default: '' },
  treatment: { type: String, default: '' },
  status: { type: String, enum: ['completed', 'ongoing'], default: 'completed' },
  prescriptions: { type: [prescriptionSchema], default: [] },
  isSeed: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('Visit', visitSchema);
