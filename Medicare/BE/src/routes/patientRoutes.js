const express = require('express');

const router = express.Router();
const ctrl = require('../controllers/patientController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use(restrictTo('patient', 'admin'));

// Specialties & doctors (danh bạ đặt lịch)
router.get('/specialties', ctrl.listSpecialties);
router.get('/doctors', ctrl.listDoctors);

// Appointments / booking
router.get('/appointments', ctrl.listAppointments);
router.post('/appointments', ctrl.createAppointment);

// Dashboard & hồ sơ
router.get('/dashboard', ctrl.getDashboard);
router.get('/health-records', ctrl.getHealthRecords);

// Payments
router.get('/payments', ctrl.getPayments);
router.post('/payments/:invoiceId/pay', ctrl.payInvoice);

// Reviews
router.get('/reviews', ctrl.getReviews);
router.post('/reviews', ctrl.submitReview);

// Notifications
router.get('/notifications', ctrl.getNotifications);
router.patch('/notifications/read', ctrl.markNotificationsRead);

module.exports = router;
