const User = require('../models/User');
const tokenService = require('../services/tokenService');
const emailService = require('../services/emailService');

const skipEmailVerification = () =>
  process.env.SKIP_EMAIL_VERIFICATION === 'true' || process.env.NODE_ENV !== 'production';

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();
const normalizePhone = (phone = '') => String(phone).trim();

const sendAuthResponse = (res, user, statusCode = 200) => {
  const accessToken = tokenService.generateAccessToken(user._id);
  const refreshToken = tokenService.generateRefreshToken(user._id);

  User.findByIdAndUpdate(user._id, { refreshToken, lastLogin: new Date() }).exec();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return res.status(statusCode).json({
    success: true,
    message: statusCode === 201 ? 'Đăng ký thành công' : 'Đăng nhập thành công',
    data: {
      user: user.toSafeObject ? user.toSafeObject() : user,
      accessToken,
      refreshToken,
    },
  });
};

const register = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    const normalizedFullName = String(fullName || '').trim();
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedFullName || !normalizedEmail || !normalizedPhone || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const existingUserByEmail = await User.findOne({ email: normalizedEmail });
    if (existingUserByEmail) {
      if (existingUserByEmail.googleId) {
        return res.status(409).json({
          success: false,
          message: 'Email này đã được liên kết với tài khoản Google. Vui lòng đăng nhập bằng Google hoặc dùng quên mật khẩu nếu đã tạo mật khẩu trước đó.',
        });
      }
      return res.status(409).json({ success: false, message: 'Email này đã được sử dụng' });
    }

    const existingUserByPhone = await User.findOne({ phone: normalizedPhone });
    if (existingUserByPhone) {
      return res.status(409).json({ success: false, message: 'Số điện thoại này đã được sử dụng' });
    }

    const skipVerify = skipEmailVerification();
    const userData = {
      fullName: normalizedFullName,
      email: normalizedEmail,
      phone: normalizedPhone,
      password,
      isEmailVerified: skipVerify,
    };

    let plainVerifyToken;
    if (!skipVerify) {
      plainVerifyToken = tokenService.generateSecureToken();
      userData.emailVerifyToken = tokenService.hashToken(plainVerifyToken);
      userData.emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    const user = await User.create(userData);

    if (!skipVerify) {
      try {
        await emailService.sendVerificationEmail(user, plainVerifyToken);
      } catch (emailError) {
        console.error('Email send error:', emailError.message);
      }

      return res.status(201).json({
        success: true,
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
        data: {
          user: user.toSafeObject(),
          requiresVerification: true,
        },
      });
    }

    return sendAuthResponse(res, user, 201);
  } catch (error) {
    console.error('Register error:', error);

    if (error && (error.code === 11000 || error.code === 11001)) {
      const duplicateField = error?.keyPattern ? Object.keys(error.keyPattern)[0] : '';
      if (duplicateField === 'phone') {
        return res.status(409).json({ success: false, message: 'Số điện thoại này đã được sử dụng' });
      }
      return res.status(409).json({ success: false, message: 'Email này đã được sử dụng' });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((item) => item.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    return res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ success: false, message: 'Token không hợp lệ' });

    const hashedToken = tokenService.hashToken(token);

    const user = await User.findOne({
      emailVerifyToken: hashedToken,
      emailVerifyExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Link xác thực không hợp lệ hoặc đã hết hạn' });
    }

    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();

    try {
      await emailService.sendWelcomeEmail(user);
    } catch (_) {}

    return res.status(200).json({ success: true, message: 'Xác thực email thành công! Bạn có thể đăng nhập ngay.' });
  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: normalizeEmail(email) });

    if (!user) return res.status(404).json({ success: false, message: 'Email không tồn tại' });
    if (user.isEmailVerified) return res.status(400).json({ success: false, message: 'Email đã được xác thực' });

    const verifyToken = tokenService.generateSecureToken();
    user.emailVerifyToken = tokenService.hashToken(verifyToken);
    user.emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await emailService.sendVerificationEmail(user, verifyToken);
    return res.status(200).json({ success: true, message: 'Email xác thực đã được gửi lại' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
    }

    const user = await User.findOne({ email: normalizeEmail(email) }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản này đăng nhập qua Google. Vui lòng sử dụng "Đăng nhập với Google".',
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa' });
    }

    if (!skipEmailVerification() && !user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Vui lòng xác thực email trước khi đăng nhập. Kiểm tra hộp thư hoặc dùng "Gửi lại email xác thực".',
        code: 'EMAIL_NOT_VERIFIED',
      });
    }

    if (skipEmailVerification() && !user.isEmailVerified) {
      user.isEmailVerified = true;
      user.emailVerifyToken = undefined;
      user.emailVerifyExpires = undefined;
      await user.save();
    }

    return sendAuthResponse(res, user);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: normalizeEmail(email) });

    if (!user) {
      return res.status(200).json({ success: true, message: 'Nếu email tồn tại, mã OTP đã được gửi' });
    }

    const otp = tokenService.generateOTP();
    user.passwordResetToken = tokenService.hashToken(otp);
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    emailService.sendPasswordResetOTP(user, otp).catch((emailError) => {
      console.error('Forgot password email error:', emailError.message);
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] Mã OTP đặt lại mật khẩu cho ${user.email}: ${otp}`);
    }

    return res.status(200).json({ success: true, message: 'Mã OTP đã được gửi tới email của bạn' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const code = String(otp || '').trim();

    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ success: false, message: 'Mã OTP phải gồm đúng 6 chữ số' });
    }

    const user = await User.findOne({ email: normalizeEmail(email) });

    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      return res.status(400).json({ success: false, message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
    }

    if (user.passwordResetExpires <= new Date()) {
      return res.status(400).json({ success: false, message: 'Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.' });
    }

    const hashedOtp = tokenService.hashToken(code);
    if (user.passwordResetToken !== hashedOtp) {
      return res.status(400).json({ success: false, message: 'Mã OTP không chính xác' });
    }

    const resetToken = tokenService.generateSecureToken();
    user.passwordResetToken = tokenService.hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    return res.status(200).json({ success: true, message: 'OTP hợp lệ', data: { resetToken } });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedToken = tokenService.hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'Không có refresh token' });

    const decoded = tokenService.verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'Refresh token không hợp lệ' });
    }

    const newAccessToken = tokenService.generateAccessToken(user._id);
    return res.status(200).json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Refresh token không hợp lệ hoặc hết hạn' });
  }
};

const logout = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }
    res.clearCookie('refreshToken');
    return res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({ success: true, data: { user: user.toSafeObject() } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  refreshToken,
  logout,
  getMe,
};
