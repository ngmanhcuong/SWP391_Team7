require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const seedDevUsers = require('./config/seedDevUsers');
const seedReceptionist = require('./config/seedReceptionist');
const seedSpecialties = require('./config/seedSpecialties');
const seedDoctors = require('./config/seedDoctors');
const seedPatientData = require('./config/seedPatientData');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const aiRoutes = require('./routes/aiRoutes');
const receptionistRoutes = require('./routes/receptionistRoutes');
const patientRoutes = require('./routes/patientRoutes');
const adminRoutes = require('./routes/adminRoutes');

const parseAllowedOrigins = () => {
  const origins = new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
  ]);

  if (process.env.NODE_ENV !== 'production') {
    for (let port = 3000; port <= 3010; port += 1) {
      origins.add(`http://localhost:${port}`);
      origins.add(`http://127.0.0.1:${port}`);
    }
  }

  const fromEnv = [
    process.env.CLIENT_URL,
    process.env.CORS_ORIGINS,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  fromEnv.forEach((origin) => origins.add(origin));
  return [...origins];
};

const allowedOrigins = parseAllowedOrigins();

const app = express();

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS — cho phép localhost + URL production trong CLIENT_URL / CORS_ORIGINS
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    console.warn(`[CORS] Blocked origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Passport init (no session - using JWT)
app.use(passport.initialize());

// Global rate limiter
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Quá nhiều request, thử lại sau' },
}));

// Static files - serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Routes ──────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/receptionist', receptionistRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🏥 MediCare AI Clinic API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} không tồn tại` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi server không xác định',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();
  await seedDevUsers();
  await seedSpecialties();
  await seedDoctors();
  await seedReceptionist();
  await seedPatientData();

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API docs: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;