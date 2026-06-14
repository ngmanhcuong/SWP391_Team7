export const loginValidation = {
  email: {
    required: 'Email là bắt buộc',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email không hợp lệ',
    },
  },
  password: {
    required: 'Mật khẩu là bắt buộc',
    minLength: {
      value: 6,
      message: 'Mật khẩu tối thiểu 6 ký tự',
    },
  },
};
