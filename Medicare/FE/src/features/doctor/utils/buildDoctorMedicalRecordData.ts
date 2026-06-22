import {
  DoctorPatientListItem,
  MedicalRecordData,
  ParaclinicalTest,
  PrescriptionItem,
  WaitingPatient,
} from '../types';
import { normalizeSpecialtyName } from '../../../constants/clinicSpecialties';
import {
  getClinicalMedicationSuggestions,
  getMedicationRecommendations,
  getParaclinicalRecommendations,
} from './clinicalRecommendations';
import { ClinicalContextInput } from './clinicalContext';
import { STANDARD_MEDICATIONS, toPrescriptionItem } from './standardMedications';
import {
  buildWaitingPatientsForRecord,
  getDoctorPatientById,
  getDoctorPatientExtendedInfo,
} from './doctorPatientRegistry';

const ADDRESSES = [
  'Quận 1, TP. Hồ Chí Minh',
  'Quận 3, TP. Hồ Chí Minh',
  'Quận 7, TP. Hồ Chí Minh',
  'Thủ Đức, TP. Hồ Chí Minh',
];

type SupportedSpecialty =
  | 'Tim mạch'
  | 'Cơ xương khớp'
  | 'Sản & Nhi'
  | 'Mắt';

interface SpecialtyClinicalProfile {
  symptom: string;
  diagnosis: string;
  additionalNotes: string;
  histories: string[];
  allergies: string[];
  fallbackTests: string[];
  fallbackPrescriptions: string[];
  historyEntries: Array<{ date: string; doctor: string; diagnosis: string }>;
  labResults: MedicalRecordData['labResults'];
}

const SPECIALTY_PROFILES: Record<SupportedSpecialty, SpecialtyClinicalProfile> = {
  'Tim mạch': {
    symptom: 'Triệu chứng chính: đau ngực nhẹ khi gắng sức, hồi hộp và khó thở thoáng qua khi leo cầu thang.',
    diagnosis: 'Theo dõi tăng huyết áp và đau thắt ngực ổn định (I10, I20).',
    additionalNotes: 'Khuyến cáo theo dõi huyết áp tại nhà, hạn chế muối và tái khám đúng hẹn.',
    histories: ['Tăng huyết áp đang điều trị ngoại trú', 'Rối loạn lipid máu'],
    allergies: ['Hải sản'],
    fallbackTests: ['Điện tâm đồ (ECG) 12 chuyển đạo', 'Xét nghiệm lipid máu (Cholesterol, TG, HDL, LDL)'],
    fallbackPrescriptions: ['Amlodipine 5mg', 'Atorvastatin 10mg'],
    historyEntries: [
      { date: '14/06/2026', doctor: 'BS. Lê Minh Tuấn', diagnosis: 'Tăng huyết áp vô căn (I10)' },
      { date: '20/05/2026', doctor: 'BS. Trần Thị Hoa', diagnosis: 'Đau ngực không đặc hiệu (R07.4)' },
      { date: '05/03/2026', doctor: 'BS. Nguyễn Văn An', diagnosis: 'Tái khám tim mạch định kỳ' },
    ],
    labResults: [
      { id: 'lab-ecg-risk', name: 'Huyết áp lúc khám', value: '138/86 mmHg', status: 'upper', statusLabel: 'Cận cao' },
      { id: 'lab-ldl', name: 'LDL-C', value: '138 mg/dL', status: 'upper', statusLabel: 'Cận cao' },
      { id: 'lab-creat', name: 'Creatinine', value: '0.9 mg/dL', status: 'normal', statusLabel: 'Bình thường' },
    ],
  },
  'Cơ xương khớp': {
    symptom: 'Triệu chứng chính: đau lưng dưới lan mông phải, tăng khi cúi người và vận động nhiều.',
    diagnosis: 'Đau thắt lưng cơ học / hội chứng cột sống thắt lưng (M54.5).',
    additionalNotes: 'Ưu tiên nghỉ ngơi tương đối, tránh mang nặng và theo dõi đáp ứng với giảm đau kháng viêm.',
    histories: ['Đau lưng tái phát sau vận động nặng'],
    allergies: ['Hải sản'],
    fallbackTests: ['MRI cột sống thắt lưng', 'Xét nghiệm máu tổng quát (CBC)'],
    fallbackPrescriptions: ['Ibuprofen 400mg', 'Paracetamol 500mg'],
    historyEntries: [
      { date: '10/06/2026', doctor: 'BS. Hoàng Văn Đức', diagnosis: 'Thoái hóa cột sống thắt lưng' },
      { date: '18/04/2026', doctor: 'BS. Phạm Thu Dung', diagnosis: 'Đau cơ cạnh sống, theo dõi chèn ép rễ thần kinh' },
      { date: '06/02/2026', doctor: 'BS. Trần Thị Phương', diagnosis: 'Căng cơ vùng thắt lưng sau lao động' },
    ],
    labResults: [
      { id: 'lab-crp', name: 'CRP', value: '4.2 mg/L', status: 'normal', statusLabel: 'Bình thường' },
      { id: 'lab-cbc', name: 'Bạch cầu', value: '7.8 G/L', status: 'normal', statusLabel: 'Bình thường' },
      { id: 'lab-vitd', name: 'Vitamin D', value: '24 ng/mL', status: 'upper', statusLabel: 'Thiếu nhẹ' },
    ],
  },
  'Sản & Nhi': {
    symptom: 'Triệu chứng chính: sốt nhẹ, ho và quấy khóc về đêm, ăn uống giảm so với ngày thường.',
    diagnosis: 'Nhiễm siêu vi hô hấp trên chưa biến chứng (J06).',
    additionalNotes: 'Theo dõi nhiệt độ, bù nước đầy đủ và tái khám sớm nếu sốt tăng hoặc khó thở.',
    histories: ['Dị ứng thời tiết theo mùa'],
    allergies: ['Sữa bò'],
    fallbackTests: ['Xét nghiệm máu tổng quát (CBC)', 'X-quang ngực thẳng'],
    fallbackPrescriptions: ['Paracetamol 500mg', 'Loratadine 10mg'],
    historyEntries: [
      { date: '01/06/2026', doctor: 'BS. Nguyễn Thu Thủy', diagnosis: 'Viêm mũi họng cấp' },
      { date: '15/03/2026', doctor: 'BS. Trần Thu Hà', diagnosis: 'Theo dõi viêm hô hấp trên' },
      { date: '10/01/2026', doctor: 'BS. Vũ Hà Phương', diagnosis: 'Tái khám nhi khoa định kỳ' },
    ],
    labResults: [
      { id: 'lab-temp', name: 'Nhiệt độ', value: '37.6°C', status: 'upper', statusLabel: 'Sốt nhẹ' },
      { id: 'lab-wbc', name: 'Bạch cầu', value: '8.6 G/L', status: 'normal', statusLabel: 'Bình thường' },
      { id: 'lab-spo2', name: 'SpO2', value: '98%', status: 'normal', statusLabel: 'Bình thường' },
    ],
  },
  'Mắt': {
    symptom: 'Triệu chứng chính: nhìn mờ mắt phải, khô rát mắt tăng khi làm việc với màn hình kéo dài.',
    diagnosis: 'Tật khúc xạ kèm hội chứng khô mắt (H52.1, H04.1).',
    additionalNotes: 'Hướng dẫn nghỉ mắt định kỳ, nhỏ nước mắt nhân tạo và đo khúc xạ lại khi cần.',
    histories: ['Khô mắt tái diễn khi làm việc màn hình lâu'],
    allergies: [],
    fallbackTests: ['Xét nghiệm máu tổng quát (CBC)'],
    fallbackPrescriptions: ['Paracetamol 500mg'],
    historyEntries: [
      { date: '03/06/2026', doctor: 'BS. Võ Minh Lâm', diagnosis: 'Khô mắt mức độ nhẹ' },
      { date: '11/04/2026', doctor: 'BS. Trần Anh Khoa', diagnosis: 'Cận thị hai mắt' },
      { date: '09/01/2026', doctor: 'BS. Phạm Hoàng Long', diagnosis: 'Tái khám nhãn khoa định kỳ' },
    ],
    labResults: [
      { id: 'lab-va', name: 'Thị lực mắt phải', value: '6/10', status: 'upper', statusLabel: 'Giảm nhẹ' },
      { id: 'lab-iop', name: 'Nhãn áp', value: '16 mmHg', status: 'normal', statusLabel: 'Bình thường' },
      { id: 'lab-schirmer', name: 'Test Schirmer', value: '9 mm/5 phút', status: 'upper', statusLabel: 'Khô nhẹ' },
    ],
  },
};

const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
};

const estimateDateOfBirth = (age: number): string => {
  const year = new Date().getFullYear() - age;
  const month = ((age % 12) + 1).toString().padStart(2, '0');
  const day = ((age % 27) + 1).toString().padStart(2, '0');
  return `${day}/${month}/${year}`;
};

const buildWaitingPatientsFromList = (
  patients: DoctorPatientListItem[],
  currentPatientId: string,
): WaitingPatient[] =>
  patients
    .filter((patient) => patient.id !== currentPatientId && patient.healthStatus === 'waiting')
    .slice(0, 5)
    .map((patient, index) => ({
      id: `queue-${patient.id}`,
      patientId: patient.id,
      name: patient.fullName,
      queueNumber: index + 1,
    }));

const resolveSpecialty = (department?: string): SupportedSpecialty =>
  normalizeSpecialtyName(department) as SupportedSpecialty;

const buildInitialParaclinicalTests = (
  context: ClinicalContextInput,
  fallbackNames: string[],
): ParaclinicalTest[] => {
  const recommended = getParaclinicalRecommendations(context).recommended.slice(0, 4);

  if (recommended.length > 0) {
    return recommended.map((entry, index) => ({
      id: `seed-par-${entry.item.id}`,
      name: entry.item.name,
      checked: index < 2,
      priority: entry.priority <= 2,
    }));
  }

  return fallbackNames.map((name, index) => ({
    id: `fallback-par-${index + 1}`,
    name,
    checked: index === 0,
    priority: index === 0,
  }));
};

const buildInitialPrescriptions = (
  context: ClinicalContextInput,
  fallbackNames: string[],
): PrescriptionItem[] => {
  const recommendations = getMedicationRecommendations(context).recommended.slice(0, 2);

  if (recommendations.length > 0) {
    return recommendations.map((entry) => toPrescriptionItem(entry.item, `seed-${entry.item.id}`));
  }

  const fallbackItems = fallbackNames
    .map((name) => STANDARD_MEDICATIONS.find((item) => item.name === name))
    .filter(Boolean);

  if (fallbackItems.length > 0) {
    return fallbackItems.map((item, index) => toPrescriptionItem(item!, `fallback-${index + 1}`));
  }

  return [];
};

const buildAiSuggestions = (
  context: ClinicalContextInput,
  fallbackNames: string[],
): MedicalRecordData['aiSuggestions'] => {
  const suggestions = getClinicalMedicationSuggestions(context);
  if (suggestions.length > 0) return suggestions;

  return fallbackNames.map((name, index) => ({
    id: `fallback-ai-${index + 1}`,
    name,
    reason: 'Đề xuất theo chuyên khoa đang khám và triệu chứng lâm sàng hiện tại.',
  }));
};

export const buildDoctorMedicalRecordData = (patientId: string): MedicalRecordData | null => {
  const listPatient = getDoctorPatientById(patientId);
  if (!listPatient) return null;
  return buildDoctorMedicalRecordDataFromPatient(listPatient);
};

export const buildDoctorMedicalRecordDataFromPatient = (
  listPatient: DoctorPatientListItem,
  allPatients?: DoctorPatientListItem[],
): MedicalRecordData => {
  const numericSeed = Number(listPatient.id);
  const fallbackSeed = listPatient.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const seed = Number.isFinite(numericSeed) && !Number.isNaN(numericSeed) ? numericSeed : fallbackSeed;

  const extended = getDoctorPatientExtendedInfo(listPatient.id);
  const specialty = resolveSpecialty(listPatient.department);
  const profile = SPECIALTY_PROFILES[specialty];
  const allergies = extended?.allergies.length ? extended.allergies : profile.allergies;
  const medicalHistory = extended?.medicalHistory.length ? extended.medicalHistory : profile.histories;

  const clinicalSymptoms = extended?.clinicalNotes
    ? `Bệnh nhân đến khám ${specialty.toLowerCase()}. ${extended.clinicalNotes}`
    : profile.symptom;

  const preliminaryDiagnosis = extended?.clinicalNotes
    ? profile.diagnosis
    : profile.diagnosis;

  const additionalNotes = extended?.clinicalNotes || profile.additionalNotes;

  const examination = {
    startTime: `${8 + (seed % 4)}:${seed % 2 === 0 ? '00' : '30'}`,
    room: `Phòng ${300 + (seed % 20)}`,
    status: 'examining' as const,
    clinicalSymptoms,
    preliminaryDiagnosis,
    additionalNotes,
  };

  const clinicalContext: ClinicalContextInput = {
    clinicalSymptoms: examination.clinicalSymptoms,
    preliminaryDiagnosis: examination.preliminaryDiagnosis,
    additionalNotes: examination.additionalNotes,
    allergies,
    medicalHistory,
  };

  return {
    patient: {
      id: listPatient.patientCode,
      name: listPatient.fullName,
      dateOfBirth: extended?.dateOfBirth ?? estimateDateOfBirth(listPatient.age),
      age: listPatient.age,
      gender: listPatient.gender,
      phone: formatPhone(listPatient.phone),
      address: extended
        ? [extended.address, extended.province].filter(Boolean).join(', ')
        : ADDRESSES[seed % ADDRESSES.length],
      insuranceStatus:
        extended?.insuranceNumber && extended.insuranceStatus === 'active' ? 'active' : 'inactive',
      allergies,
      medicalHistory,
    },
    examination,
    examinationHistory: profile.historyEntries.map((entry, index) => ({
      id: `${index + 1}`,
      date: entry.date,
      doctor: entry.doctor,
      diagnosis: entry.diagnosis,
    })),
    paraclinicalTests: buildInitialParaclinicalTests(clinicalContext, profile.fallbackTests),
    labResults: profile.labResults,
    prescriptions: buildInitialPrescriptions(clinicalContext, profile.fallbackPrescriptions),
    aiSuggestions: buildAiSuggestions(clinicalContext, profile.fallbackPrescriptions),
    waitingPatients: allPatients
      ? buildWaitingPatientsFromList(allPatients, listPatient.id)
      : buildWaitingPatientsForRecord(listPatient.id),
  };
};
