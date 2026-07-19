const express = require('express');

const router = express.Router();
const ctrl = require('../controllers/doctorController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use(restrictTo('doctor'));

router.get('/patients', ctrl.listAssignedPatients);
router.get('/patients/:patientId/history', ctrl.listPatientHistory);
router.get('/appointments', ctrl.listScheduleAppointments);
router.post('/appointments/:appointmentId/record', ctrl.saveAppointmentRecord);
router.patch('/appointments/:appointmentId/complete', ctrl.completeAppointment);

module.exports = router;
