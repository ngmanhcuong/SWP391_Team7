const tokenService = require('../services/tokenService');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check cookie
    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Bạn chưa đăng nhập' });
    }

    const decoded = tokenService.verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Tài khoản đã bị vô hiệu hóa' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Phiên đăng nhập hết hạn', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
};

const requireEmailVerified = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Vui lòng xác thực email trước khi sử dụng tính năng này',
      code: 'EMAIL_NOT_VERIFIED',
    });
  }
  next();
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện hành động này' });
  }
  next();
};

module.exports = { protect, requireEmailVerified, restrictTo };
