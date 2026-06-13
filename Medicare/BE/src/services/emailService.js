const nodemailer = require('nodemailer');

const EMAIL_TIMEOUT_MS = 12000;

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: EMAIL_TIMEOUT_MS,
    greetingTimeout: EMAIL_TIMEOUT_MS,
    socketTimeout: EMAIL_TIMEOUT_MS,
  });
};

const sendMailWithTimeout = async (mailOptions) => {
  const transporter = createTransporter();
  const sendPromise = transporter.sendMail(mailOptions);
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Gửi email quá thời gian chờ')), EMAIL_TIMEOUT_MS);
  });
  return Promise.race([sendPromise, timeoutPromise]);
};

const emailTemplate = (title, content) => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background: #f4f6f9; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a56db, #0d3b99); padding: 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 20px; font-weight: 700; }
    .header p { color: #bcd; margin: 4px 0 0; font-size: 13px; }
    .body { padding: 32px; color: #374151; }
    .body h2 { font-size: 22px; color: #111827; margin: 0 0 12px; }
    .body p { font-size: 15px; line-height: 1.7; color: #6b7280; margin: 0 0 20px; }
    .btn { display: inline-block; background: #1a56db; color: #fff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px; }
    .code { display: inline-block; background: #f0f4ff; border: 2px dashed #1a56db; color: #1a56db; font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 16px 32px; border-radius: 12px; margin: 8px 0 24px; }
    .footer { padding: 20px 32px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
    .expire { color: #ef4444; font-size: 13px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>✚ MediCare AI Clinic</h1>
      <p>Hệ thống phòng khám tích hợp công nghệ thông minh</p>
    </div>
    <div class="body">
      <h2>${title}</h2>
      ${content}
    </div>
    <div class="footer">
      © 2024 MediCare AI Clinic · Email này được gửi tự động, vui lòng không reply.
    </div>
  </div>
</body>
</html>`;

const emailService = {
  sendVerificationEmail: async (user, token) => {
    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/xac-thuc-email?token=${token}`;
    const content = `
      <p>Xin chào <strong>${user.fullName}</strong>,</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản tại MediCare AI Clinic. Vui lòng xác thực địa chỉ email của bạn bằng cách nhấn nút bên dưới:</p>
      <div style="text-align:center;margin:24px 0">
        <a href="${verifyUrl}" class="btn">✉ Xác thực Email ngay</a>
      </div>
      <p>Hoặc copy đường link: <br><small style="color:#6b7280;word-break:break-all">${verifyUrl}</small></p>
      <p class="expire">⏰ Link xác thực sẽ hết hạn sau <strong>24 giờ</strong>.</p>
    `;
    await sendMailWithTimeout({
      from: process.env.EMAIL_FROM || 'MediCare AI Clinic <noreply@medicare.vn>',
      to: user.email,
      subject: '✉ Xác thực địa chỉ email – MediCare AI Clinic',
      html: emailTemplate('Xác thực địa chỉ Email', content),
    });
  },

  sendPasswordResetOTP: async (user, otp) => {
    const content = `
      <p>Xin chào <strong>${user.fullName}</strong>,</p>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Đây là mã OTP của bạn:</p>
      <div style="text-align:center;margin:24px 0">
        <div class="code">${otp}</div>
      </div>
      <p class="expire">⏰ Mã OTP hết hạn sau <strong>30 phút</strong>. Không chia sẻ mã này với bất kỳ ai.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
    `;
    await sendMailWithTimeout({
      from: process.env.EMAIL_FROM || 'MediCare AI Clinic <noreply@medicare.vn>',
      to: user.email,
      subject: '🔑 Mã OTP đặt lại mật khẩu – MediCare AI Clinic',
      html: emailTemplate('Đặt lại mật khẩu', content),
    });
  },

  sendWelcomeEmail: async (user) => {
    const content = `
      <p>Xin chào <strong>${user.fullName}</strong>,</p>
      <p>Email của bạn đã được xác thực thành công! Chào mừng bạn đến với MediCare AI Clinic.</p>
      <div style="text-align:center;margin:24px 0">
        <a href="${process.env.CLIENT_URL}/dang-nhap" class="btn">🏥 Bắt đầu sử dụng</a>
      </div>
      <p>Hãy khám phá các tính năng tuyệt vời của chúng tôi: đặt lịch khám, tư vấn AI, theo dõi sức khỏe và nhiều hơn nữa.</p>
    `;
    await sendMailWithTimeout({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: '🎉 Chào mừng đến với MediCare AI Clinic!',
      html: emailTemplate('Chào mừng bạn! 🎉', content),
    });
  },
};

module.exports = emailService;
