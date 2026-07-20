const geminiService = require('../services/geminiService');
const {
  suggestMedications,
  MedicationSuggestionError,
} = require('../services/medicationSuggestionService');

const MIN_SYMPTOM_LENGTH = 10;
const MAX_SYMPTOM_LENGTH = 4000;
const MAX_HISTORY = 16;
const MAX_MESSAGE_LENGTH = 2000;
const ALLOWED_ROLES = ['user', 'model'];

const analyzeSymptoms = async (req, res) => {
  const symptoms = typeof req.body?.symptoms === 'string' ? req.body.symptoms.trim() : '';

  if (symptoms.length < MIN_SYMPTOM_LENGTH) {
    return res.status(400).json({
      success: false,
      message: `Vui lòng mô tả triệu chứng ít nhất ${MIN_SYMPTOM_LENGTH} ký tự`,
    });
  }

  try {
    const analysis = await geminiService.analyzeSymptoms(symptoms.slice(0, MAX_SYMPTOM_LENGTH));
    return res.status(200).json({ success: true, data: { analysis } });
  } catch (error) {
    console.error('[AI] analyzeSymptoms failed:', error.message);
    return res.status(503).json({
      success: false,
      message: 'Không thể kết nối tới trợ lý AI lúc này. Vui lòng thử lại sau hoặc tự chọn chuyên khoa.',
      code: 'AI_UNAVAILABLE',
    });
  }
};

const chat = async (req, res) => {
  const rawMessages = Array.isArray(req.body?.messages) ? req.body.messages : null;

  if (!rawMessages || rawMessages.length === 0) {
    return res.status(400).json({ success: false, message: 'Thiếu nội dung tin nhắn' });
  }

  const messages = rawMessages
    .filter((message) => (
      message &&
      ALLOWED_ROLES.includes(message.role) &&
      typeof message.text === 'string' &&
      message.text.trim()
    ))
    .slice(-MAX_HISTORY)
    .map((message) => ({
      role: message.role,
      text: message.text.trim().slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (messages.length === 0) {
    return res.status(400).json({ success: false, message: 'Nội dung tin nhắn không hợp lệ' });
  }

  try {
    const reply = await geminiService.chat(messages);
    return res.status(200).json({ success: true, data: { reply } });
  } catch (error) {
    console.error('[AI] chat failed:', error.message);
    return res.status(503).json({
      success: false,
      message: 'Trợ lý AI hiện không phản hồi được. Vui lòng thử lại sau ít phút.',
      code: 'AI_UNAVAILABLE',
    });
  }
};

const suggestMedicationList = async (req, res) => {
  const clinicalSymptoms = typeof req.body?.clinicalSymptoms === 'string'
    ? req.body.clinicalSymptoms.trim()
    : '';
  const preliminaryDiagnosis = typeof req.body?.preliminaryDiagnosis === 'string'
    ? req.body.preliminaryDiagnosis.trim()
    : '';
  const additionalNotes = typeof req.body?.additionalNotes === 'string'
    ? req.body.additionalNotes.trim()
    : '';
  const allergies = Array.isArray(req.body?.allergies)
    ? req.body.allergies.map((item) => String(item || '').trim()).filter(Boolean)
    : [];
  const medicalHistory = Array.isArray(req.body?.medicalHistory)
    ? req.body.medicalHistory.map((item) => String(item || '').trim()).filter(Boolean)
    : [];

  if (!clinicalSymptoms && !preliminaryDiagnosis) {
    return res.status(400).json({
      success: false,
      message: 'Cần có triệu chứng hoặc chẩn đoán sơ bộ để AI gợi ý thuốc.',
    });
  }

  try {
    const suggestions = await suggestMedications({
      clinicalSymptoms: clinicalSymptoms.slice(0, MAX_MESSAGE_LENGTH),
      preliminaryDiagnosis: preliminaryDiagnosis.slice(0, MAX_MESSAGE_LENGTH),
      additionalNotes: additionalNotes.slice(0, MAX_MESSAGE_LENGTH),
      allergies,
      medicalHistory,
    });

    return res.status(200).json({ success: true, data: { suggestions } });
  } catch (error) {
    const status = error instanceof MedicationSuggestionError ? 503 : 500;
    console.error('[AI] suggestMedicationList failed:', error.message);
    return res.status(status).json({
      success: false,
      message: 'Không thể tạo gợi ý thuốc bằng AI lúc này. Hệ thống sẽ dùng gợi ý lâm sàng mặc định.',
      code: 'AI_MEDICATION_UNAVAILABLE',
    });
  }
};

module.exports = {
  analyzeSymptoms,
  chat,
  suggestMedicationList,
};
