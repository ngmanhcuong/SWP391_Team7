const geminiService = require('../services/geminiService');

const MIN_SYMPTOM_LENGTH = 10;
const MAX_SYMPTOM_LENGTH = 4000;

// POST /api/ai/analyze-symptoms
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

const MAX_HISTORY = 16;
const MAX_MESSAGE_LENGTH = 2000;
const ALLOWED_ROLES = ['user', 'model'];

// POST /api/ai/chat
const chat = async (req, res) => {
  const rawMessages = Array.isArray(req.body?.messages) ? req.body.messages : null;

  if (!rawMessages || rawMessages.length === 0) {
    return res.status(400).json({ success: false, message: 'Thiếu nội dung tin nhắn' });
  }

  const messages = rawMessages
    .filter((m) => m && ALLOWED_ROLES.includes(m.role) && typeof m.text === 'string' && m.text.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, text: m.text.trim().slice(0, MAX_MESSAGE_LENGTH) }));

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

module.exports = { analyzeSymptoms, chat };
