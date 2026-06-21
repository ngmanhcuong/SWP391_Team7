const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['charge', 'credit'], default: 'charge' },
}, { _id: false });

// Hóa đơn khám (cọc + phần còn lại sau khám)
const invoiceSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  patientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
  bookingReferenceCode: { type: String, default: '' },
  doctorName: { type: String, required: true },
  specialtyName: { type: String, required: true },
  facility: { type: String, default: 'Phòng khám Medicare' },
  visitDate: { type: Date, required: true },
  lineItems: { type: [lineItemSchema], default: [] },
  depositAmount: { type: Number, default: 0 },
  depositPaymentMethod: { type: String, enum: ['vnpay', 'momo', 'banking', ''], default: '' },
  depositPaidAt: { type: Date, default: null },
  estimatedRemaining: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['awaiting_visit', 'pending_payment', 'paid'],
    default: 'awaiting_visit',
  },
  paymentMethod: { type: String, enum: ['vnpay', 'momo', 'banking', ''], default: '' },
  paidAt: { type: Date, default: null },
  dueDate: { type: Date, default: null },
  isSeed: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('Invoice', invoiceSchema);
