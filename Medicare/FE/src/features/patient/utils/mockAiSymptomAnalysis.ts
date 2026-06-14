import { AiSymptomAnalysis } from '../types';

const specialtyRules: {
  keywords: string[];
  specialty: string;
  alternative: string;
  urgency: AiSymptomAnalysis['urgency'];
}[] = [
  {
    keywords: ['tim', 'ngực', 'huyết áp', 'cholesterol', 'khó thở'],
    specialty: 'Tim mạch',
    alternative: 'Cơ xương khớp',
    urgency: 'high',
  },
  {
    keywords: ['xương', 'khớp', 'lưng', 'cột sống', 'thoái hóa'],
    specialty: 'Cơ xương khớp',
    alternative: 'Tim mạch',
    urgency: 'medium',
  },
  {
    keywords: ['thai', 'mang thai', 'trẻ', 'nhi', 'sản', 'bé'],
    specialty: 'Sản & Nhi',
    alternative: 'Tim mạch',
    urgency: 'medium',
  },
  {
    keywords: ['mắt', 'nhìn', 'cận thị', 'viễn thị', 'mờ'],
    specialty: 'Mắt',
    alternative: 'Tim mạch',
    urgency: 'low',
  },
  {
    keywords: ['ho', 'sốt', 'cảm', 'viêm họng'],
    specialty: 'Sản & Nhi',
    alternative: 'Tim mạch',
    urgency: 'medium',
  },
];

export const mockAiSymptomAnalysis = (symptoms: string): AiSymptomAnalysis => {
  const normalized = symptoms.toLowerCase();
  const matched =
    specialtyRules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword))) ??
    specialtyRules[0];

  return {
    suggestedSpecialty: matched.specialty,
    alternativeSpecialty: matched.alternative,
    summary: `Dựa trên mô tả triệu chứng, hệ thống gợi ý bạn nên khám tại chuyên khoa ${matched.specialty}.`,
    urgency: matched.urgency,
    confidence: 82 + Math.floor(Math.random() * 12),
  };
};
