import { PrescriptionItem } from '../types';
import { ClinicalLink } from './standardParaclinicalIndications';

export interface StandardMedication {
  id: string;
  name: string;
  dosage: string;
  quantity: string;
  instructions: string;
  category: string;
  clinicalLinks?: ClinicalLink[];
  contraindicatedAllergies?: string[];
}

export const STANDARD_MEDICATION_CATEGORIES = [
  'Tim mạch - Huyết áp',
  'Tiểu đường - Nội tiết',
  'Kháng sinh',
  'Giảm đau - Hạ sốt',
  'Tiêu hóa - Gan mật',
  'Hô hấp - Dị ứng',
] as const;

export const STANDARD_MEDICATIONS: StandardMedication[] = [
  {
    id: 'med-amlodipine',
    name: 'Amlodipine 5mg',
    dosage: '5mg',
    quantity: '30 viên',
    instructions: 'Uống 1 viên/ngày, sau bữa sáng',
    category: 'Tim mạch - Huyết áp',
    clinicalLinks: [
      {
        icd10Codes: ['I10', 'I11'],
        symptomKeywords: ['đau đầu', 'chóng mặt'],
        rationale: 'Thuốc hạ áp tuyến canxi — đường điều trị đầu tay WHO HEARTS cho THA',
        whoRef: 'WHO HEARTS — Hypertension',
        priority: 1,
      },
    ],
  },
  {
    id: 'med-losartan',
    name: 'Losartan 50mg',
    dosage: '50mg',
    quantity: '30 viên',
    instructions: 'Uống 1 viên/ngày, có thể uống trước hoặc sau ăn',
    category: 'Tim mạch - Huyết áp',
    clinicalLinks: [
      {
        icd10Codes: ['I10', 'I11'],
        symptomKeywords: ['đau ngực', 'khó thở'],
        rationale: 'Ức chế thụ thể angiotensin II — phù hợp THA và bệnh thận đái tháo đường',
        whoRef: 'WHO HEARTS',
        priority: 2,
      },
    ],
  },
  {
    id: 'med-bisoprolol',
    name: 'Bisoprolol 2.5mg',
    dosage: '2.5mg',
    quantity: '30 viên',
    instructions: 'Uống 1 viên/ngày, buổi sáng',
    category: 'Tim mạch - Huyết áp',
    clinicalLinks: [
      {
        icd10Codes: ['I10', 'I20', 'R07', 'R07.4'],
        symptomKeywords: ['đau ngực', 'khó thở'],
        rationale: 'Beta-blocker chọn lọc — hỗ trợ kiểm soát nhịp tim và giảm gắng sức tim',
        whoRef: 'WHO cardiovascular pharmacotherapy',
        priority: 3,
      },
    ],
  },
  {
    id: 'med-atorvastatin',
    name: 'Atorvastatin 10mg',
    dosage: '10mg',
    quantity: '30 viên',
    instructions: 'Uống 1 viên/ngày, buổi tối',
    category: 'Tim mạch - Huyết áp',
    clinicalLinks: [
      {
        icd10Codes: ['E78', 'E78.5', 'I10', 'E11'],
        rationale: 'Statin giảm LDL — điều trị rối loạn lipid và giảm nguy cơ tim mạch theo WHO',
        whoRef: 'WHO CVD risk management',
        priority: 1,
      },
    ],
  },
  {
    id: 'med-metformin',
    name: 'Metformin 850mg',
    dosage: '850mg',
    quantity: '60 viên',
    instructions: 'Uống 1 viên x 2 lần/ngày, sau ăn',
    category: 'Tiểu đường - Nội tiết',
    clinicalLinks: [
      {
        icd10Codes: ['E11'],
        symptomKeywords: ['khát nước', 'tiểu đêm', 'mệt mỏi'],
        rationale: 'Biguanid đầu tay cho ĐTĐ type 2 — khuyến cáo WHO trừ khi chống chỉ định',
        whoRef: 'WHO PEN — Diabetes',
        priority: 1,
      },
    ],
  },
  {
    id: 'med-gliclazide',
    name: 'Gliclazide 30mg',
    dosage: '30mg',
    quantity: '30 viên',
    instructions: 'Uống 1 viên/ngày, trước bữa sáng 30 phút',
    category: 'Tiểu đường - Nội tiết',
    clinicalLinks: [
      {
        icd10Codes: ['E11'],
        symptomKeywords: ['khát nước', 'tiểu nhiều'],
        rationale: 'Sulfonylurea thế hệ mới — bổ sung khi HbA1c chưa đạt mục tiêu với metformin',
        whoRef: 'WHO essential medicines — diabetes',
        priority: 3,
      },
    ],
  },
  {
    id: 'med-levothyroxine',
    name: 'Levothyroxine 50mcg',
    dosage: '50mcg',
    quantity: '30 viên',
    instructions: 'Uống 1 viên/ngày, buổi sáng khi đói',
    category: 'Tiểu đường - Nội tiết',
    clinicalLinks: [
      {
        icd10Codes: ['E03'],
        symptomKeywords: ['mệt mỏi', 'chóng mặt'],
        rationale: 'Thay thế hormone tuyến giáp khi suy giáp được xác định',
        whoRef: 'WHO essential medicines',
        priority: 2,
      },
    ],
  },
  {
    id: 'med-amoxicillin',
    name: 'Amoxicillin 500mg',
    dosage: '500mg',
    quantity: '21 viên',
    instructions: 'Uống 1 viên x 3 lần/ngày, sau ăn, dùng hết liệu trình',
    category: 'Kháng sinh',
    contraindicatedAllergies: ['penicillin', 'amoxicillin', 'beta-lactam'],
    clinicalLinks: [
      {
        icd10Codes: ['J20'],
        symptomKeywords: ['ho', 'sốt'],
        rationale: 'Kháng sinh beta-lactam khi nghi ngờ nhiễm khuẩn kèm theo — chỉ khi không có dị ứng penicillin',
        whoRef: 'WHO AWaRe antibiotic classification',
        priority: 4,
      },
    ],
  },
  {
    id: 'med-azithromycin',
    name: 'Azithromycin 500mg',
    dosage: '500mg',
    quantity: '3 viên',
    instructions: 'Uống 1 viên/ngày x 3 ngày',
    category: 'Kháng sinh',
    clinicalLinks: [
      {
        icd10Codes: ['J20', 'J06'],
        symptomKeywords: ['ho khan', 'sốt', 'ho'],
        rationale: 'Macrolide thay thế khi chống chỉ định penicillin hoặc nghi ngờ viêm phế quản do atypical',
        whoRef: 'WHO AWaRe — Watch group',
        priority: 2,
      },
    ],
  },
  {
    id: 'med-cefixime',
    name: 'Cefixime 200mg',
    dosage: '200mg',
    quantity: '10 viên',
    instructions: 'Uống 1 viên x 2 lần/ngày',
    category: 'Kháng sinh',
    contraindicatedAllergies: ['cephalosporin', 'cef'],
    clinicalLinks: [
      {
        icd10Codes: ['J06'],
        symptomKeywords: ['sốt', 'ho'],
        rationale: 'Cephalosporin thế hệ 3 khi cần phổ rộng hơn trong nhiễm trùng hô hấp',
        priority: 5,
      },
    ],
  },
  {
    id: 'med-paracetamol',
    name: 'Paracetamol 500mg',
    dosage: '500mg',
    quantity: '20 viên',
    instructions: 'Uống 1-2 viên/lần, tối đa 4 lần/ngày khi sốt hoặc đau',
    category: 'Giảm đau - Hạ sốt',
    clinicalLinks: [
      {
        icd10Codes: ['J20', 'J06'],
        symptomKeywords: ['sốt', 'đau đầu', 'đau ngực', 'ho'],
        rationale: 'Giảm đau hạ sốt an toàn — thuốc hạ sốt/giảm đau ưu tiên WHO',
        whoRef: 'WHO Model List of Essential Medicines',
        priority: 1,
      },
    ],
  },
  {
    id: 'med-ibuprofen',
    name: 'Ibuprofen 400mg',
    dosage: '400mg',
    quantity: '20 viên',
    instructions: 'Uống 1 viên x 2-3 lần/ngày, sau ăn',
    category: 'Giảm đau - Hạ sốt',
    contraindicatedAllergies: ['aspirin', 'nsaid'],
    clinicalLinks: [
      {
        symptomKeywords: ['đau đầu', 'sốt'],
        rationale: 'NSAID giảm viêm đau — thận trọng ở THA, suy thận và loét dạ dày',
        priority: 4,
      },
    ],
  },
  {
    id: 'med-esomeprazole',
    name: 'Esomeprazole 20mg',
    dosage: '20mg',
    quantity: '14 viên',
    instructions: 'Uống 1 viên/ngày, trước bữa sáng 30 phút',
    category: 'Giảm đau - Hạ sốt',
    clinicalLinks: [
      {
        icd10Codes: ['K29', 'K21'],
        symptomKeywords: ['thượng vị', 'ợ chua', 'đau bụng'],
        rationale: 'Ức chế bơm proton khi viêm loét dạ dày hoặc cần bảo vệ dạ dày khi dùng NSAID',
        priority: 2,
      },
    ],
  },
  {
    id: 'med-omeprazole',
    name: 'Omeprazole 20mg',
    dosage: '20mg',
    quantity: '28 viên',
    instructions: 'Uống 1 viên/ngày, trước bữa sáng 30 phút',
    category: 'Tiêu hóa - Gan mật',
    clinicalLinks: [
      {
        icd10Codes: ['K29', 'K21'],
        symptomKeywords: ['thượng vị', 'ợ chua', 'đau bụng'],
        rationale: 'Điều trị GERD/viêm dạ dày — PPI tiêu chuẩn trong thực hành lâm sàng',
        priority: 1,
      },
    ],
  },
  {
    id: 'med-domperidone',
    name: 'Domperidone 10mg',
    dosage: '10mg',
    quantity: '30 viên',
    instructions: 'Uống 1 viên x 3 lần/ngày, trước ăn 15-30 phút',
    category: 'Tiêu hóa - Gan mật',
    clinicalLinks: [
      {
        symptomKeywords: ['nôn', 'đau bụng', 'thượng vị'],
        rationale: 'Chống nôn, tăng nhu động dạ dày khi buồn nôn kèm bệnh lý tiêu hóa',
        priority: 3,
      },
    ],
  },
  {
    id: 'med-ursodeoxycholic',
    name: 'Ursodeoxycholic acid 250mg',
    dosage: '250mg',
    quantity: '30 viên',
    instructions: 'Uống 1 viên x 2 lần/ngày, sau ăn',
    category: 'Tiêu hóa - Gan mật',
    clinicalLinks: [
      {
        symptomKeywords: ['đau bụng', 'thượng vị'],
        rationale: 'Hỗ trợ bệnh lý gan mật/sỏi mật cholesterol theo chỉ định chuyên khoa',
        priority: 5,
      },
    ],
  },
  {
    id: 'med-salbutamol',
    name: 'Salbutamol 2mg',
    dosage: '2mg',
    quantity: '30 viên',
    instructions: 'Uống 1-2 viên x 3 lần/ngày khi khó thở',
    category: 'Hô hấp - Dị ứng',
    clinicalLinks: [
      {
        icd10Codes: ['J20', 'J06'],
        symptomKeywords: ['khó thở', 'ho', 'ho khan'],
        rationale: 'Bronchodilator cấp cứu co thắt phế quản — thuốc thiết yếu WHO cho hen/COPD',
        whoRef: 'WHO essential asthma medicines',
        priority: 1,
      },
    ],
  },
  {
    id: 'med-loratadine',
    name: 'Loratadine 10mg',
    dosage: '10mg',
    quantity: '10 viên',
    instructions: 'Uống 1 viên/ngày, có thể uống trước hoặc sau ăn',
    category: 'Hô hấp - Dị ứng',
    clinicalLinks: [
      {
        icd10Codes: ['J06'],
        symptomKeywords: ['ho', 'sổ mũi'],
        rationale: 'Kháng histamin thế hệ 2 cho viêm mũi dị ứng kèm viêm đường hô hấp',
        priority: 3,
      },
    ],
  },
  {
    id: 'med-acetylcysteine',
    name: 'Acetylcysteine 200mg',
    dosage: '200mg',
    quantity: '20 gói',
    instructions: 'Pha 1 gói x 3 lần/ngày, uống sau ăn',
    category: 'Hô hấp - Dị ứng',
    clinicalLinks: [
      {
        icd10Codes: ['J20'],
        symptomKeywords: ['ho khan', 'ho'],
        rationale: 'Long đàm, giảm ho khan trong viêm phế quản cấp',
        priority: 2,
      },
    ],
  },
];

export const getMedicationsByCategory = (category: string): StandardMedication[] =>
  STANDARD_MEDICATIONS.filter((med) => med.category === category);

export const toPrescriptionItem = (
  med: StandardMedication,
  idSuffix?: string,
): PrescriptionItem => ({
  id: `rx-${med.id}-${idSuffix ?? Date.now()}`,
  name: med.name,
  dosage: med.dosage,
  quantity: med.quantity,
  instructions: med.instructions,
});
