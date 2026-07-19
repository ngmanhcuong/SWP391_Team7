const express = require('express');

const router = express.Router();
const ctrl = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use(restrictTo('admin'));

// Dashboard
router.get('/dashboard', ctrl.getDashboard);
router.get('/reports', ctrl.getReports);
router.get('/audit-logs', ctrl.getAuditLogs);

// Doctors
router.get('/doctors', ctrl.listDoctors);
router.post('/doctors/sync-accounts', ctrl.syncDoctorAccounts);
router.post('/doctors', ctrl.createDoctor);
router.put('/doctors/:id', ctrl.updateDoctor);
router.delete('/doctors/:id', ctrl.deleteDoctor);

// Specialties
router.get('/specialties', ctrl.listSpecialties);
router.post('/specialties', ctrl.createSpecialty);
router.put('/specialties/:id', ctrl.updateSpecialty);
router.delete('/specialties/:id', ctrl.deleteSpecialty);

// Reviews
router.get('/reviews', ctrl.listReviews);
router.patch('/reviews/:id/status', ctrl.updateReviewStatus);

// Appointments
router.get('/appointments', ctrl.listAppointments);
router.post('/appointments', ctrl.createAppointment);
router.patch('/appointments/:code/status', ctrl.updateAppointmentStatus);

// Users
router.get('/users', ctrl.listUsers);
router.post('/users/sync-all', ctrl.syncAllAccounts);
router.post('/users', ctrl.createUser);
router.patch('/users/:id/status', ctrl.updateUserStatus);
router.patch('/users/:id/role', ctrl.updateUserRole);
router.delete('/users/:id', ctrl.deleteUser);

module.exports = router;
