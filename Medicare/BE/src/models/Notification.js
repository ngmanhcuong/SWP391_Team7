const mongoose = require('mongoose');

// Thông báo gửi tới người dùng (bệnh nhân)
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sourceKey: { type: String, trim: true, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: {
    type: String,
    enum: ['lab', 'appointment', 'system', 'payment', 'prescription', 'queue', 'patient'],
    default: 'system',
  },
  isUnread: { type: Boolean, default: true },
  action: {
    label: { type: String, default: '' },
    href: { type: String, default: '' },
  },
  isSeed: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

notificationSchema.index(
  { user: 1, sourceKey: 1 },
  {
    unique: true,
    partialFilterExpression: { sourceKey: { $type: 'string', $ne: '' } },
  },
);

module.exports = mongoose.model('Notification', notificationSchema);
