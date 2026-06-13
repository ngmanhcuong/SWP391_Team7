const path = require('path');
const fs = require('fs');
const User = require('../models/User');

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({ success: true, data: { user: user.toSafeObject() } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const allowed = [
      'fullName', 'phone', 'dateOfBirth', 'gender', 'address',
      'nationalId', 'emergencyPhone', 'occupation', 'bio', 'height', 'weight',
    ];
    const set = {};
    const unset = {};

    allowed.forEach((field) => {
      if (req.body[field] === undefined) return;
      const value = req.body[field];

      if (value === '' || value === null) {
        if (field === 'fullName') {
          set.fullName = '';
        } else {
          unset[field] = '';
        }
        return;
      }

      if (field === 'height' || field === 'weight') {
        const num = Number(value);
        if (Number.isNaN(num)) return;
        set[field] = num;
        return;
      }

      set[field] = value;
    });

    if (set.dateOfBirth) {
      const parsed = new Date(set.dateOfBirth);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({ success: false, message: 'Ngày sinh không hợp lệ' });
      }
      set.dateOfBirth = parsed;
    }

    if (set.fullName !== undefined && !String(set.fullName).trim()) {
      return res.status(400).json({ success: false, message: 'Họ tên không được để trống' });
    }

    const updateOp = {};
    if (Object.keys(set).length) updateOp.$set = set;
    if (Object.keys(unset).length) updateOp.$unset = unset;

    if (!Object.keys(updateOp).length) {
      return res.status(400).json({ success: false, message: 'Không có thông tin để cập nhật' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateOp,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: { user: user.toSafeObject() },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// POST /api/profile/avatar — upload/change avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn file ảnh' });
    }

    // Delete old avatar if exists (not Google avatar)
    const currentUser = await User.findById(req.user._id);
    if (currentUser.avatar && !currentUser.avatar.startsWith('http')) {
      const oldPath = path.join(process.cwd(), 'uploads', 'avatars', currentUser.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.file.filename },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Cập nhật ảnh đại diện thành công',
      data: {
        avatar: req.file.filename,
        avatarUrl: `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`,
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi upload ảnh' });
  }
};

// DELETE /api/profile/avatar
const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.avatar && !user.avatar.startsWith('http')) {
      const filePath = path.join(process.cwd(), 'uploads', 'avatars', user.avatar);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    user.avatar = null;
    await user.save();

    return res.status(200).json({ success: true, message: 'Đã xóa ảnh đại diện' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// PUT /api/profile/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || String(newPassword).length < 8) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới ít nhất 8 ký tự' });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu hiện tại' });
      }
      const isValid = await user.comparePassword(currentPassword);
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác' });
      }
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getProfile, updateProfile, uploadAvatar, deleteAvatar, changePassword };
