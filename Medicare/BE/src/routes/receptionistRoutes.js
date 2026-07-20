const express = require('express');

const router = express.Router();
const ctrl = require('../controllers/receptionistController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use(restrictTo('receptionist', 'admin'));

// Overview / dashboard
router.get('/overview', ctrl.getOverview);
router.get('/catalog', ctrl.listCatalog);

// Patients
router.get('/patients', ctrl.listPatients);
router.post('/patients', ctrl.createPatient);

// Appointments
router.get('/appointments', ctrl.listAppointments);
router.post('/appointments', ctrl.createAppointment);
router.post('/appointments/:id/confirm-deposit', ctrl.confirmAppointmentDeposit);
router.patch('/appointments/:id/status', ctrl.updateAppointmentStatus);
router.post('/appointments/:id/checkin', ctrl.checkinAppointment);

// Queue
router.get('/queue', ctrl.listQueue);
router.post('/queue/manual', ctrl.manualAddQueue);
router.post('/queue/call-next', ctrl.callNextQueue);
router.patch('/queue/:id', ctrl.updateQueueTicket);

module.exports = router;
