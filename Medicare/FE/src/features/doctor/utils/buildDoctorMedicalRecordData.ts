import { MedicalRecordData, ParaclinicalTest, PrescriptionItem } from '../types';
import {
  getMedicationRecommendations,
  getParaclinicalRecommendations,
} from './clinicalRecommendations';
import { ClinicalContextInput } from './clinicalContext';
import { toPrescriptionItem } from './standardMedications';
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

const ALLERGY_POOL = [
  ['PENICILLIN', 'SULFONAMIDES'],
  ['ASPirin'],
  ['Hải sản'],
  [],
];

const HISTORY_POOL = [
  ['Tăng huyết áp (từ 2020)', 'Đái tháo đường type 2'],
  ['Hen suyễn nhẹ', 'Viêm mũi dị ứng'],
  ['Viêm dạ dày mạn tính'],
  ['Tăng mỡ máu', 'Gout'],
];

const SYMPTOM_TEMPLATES = [
  'Bệnh nhân than phiền {symptom}. Không sốt, không ho, không khó thở.',
  'Bệnh nhân đến khám vì {symptom}. Tiền sử bệnh nền đã được ghi nhận trong hồ sơ.',
  'Triệu chứng chính: {symptom}. Bệnh nhân tự theo dõi tại nhà trước khi đến viện.',
];

const SYMPTOMS = [
  'đau đầu, chóng mặt khi đứng dậy đột ngột',
  'đau ngực âm ỉ, khó thở khi leo cầu thang',
  'ho khan kéo dài 5 ngày, sốt nhẹ về chiều',
  'đau bụng vùng thượng vị sau ăn',
  'mệt mỏi, khát nước nhiều, tiểu đêm',
];

const CLINICAL_PROFILES = [
  {
    symptom: SYMPTOMS[0],
    diagnosis: 'Tăng huyết áp vô căn (I10) - Theo dõi biến chứng',
    template: SYMPTOM_TEMPLATES[0],
  },
  {
    symptom: SYMPTOMS[1],
    diagnosis: 'Đau ngực không đặc hiệu (R07.4) - Loại trừ cấp cứu',
    template: SYMPTOM_TEMPLATES[1],
  },
  {
    symptom: SYMPTOMS[2],
    diagnosis: 'Viêm phế quản cấp (J20) - Theo dõi đáp ứng điều trị',
    template: SYMPTOM_TEMPLATES[1],
  },
  {
    symptom: SYMPTOMS[3],
    diagnosis: 'Viêm dạ dày mạn tính (K29) - Theo dõi điều trị',
    template: SYMPTOM_TEMPLATES[2],
  },
  {
    symptom: SYMPTOMS[4],
    diagnosis: 'Đái tháo đường type 2 (E11) - Tái khám định kỳ',
    template: SYMPTOM_TEMPLATES[2],
  },
];

const buildInitialParaclinicalTests = (context: ClinicalContextInput): ParaclinicalTest[] =>
  getParaclinicalRecommendations(context)
    .recommended.slice(0, 4)
    .map((entry, index) => ({
      id: `seed-par-${entry.item.id}`,
      name: entry.item.name,
      checked: index < 2,
      priority: entry.priority <= 2,
    }));

const buildInitialPrescriptions = (context: ClinicalContextInput): PrescriptionItem[] =>
  getMedicationRecommendations(context)
    .recommended.slice(0, 2)
    .map((entry) => toPrescriptionItem(entry.item, `seed-${entry.item.id}`));

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

export const buildDoctorMedicalRecordData = (patientId: string): MedicalRecordData | null => {
  const listPatient = getDoctorPatientById(patientId);
  if (!listPatient) {
    return null;
  }

  const seed = Number(listPatient.id);
  const extended = getDoctorPatientExtendedInfo(patientId);
  const profile = CLINICAL_PROFILES[seed % CLINICAL_PROFILES.length];
  const allergies = extended?.allergies.length
    ? extended.allergies
    : ALLERGY_POOL[seed % ALLERGY_POOL.length];
  const medicalHistory = extended?.medicalHistory.length
    ? extended.medicalHistory
    : HISTORY_POOL[seed % HISTORY_POOL.length];

  const examination = {
    startTime: `${8 + (seed % 4)}:${seed % 2 === 0 ? '00' : '30'}`,
    room: `Phòng ${300 + (seed % 20)}`,
    status: 'examining' as const,
    clinicalSymptoms: extended?.clinicalNotes
      ? `Bệnh nhân mới đăng ký. ${extended.clinicalNotes}`
      : profile.template.replace('{symptom}', profile.symptom),
    preliminaryDiagnosis: extended ? 'Khám lần đầu — đánh giá lâm sàng' : profile.diagnosis,
    additionalNotes:
      extended?.clinicalNotes ||
      (listPatient.healthStatus === 'monitoring'
        ? 'Cần theo dõi sát trong 2 tuần tới và tái khám đúng hẹn.'
        : 'Khuyến cáo bệnh nhân hạn chế muối, tập thể dục nhẹ 30 phút/ngày.'),
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
    examinationHistory: [
      {
        id: '1',
        date: listPatient.lastVisit === 'Hôm nay' ? '20/05/2024' : listPatient.lastVisit,
        doctor: 'BS. Lê Minh Tuấn',
        diagnosis: CLINICAL_PROFILES[(seed + 1) % CLINICAL_PROFILES.length].diagnosis,
      },
      {
        id: '2',
        date: '12/10/2023',
        doctor: 'BS. Trần Thị Hoa',
        diagnosis: 'Viêm họng cấp',
      },
      {
        id: '3',
        date: '05/08/2023',
        doctor: 'BS. Nguyễn Văn An',
        diagnosis: 'Tái khám định kỳ',
      },
    ],
    paraclinicalTests: buildInitialParaclinicalTests(clinicalContext),
    labResults: [
      {
        id: '1',
        name: 'Glucose (Lúc đói)',
        value: `${120 + (seed % 30)} mg/dL`,
        status: seed % 2 === 0 ? 'high' : 'upper',
        statusLabel: seed % 2 === 0 ? 'Cao' : 'Giới hạn trên',
      },
      {
        id: '2',
        name: 'HbA1c',
        value: `${(6.5 + (seed % 3) * 0.3).toFixed(1)}%`,
        status: 'upper',
        statusLabel: 'Giới hạn trên',
      },
      {
        id: '3',
        name: 'Creatinine',
        value: '0.9 mg/dL',
        status: 'normal',
        statusLabel: 'Bình thường',
      },
    ],
    prescriptions: buildInitialPrescriptions(clinicalContext),
    aiSuggestions: [],
    waitingPatients: buildWaitingPatientsForRecord(patientId),
  };
};
