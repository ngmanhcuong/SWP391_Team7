const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, minlength: 8, select: false },
  phone: { type: String, trim: true },
  avatar: { type: String, default: null },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: { type: String, trim: true },
  nationalId: { type: String, trim: true },
  emergencyPhone: { type: String, trim: true },
  occupation: { type: String, trim: true },
  bio: { type: String, trim: true },
  height: { type: Number, min: 0 },
  weight: { type: Number, min: 0 },
  isEmailVerified: { type: Boolean, default: false },
  emailVerifyToken: { type: String },
  emailVerifyExpires: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  googleId: { type: String, sparse: true },
  googleAccessToken: { type: String, select: false },
  refreshToken: { type: String, select: false },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  role: { type: String, enum: ['patient', 'doctor', 'receptionist', 'admin'], default: 'patient' },
  healthScore: { type: Number, default: 85 },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function() {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.refreshToken;
  delete obj.emailVerifyToken;
  delete obj.passwordResetToken;
  delete obj.googleAccessToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
