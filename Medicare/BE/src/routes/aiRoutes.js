const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect); // chỉ người dùng đã đăng nhập mới dùng được trợ lý AI

router.post('/analyze-symptoms', aiController.analyzeSymptoms);
router.post('/chat', aiController.chat);
router.post('/suggest-medications', aiController.suggestMedicationList);

module.exports = router;
