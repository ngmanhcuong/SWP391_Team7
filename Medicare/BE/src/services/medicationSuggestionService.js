const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
const REQUEST_TIMEOUT_MS = 20000;

class MedicationSuggestionError extends Error {
  constructor(message, { status } = {}) {
    super(message);
    this.name = 'MedicationSuggestionError';
    this.status = status;
  }
}

const extractText = (data) => {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;
  return parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim();
};

const callGemini = async (body) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new MedicationSuggestionError('GEMINI_API_KEY is missing');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${GEMINI_API_BASE}/models/${DEFAULT_MODEL}:generateContent`, {
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
      throw new MedicationSuggestionError('AI medication request timed out');
    }
    throw new MedicationSuggestionError(`Cannot connect to AI service: ${error.message}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new MedicationSuggestionError(
      `AI service returned ${response.status}${errorBody ? `: ${errorBody.slice(0, 300)}` : ''}`,
      { status: response.status },
    );
  }

  const data = await response.json().catch(() => null);
  const rawText = extractText(data);
  if (!rawText) {
    throw new MedicationSuggestionError('AI service returned empty content');
  }

  return rawText;
};

const buildPrompt = ({
  clinicalSymptoms,
  preliminaryDiagnosis,
  additionalNotes,
  allergies,
  medicalHistory,
}) => `You are a clinical prescription assistant for doctors at MediCare AI Clinic.

Task:
- Read the patient's symptoms, preliminary diagnosis, clinical notes, allergies, and medical history.
- Suggest additional outpatient medication options that may fit this patient better.
- Return practical options for doctor review, not final mandatory prescriptions.

Safety rules:
1. Do not claim a final diagnosis.
2. Avoid drugs that clearly conflict with listed allergies or major history if possible.
3. If a drug needs caution, still mention it but put the caution in "warning".
4. Keep suggestions concise and useful.
5. Return JSON only.

Clinical context:
- Symptoms: ${clinicalSymptoms || 'N/A'}
- Preliminary diagnosis: ${preliminaryDiagnosis || 'N/A'}
- Additional notes: ${additionalNotes || 'N/A'}
- Allergies: ${(allergies || []).join(', ') || 'None recorded'}
- Medical history: ${(medicalHistory || []).join(', ') || 'None recorded'}

Return exactly this JSON shape:
{
  "suggestions": [
    {
      "name": "<medication name and strength>",
      "reason": "<short clinical rationale in Vietnamese>",
      "dosage": "<short dosage suggestion>",
      "quantity": "<short quantity or duration>",
      "instructions": "<short usage instruction in Vietnamese>",
      "warning": "<empty string if none, otherwise short caution in Vietnamese>"
    }
  ]
}

Additional requirements:
- Prefer 5 to 8 suggestions when the case has enough detail.
- Do not repeat the same medication.
- Use Vietnamese for rationale, instructions, and warnings.`;

const normalizeSuggestions = (parsed) => {
  const seenNames = new Set();
  const suggestions = Array.isArray(parsed?.suggestions) ? parsed.suggestions : [];

  return suggestions
    .map((item, index) => {
      const name = typeof item?.name === 'string' ? item.name.trim() : '';
      if (!name) return null;

      const key = name.toLowerCase();
      if (seenNames.has(key)) return null;
      seenNames.add(key);

      return {
        id: `ai-med-${index + 1}-${key.replace(/[^a-z0-9]+/g, '-')}`,
        name,
        reason:
          typeof item?.reason === 'string' && item.reason.trim()
            ? item.reason.trim()
            : 'Gợi ý tham khảo dựa trên bối cảnh lâm sàng hiện tại.',
        dosage:
          typeof item?.dosage === 'string' && item.dosage.trim()
            ? item.dosage.trim()
            : 'Theo chỉ định bác sĩ',
        quantity:
          typeof item?.quantity === 'string' && item.quantity.trim()
            ? item.quantity.trim()
            : 'Theo liệu trình phù hợp',
        instructions:
          typeof item?.instructions === 'string' && item.instructions.trim()
            ? item.instructions.trim()
            : 'Theo hướng dẫn bác sĩ',
        warning: typeof item?.warning === 'string' ? item.warning.trim() : '',
      };
    })
    .filter(Boolean);
};

const suggestMedications = async (payload) => {
  const rawText = await callGemini({
    contents: [{ role: 'user', parts: [{ text: buildPrompt(payload) }] }],
    generationConfig: {
      temperature: 0.35,
      responseMimeType: 'application/json',
    },
  });

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    throw new MedicationSuggestionError('Cannot parse AI medication suggestions');
  }

  return normalizeSuggestions(parsed);
};

module.exports = {
  suggestMedications,
  MedicationSuggestionError,
};
