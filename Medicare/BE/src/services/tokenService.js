const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const tokenService = {
  // Generate access token (short-lived)
  generateAccessToken: (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  },

  // Generate refresh token (long-lived)
  generateRefreshToken: (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh', {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    });
  },

  // Verify access token
  verifyAccessToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  },

  // Verify refresh token
  verifyRefreshToken: (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh');
  },

  // Generate random secure token (for email verify, password reset)
  generateSecureToken: () => {
    return crypto.randomBytes(32).toString('hex');
  },

  // Generate 6-digit OTP
  generateOTP: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Hash a token for storage (don't store raw tokens in DB)
  hashToken: (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
  },
};

module.exports = tokenService;
