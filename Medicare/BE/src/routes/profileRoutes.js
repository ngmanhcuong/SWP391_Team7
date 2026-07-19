const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');

router.use(protect); // all profile routes require auth

router.get('/', profileController.getProfile);
router.get('/notifications', profileController.getNotifications);
router.patch('/notifications/read', profileController.markNotificationsRead);
router.put('/', profileController.updateProfile);
router.post('/avatar', uploadAvatar, profileController.uploadAvatar);
router.delete('/avatar', profileController.deleteAvatar);
router.put('/change-password', profileController.changePassword);

module.exports = router;
