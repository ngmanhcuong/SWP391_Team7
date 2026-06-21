const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-3.1-flash-lite';
const REQUEST_TIMEOUT_MS = 20000;

// Phòng khám chỉ có 4 chuyên khoa này — AI phải chọn trong danh sách
const CLINIC_SPECIALTIES = ['Tim mạch', 'Cơ xương khớp', 'Sản & Nhi', 'Mắt'];
const URGENCY_LEVELS = ['low', 'medium', 'high'];

// Mô tả phạm vi từng khoa để AI suy luận chính xác hơn
const SPECIALTY_GUIDE = `- "Tim mạch": các vấn đề tim mạch và nội khoa chung của phòng khám — đau/tức ngực, hồi hộp, đánh trống ngực, khó thở, huyết áp cao/thấp, rối loạn nhịp tim, mỡ máu/cholesterol, chóng mặt, mệt mỏi kéo dài, bệnh nội khoa mạn tính (tiểu đường...).
- "Cơ xương khớp": đau và bệnh lý xương – khớp – cơ – cột sống — đau khớp, sưng/cứng khớp, đau lưng, đau cổ vai gáy, đau cơ, thoái hóa cột sống, chấn thương xương khớp, đau sau té ngã hoặc vận động.
- "Sản & Nhi": sản – phụ khoa và nhi khoa — mang thai, khám thai, rối loạn/đau bụng kinh, vấn đề phụ khoa; và bệnh ở trẻ em (trẻ sốt, ho, tiêu chảy, quấy khóc...).
- "Mắt": các vấn đề về mắt và thị lực — nhìn mờ, giảm thị lực, đau/đỏ/ngứa/khô mắt, chảy nước mắt, cận – viễn – loạn thị, nhức mỏi mắt.`;

class GeminiError extends Error {
  constructor(message, { status } = {}) {
    super(message);
    this.name = 'GeminiError';
    this.status = status;
  }
}

const buildPrompt = (symptoms) => `Bạn là trợ lý phân loại y tế (medical triage) của phòng khám MediCare AI. Nhiệm vụ: đọc mô tả triệu chứng của bệnh nhân và gợi ý chuyên khoa phù hợp nhất để đặt lịch khám.

QUAN TRỌNG: Phòng khám CHỈ có 4 chuyên khoa sau, "suggestedSpecialty" và "alternativeSpecialty" BẮT BUỘC là một trong các tên này (giữ nguyên chính tả, có dấu):
${SPECIALTY_GUIDE}

Quy tắc suy luận:
1. Phân tích triệu chứng chính, xác định cơ quan/hệ cơ thể bị ảnh hưởng, rồi ánh xạ tới khoa phù hợp nhất ở trên.
2. Nếu triệu chứng rõ ràng thuộc một lĩnh vực mà phòng khám KHÔNG có (ví dụ: tiêu hóa/đau bụng người lớn, thần kinh – đau đầu, tai mũi họng, da liễu, tiết niệu...), hãy chọn khoa gần nhất có thể hỗ trợ ban đầu, đặt "confidence" THẤP (≤ 40), và trong "summary" nói rõ triệu chứng có thể nằm ngoài 4 chuyên khoa chính và khuyên bệnh nhân liên hệ quầy lễ tân để được hướng dẫn khoa phù hợp.
3. Hiệu chỉnh "confidence": 80–95 khi triệu chứng khớp rõ một khoa; 50–79 khi khớp một phần hoặc có thể thuộc nhiều khoa; ≤ 40 khi không khoa nào thực sự phù hợp.
4. Hiệu chỉnh "urgency": "high" nếu có dấu hiệu nguy hiểm/cấp cứu (đau ngực dữ dội, khó thở nặng, đau bụng dữ dội đột ngột, chấn thương nặng, sốt rất cao ở trẻ, mất thị lực đột ngột); "medium" với triệu chứng rõ cần khám sớm; "low" với triệu chứng nhẹ hoặc mạn tính cần theo dõi.
5. "summary" viết bằng tiếng Việt, 1–2 câu, giải thích ngắn gọn lý do chọn khoa; giọng điệu trấn an, KHÔNG chẩn đoán bệnh cụ thể, KHÔNG kê đơn thuốc.

Mô tả triệu chứng của bệnh nhân:
"""
${symptoms}
"""

Chỉ trả về DUY NHẤT một object JSON hợp lệ (không markdown, không văn bản thừa) theo cấu trúc:
{
  "suggestedSpecialty": "<một trong 4 khoa>",
  "alternativeSpecialty": "<một trong 4 khoa hoặc bỏ trống nếu không có>",
  "summary": "<tóm tắt 1-2 câu>",
  "urgency": "low | medium | high",
  "confidence": <số nguyên 0-100>
}`;

const normalizeAnalysis = (parsed) => {
  if (!parsed || typeof parsed !== 'object') {
    throw new GeminiError('Phản hồi từ AI không hợp lệ');
  }

  const suggestedSpecialty = CLINIC_SPECIALTIES.includes(parsed.suggestedSpecialty)
    ? parsed.suggestedSpecialty
    : CLINIC_SPECIALTIES[0];

  const alternativeSpecialty = CLINIC_SPECIALTIES.includes(parsed.alternativeSpecialty)
    ? parsed.alternativeSpecialty
    : undefined;

  const urgency = URGENCY_LEVELS.includes(parsed.urgency) ? parsed.urgency : 'medium';

  let confidence = Number(parsed.confidence);
  if (!Number.isFinite(confidence)) confidence = 80;
  confidence = Math.max(0, Math.min(100, Math.round(confidence)));

  const summary =
    typeof parsed.summary === 'string' && parsed.summary.trim()
      ? parsed.summary.trim()
      : `Dựa trên mô tả triệu chứng, hệ thống gợi ý bạn nên khám tại chuyên khoa ${suggestedSpecialty}.`;

  return { suggestedSpecialty, alternativeSpecialty, summary, urgency, confidence };
};

const extractText = (data) => {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;
  return parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim();
};

// Gọi Gemini với một request body tùy ý, trả về text phản hồi của model
const callGemini = async (body) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    throw new GeminiError('GEMINI_API_KEY chưa được cấu hình trên máy chủ');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${GEMINI_API_BASE}/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new GeminiError('Yêu cầu tới AI quá thời gian chờ');
    }
    throw new GeminiError(`Không thể kết nối tới dịch vụ AI: ${error.message}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new GeminiError(
      `Dịch vụ AI trả về lỗi ${response.status}${errorBody ? `: ${errorBody.slice(0, 300)}` : ''}`,
      { status: response.status },
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new GeminiError('Không đọc được phản hồi từ dịch vụ AI');
  }

  const rawText = extractText(data);
  if (!rawText) {
    throw new GeminiError('Dịch vụ AI không trả về nội dung');
  }

  return rawText;
};

const analyzeSymptoms = async (symptoms) => {
  const rawText = await callGemini({
    contents: [{ role: 'user', parts: [{ text: buildPrompt(symptoms) }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    throw new GeminiError('Không phân tích được kết quả trả về từ AI');
  }

  return normalizeAnalysis(parsed);
};

const CHAT_SYSTEM_INSTRUCTION = `Bạn là "Trợ lý sức khỏe AI" của phòng khám MediCare AI, trò chuyện bằng tiếng Việt, thân thiện, ngắn gọn và dễ hiểu.

Vai trò của bạn:
- Hỗ trợ bệnh nhân về: đặt lịch khám, tra cứu/giải thích kết quả xét nghiệm ở mức tổng quát, tư vấn sơ bộ về triệu chứng, và hướng dẫn sử dụng hệ thống (mục Lịch hẹn, Hồ sơ bệnh án, Thanh toán, Thông báo, Đánh giá dịch vụ).
- Phòng khám có 4 chuyên khoa: Tim mạch, Cơ xương khớp, Sản & Nhi, Mắt. Khi phù hợp, gợi ý bệnh nhân khám đúng chuyên khoa và đặt lịch ở mục "Lịch hẹn".

Nguyên tắc an toàn:
- KHÔNG chẩn đoán bệnh chắc chắn, KHÔNG kê đơn hay liều lượng thuốc cụ thể. Luôn nhắc rằng thông tin chỉ mang tính tham khảo, không thay thế khám trực tiếp với bác sĩ.
- Nếu có dấu hiệu cấp cứu (đau ngực dữ dội, khó thở nặng, chảy máu nhiều, mất ý thức...), khuyên bệnh nhân tới cơ sở y tế gần nhất hoặc gọi cấp cứu 115 ngay.
- Trả lời tập trung vào lĩnh vực y tế và dịch vụ phòng khám. Lịch sự từ chối các yêu cầu ngoài phạm vi.
- Giữ câu trả lời ngắn gọn (tối đa khoảng 4-5 câu).
- Mỗi khi nhắc tới TÊN CHUYÊN KHOA gợi ý (Tim mạch, Cơ xương khớp, Sản & Nhi, Mắt), hãy IN ĐẬM bằng cách bọc trong cặp dấu **, ví dụ: **Cơ xương khớp**.
- Ngoài việc in đậm tên chuyên khoa ở trên, KHÔNG dùng các ký hiệu markdown khác (không dùng *, #, \`). Nếu cần liệt kê thì dùng dấu "-" ở đầu dòng.`;

// messages: [{ role: 'user' | 'model', text }]
const chat = async (messages) => {
  const contents = messages
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text.trim() }],
    }));

  // Gemini yêu cầu lượt đầu tiên phải là 'user'
  while (contents.length && contents[0].role === 'model') {
    contents.shift();
  }

  if (!contents.length) {
    throw new GeminiError('Không có nội dung tin nhắn hợp lệ');
  }

  return callGemini({
    systemInstruction: { parts: [{ text: CHAT_SYSTEM_INSTRUCTION }] },
    contents,
    generationConfig: { temperature: 0.6 },
  });
};

module.exports = { analyzeSymptoms, chat, GeminiError, CLINIC_SPECIALTIES };
