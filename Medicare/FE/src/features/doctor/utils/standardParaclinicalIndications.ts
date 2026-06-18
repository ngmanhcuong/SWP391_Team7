export interface ClinicalLink {
  icd10Codes?: string[];
  symptomKeywords?: string[];
  rationale: string;
  whoRef?: string;
  priority?: number;
}

export interface StandardParaclinicalIndication {
  id: string;
  name: string;
  category: string;
  code?: string;
  clinicalLinks?: ClinicalLink[];
}

export const STANDARD_PARACLINICAL_INDICATIONS: StandardParaclinicalIndication[] = [
  {
    id: 'std-cbc',
    name: 'Xét nghiệm máu tổng quát (CBC)',
    category: 'Xét nghiệm máu',
    code: 'CBC',
    clinicalLinks: [
      {
        icd10Codes: ['J20', 'J06', 'I10', 'E11'],
        symptomKeywords: ['sốt', 'ho', 'mệt mỏi'],
        rationale: 'Đánh giá nhiễm trùng, thiếu máu hoặc viêm toàn thân theo hướng dẫn lâm sàng chuẩn',
        whoRef: 'WHO IMCI / NCD screening',
        priority: 3,
      },
    ],
  },
  {
    id: 'std-glucose',
    name: 'Đường huyết lúc đói',
    category: 'Xét nghiệm máu',
    code: 'GLU',
    clinicalLinks: [
      {
        icd10Codes: ['E11'],
        symptomKeywords: ['khát nước', 'tiểu đêm', 'tiểu nhiều', 'mệt mỏi'],
        rationale: 'Chẩn đoán và theo dõi đái tháo đường — xét nghiệm cốt lõi theo WHO PEN',
        whoRef: 'WHO Package of Essential NCD Interventions (PEN)',
        priority: 1,
      },
    ],
  },
  {
    id: 'std-hba1c',
    name: 'HbA1c (đường huyết trung bình 3 tháng)',
    category: 'Xét nghiệm máu',
    code: 'HbA1c',
    clinicalLinks: [
      {
        icd10Codes: ['E11'],
        symptomKeywords: ['khát nước', 'tiểu đêm', 'mệt mỏi'],
        rationale: 'Đánh giá kiểm soát đường huyết trung bình 3 tháng — tiêu chuẩn WHO cho ĐTĐ type 2',
        whoRef: 'WHO PEN — Diabetes',
        priority: 1,
      },
    ],
  },
  {
    id: 'std-lipid',
    name: 'Xét nghiệm lipid máu (Cholesterol, TG, HDL, LDL)',
    category: 'Xét nghiệm máu',
    code: 'LIPID',
    clinicalLinks: [
      {
        icd10Codes: ['E78', 'E78.5', 'I10', 'E11'],
        symptomKeywords: ['đau ngực', 'mệt mỏi'],
        rationale: 'Đánh giá nguy cơ tim mạch và rối loạn lipid — khuyến cáo WHO cho bệnh mạn tính',
        whoRef: 'WHO CVD risk assessment',
        priority: 2,
      },
    ],
  },
  {
    id: 'std-liver',
    name: 'Chức năng gan (AST, ALT, Bilirubin)',
    category: 'Xét nghiệm máu',
    code: 'LFT',
    clinicalLinks: [
      {
        icd10Codes: ['E78', 'E78.5', 'E11'],
        symptomKeywords: ['đau bụng', 'thượng vị', 'mệt mỏi'],
        rationale: 'Theo dõi gan trước khi dùng statin/metformin và khi nghi ngờ bệnh gan mật',
        whoRef: 'WHO essential diagnostics',
        priority: 3,
      },
    ],
  },
  {
    id: 'std-kidney',
    name: 'Chức năng thận (Ure, Creatinine, eGFR)',
    category: 'Xét nghiệm máu',
    code: 'RFT',
    clinicalLinks: [
      {
        icd10Codes: ['I10', 'E11', 'I11'],
        symptomKeywords: ['tiểu đêm', 'mệt mỏi', 'phù'],
        rationale: 'Sàng lọc biến chứng thận ở THA/ĐTĐ — bắt buộc theo hướng dẫn WHO PEN',
        whoRef: 'WHO PEN — Hypertension & Diabetes',
        priority: 1,
      },
    ],
  },
  {
    id: 'std-urine',
    name: 'Tổng phân tích nước tiểu',
    category: 'Xét nghiệm máu',
    code: 'URINE',
    clinicalLinks: [
      {
        icd10Codes: ['E11', 'I10'],
        symptomKeywords: ['tiểu đêm', 'tiểu nhiều', 'khát nước'],
        rationale: 'Phát hiện protein niệu/bạch cầu niệu — sàng lọc biến chứng thận theo WHO',
        whoRef: 'WHO PEN',
        priority: 2,
      },
    ],
  },
  {
    id: 'std-coag',
    name: 'Đông máu cơ bản (PT, aPTT, INR)',
    category: 'Xét nghiệm máu',
    code: 'COAG',
    clinicalLinks: [
      {
        icd10Codes: ['I20', 'R07', 'R07.4'],
        symptomKeywords: ['đau ngực'],
        rationale: 'Đánh giá trước can thiệp hoặc khi nghi ngờ rối loạn đông máu trong cấp cứu tim mạch',
        priority: 4,
      },
    ],
  },
  {
    id: 'std-cxr',
    name: 'X-quang ngực thẳng',
    category: 'Chẩn đoán hình ảnh',
    code: 'CXR',
    clinicalLinks: [
      {
        icd10Codes: ['J20', 'J06', 'R07', 'R07.4', 'I10'],
        symptomKeywords: ['ho', 'ho khan', 'khó thở', 'đau ngực', 'sốt'],
        rationale: 'Loại trừ viêm phổi, suy tim phổi hoặc bệnh lý phổi trong viêm đường hô hấp/đau ngực',
        whoRef: 'WHO respiratory care guidelines',
        priority: 1,
      },
    ],
  },
  {
    id: 'std-abd-xray',
    name: 'X-quang bụng không chuẩn bị',
    category: 'Chẩn đoán hình ảnh',
    code: 'KUB',
    clinicalLinks: [
      {
        symptomKeywords: ['đau bụng'],
        rationale: 'Sàng lọc tắc ruột, hơi tự do khi đau bụng cấp',
        priority: 4,
      },
    ],
  },
  {
    id: 'std-us-abd',
    name: 'Siêu âm ổ bụng tổng quát',
    category: 'Chẩn đoán hình ảnh',
    code: 'US-ABD',
    clinicalLinks: [
      {
        symptomKeywords: ['đau bụng', 'thượng vị'],
        icd10Codes: ['K29', 'K21'],
        rationale: 'Đánh giá gan mật, tụy, thận khi đau bụng hoặc bệnh lý tiêu hóa',
        whoRef: 'WHO essential imaging',
        priority: 2,
      },
    ],
  },
  {
    id: 'std-us-thyroid',
    name: 'Siêu âm tuyến giáp',
    category: 'Chẩn đoán hình ảnh',
    code: 'US-THY',
    clinicalLinks: [
      {
        icd10Codes: ['E03'],
        symptomKeywords: ['mệt mỏi', 'chóng mặt'],
        rationale: 'Đánh giá bướu cổ/nghi ngờ suy giáp hoặc cường giáp',
        priority: 3,
      },
    ],
  },
  {
    id: 'std-ct-brain',
    name: 'CT sọ não không cản quang',
    category: 'Chẩn đoán hình ảnh',
    code: 'CT-BRAIN',
    clinicalLinks: [
      {
        symptomKeywords: ['đau đầu', 'chóng mặt'],
        icd10Codes: ['I10'],
        rationale: 'Loại trừ nguyên nhân thần kinh cấp khi đau đầu/chóng mặt kèm dấu hiệu báo động',
        priority: 4,
      },
    ],
  },
  {
    id: 'std-mri-spine',
    name: 'MRI cột sống thắt lưng',
    category: 'Chẩn đoán hình ảnh',
    code: 'MRI-LSP',
    clinicalLinks: [
      {
        symptomKeywords: ['đau lưng'],
        rationale: 'Chỉ định khi đau lưng kéo dài có dấu hiệu thần kinh',
        priority: 5,
      },
    ],
  },
  {
    id: 'std-ecg',
    name: 'Điện tâm đồ (ECG) 12 chuyển đạo',
    category: 'Điện - Chức năng',
    code: 'ECG',
    clinicalLinks: [
      {
        icd10Codes: ['R07', 'R07.4', 'I10', 'I20', 'I11'],
        symptomKeywords: ['đau ngực', 'khó thở', 'chóng mặt', 'mệt mỏi'],
        rationale: 'Bắt buộc khi đau ngực hoặc THA — sàng lồi tim mạch theo WHO HEARTS',
        whoRef: 'WHO HEARTS technical package',
        priority: 1,
      },
    ],
  },
  {
    id: 'std-holter',
    name: 'Holter điện tâm đồ 24 giờ',
    category: 'Điện - Chức năng',
    code: 'HOLTER',
    clinicalLinks: [
      {
        icd10Codes: ['I10', 'I20'],
        symptomKeywords: ['chóng mặt', 'đau ngực', 'khó thở'],
        rationale: 'Theo dõi rối loạn nhịp khi triệu chứng tim mạch tái phát ngoại viện',
        priority: 4,
      },
    ],
  },
  {
    id: 'std-spiro',
    name: 'Đo chức năng hô hấp (Spiro)',
    category: 'Điện - Chức năng',
    code: 'SPIRO',
    clinicalLinks: [
      {
        icd10Codes: ['J20', 'J06'],
        symptomKeywords: ['ho', 'khó thở', 'khó thở khi gắng sức'],
        rationale: 'Đánh giá tắc nghẽn đường thở trong COPD/hen — theo WHO chronic respiratory disease',
        whoRef: 'WHO chronic respiratory diseases',
        priority: 2,
      },
    ],
  },
  {
    id: 'std-endo-upper',
    name: 'Nội soi dạ dày - tá tràng',
    category: 'Nội soi',
    code: 'EGD',
    clinicalLinks: [
      {
        icd10Codes: ['K29', 'K21'],
        symptomKeywords: ['đau bụng', 'thượng vị', 'ợ chua', 'nôn'],
        rationale: 'Chỉ định khi đau thượng vị kéo dài hoặc nghi ngờ loét/viêm dạ dày tá tràng',
        priority: 3,
      },
    ],
  },
  {
    id: 'std-colon',
    name: 'Nội soi đại tràng',
    category: 'Nội soi',
    code: 'COLON',
    clinicalLinks: [
      {
        symptomKeywords: ['đau bụng', 'tiêu chảy', 'phân đen'],
        rationale: 'Sàng lọc ung thư đại trực tràng hoặc chảy máu tiêu hóa kéo dài',
        whoRef: 'WHO cancer screening',
        priority: 5,
      },
    ],
  },
];

export const STANDARD_INDICATION_CATEGORIES = [
  'Xét nghiệm máu',
  'Chẩn đoán hình ảnh',
  'Điện - Chức năng',
  'Nội soi',
] as const;

export const getIndicationsByCategory = (category: string): StandardParaclinicalIndication[] =>
  STANDARD_PARACLINICAL_INDICATIONS.filter((item) => item.category === category);
