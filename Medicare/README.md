# 🏥 Medicare AI Clinic — Monorepo

Dự án fullstack gộp chung **Backend (Node.js/Express)** và **Frontend (React/TypeScript)** trong 1 thư mục.

```
medicare-ai-clinic-monorepo/
├── backend/          ← Node.js + Express + MongoDB
├── frontend/         ← React + TypeScript + TailwindCSS
├── package.json      ← Root: chạy cả 2 cùng lúc
└── .env.example      ← Tham khảo cấu hình
```

---

## 🚀 Hướng dẫn cài đặt & chạy

### Bước 1 — Cài MongoDB
Tải tại: https://www.mongodb.com/try/download/community → chọn bản Windows

### Bước 2 — Cài dependencies
```powershell
npm run install:all
```
> Lệnh này sẽ tự cài cho cả root, backend và frontend.

### Bước 3 — Tạo file .env cho Backend
```powershell
copy backend\.env.example backend\.env
```
Mở `backend/.env` và điền thông tin:
```
MONGODB_URI=mongodb://localhost:27017/medicare_ai
JWT_SECRET=chuoi_bi_mat_cua_ban
EMAIL_USER=gmail_cua_ban@gmail.com
EMAIL_PASS=mat_khau_ung_dung_gmail
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Bước 4 — Tạo file .env cho Frontend
```powershell
copy frontend\.env.example frontend\.env
```

### Bước 5 — Chạy cả 2 cùng lúc
```powershell
npm run dev
```
✅ Backend chạy tại: http://localhost:8000  
✅ Frontend chạy tại: http://localhost:3000

---

## 🔧 Các lệnh hữu ích

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy cả backend lẫn frontend |
| `npm run backend` | Chỉ chạy backend |
| `npm run frontend` | Chỉ chạy frontend |
| `npm run build` | Build frontend ra bản production |
| `npm run install:all` | Cài toàn bộ dependencies |

---

## ✅ Tính năng Backend

| Tính năng | Mô tả |
|-----------|-------|
| Đăng ký | Bcrypt hash password, gửi email xác thực link |
| Xác thực email | Token SHA-256 hashed, hết hạn 24h |
| Đăng nhập | JWT access token + refresh token cookie |
| Đăng nhập Google | Passport OAuth 2.0, tự tạo tài khoản |
| Quên mật khẩu | OTP 6 số gửi email, hết hạn 15 phút |
| Upload avatar | Multer, tối đa 5MB, lưu vào `/uploads/avatars/` |

---

## 🌐 API Endpoints

- `GET  /api/health` — Kiểm tra server
- `POST /api/auth/register` — Đăng ký
- `POST /api/auth/login` — Đăng nhập
- `GET  /api/auth/google` — Đăng nhập Google
- `POST /api/auth/forgot-password` — Quên mật khẩu
- `GET  /api/profile` — Xem profile
- `PUT  /api/profile` — Cập nhật profile

---

## 🔑 Lấy Gmail App Password
Gmail → Bảo mật → Xác minh 2 bước → App Passwords → Tạo mới

## 🔑 Tạo Google OAuth
1. Vào https://console.cloud.google.com
2. Tạo project → APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Authorized redirect URIs: `http://localhost:8000/api/auth/google/callback`
4. Copy Client ID và Secret vào `backend/.env`
