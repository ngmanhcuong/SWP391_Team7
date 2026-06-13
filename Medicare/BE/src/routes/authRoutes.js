const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const tokenService = require('../services/tokenService');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  message: { success: false, message: 'Quá nhiều lần thử đăng nhập, thử lại sau 15 phút' },
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Quá nhiều yêu cầu, thử lại sau 1 giờ' },
});

// Auth routes
router.post('/register', authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/login', loginLimiter, authController.login);
router.post('/forgot-password', forgotLimiter, authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);

// Google OAuth
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const googleConfigured = () =>
  process.env.GOOGLE_CLIENT_ID
  && process.env.GOOGLE_CLIENT_SECRET
  && !process.env.GOOGLE_CLIENT_ID.includes('your_google');

router.get('/google', (req, res, next) => {
  if (!googleConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Chưa cấu hình Google OAuth. Thêm GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET vào backend/.env',
    });
  }
  return passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${clientUrl}/dang-nhap?error=google_failed` }),
  async (req, res) => {
    try {
      const user = req.user;
      const accessToken = tokenService.generateAccessToken(user._id);
      const refreshToken = tokenService.generateRefreshToken(user._id);

      await User.findByIdAndUpdate(user._id, { refreshToken, lastLogin: new Date() });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      const redirectUrl = new URL('/auth/google/success', clientUrl);
      redirectUrl.searchParams.set('token', accessToken);
      redirectUrl.searchParams.set('refreshToken', refreshToken);
      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${clientUrl}/dang-nhap?error=server_error`);
    }
  }
);

module.exports = router;
