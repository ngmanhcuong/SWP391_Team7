import { User } from '../../../types';
import { PatientHealthRecordsData } from '../types';

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

const buildRecordCode = (user: User): string => {
  const raw = user.id || user._id || user.email || 'guest';
  const suffix = raw.replace(/\W/g, '').slice(-6).toUpperCase().padStart(6, '0');
  return `HS-${suffix}`;
};

export const buildPatientHealthRecordsData = (user: User): PatientHealthRecordsData => {
  const visits = [
    {
      id: 'v1',
      date: '28/05/2026',
      doctorName: 'BS. Trần Văn Hùng',
      specialty: 'Tim mạch',
      diagnosis: 'Tăng huyết áp độ I — theo dõi điều trị',
      symptoms: 'Đau đầu vùng thái dương, hồi hộp khi gắng sức',
      treatment: 'Điều chỉnh chế độ ăn mặn, tái khám sau 4 tuần',
      prescriptions: [
        { id: 'p1', name: 'Amlodipine 5mg', dosage: '1 viên/sáng — uống sau ăn' },
        { id: 'p2', name: 'Aspirin 81mg', dosage: '1 viên/tối' },
      ],
      status: 'completed' as const,
      facility: 'MedCare Clinic - Quận 1',
    },
    {
      id: 'v2',
      date: '15/04/2026',
      doctorName: 'BS. Lê Thị Mai',
      specialty: 'Sản & Nhi',
      diagnosis: 'Viêm họng cấp — đã khỏi',
      symptoms: 'Đau họng, sốt nhẹ 37.8°C',
      treatment: 'Nghỉ ngơi, uống đủ nước, hoàn tất liệu trình kháng sinh',
      prescriptions: [
        { id: 'p3', name: 'Amoxicillin 250mg', dosage: '3 viên/ngày — 7 ngày' },
        { id: 'p4', name: 'Paracetamol 500mg', dosage: 'Khi sốt > 38°C' },
      ],
      status: 'completed' as const,
      facility: 'MedCare Clinic - Quận 1',
    },
    {
      id: 'v3',
      date: '02/03/2026',
      doctorName: 'BS. Phạm Quốc Bảo',
      specialty: 'Cơ xương khớp',
      diagnosis: 'Đau vai gáy do làm việc văn phòng',
      symptoms: 'Đau mỏi vai phải, hạn chế vận động',
      treatment: 'Vật lý trị liệu 5 buổi, tránh ngồi lâu',
      prescriptions: [
        { id: 'p5', name: 'Etoricoxib 60mg', dosage: '1 viên/ngày — sau ăn' },
      ],
      status: 'completed' as const,
      facility: 'MedCare Clinic - Quận 1',
    },
  ];

  const prescriptions = [
    {
      id: 'rx1',
      name: 'Amlodipine 5mg',
      dosage: '1 viên/sáng — uống sau ăn',
      prescribedDate: '28/05/2026',
      doctorName: 'BS. Trần Văn Hùng',
      visitId: 'v1',
      status: 'active' as const,
      duration: '30 ngày',
    },
    {
      id: 'rx2',
      name: 'Aspirin 81mg',
      dosage: '1 viên/tối',
      prescribedDate: '28/05/2026',
      doctorName: 'BS. Trần Văn Hùng',
      visitId: 'v1',
      status: 'active' as const,
      duration: '30 ngày',
    },
    {
      id: 'rx3',
      name: 'Paracetamol 500mg',
      dosage: '2 viên/ngày — sau ăn',
      prescribedDate: '15/04/2026',
      doctorName: 'BS. Lê Thị Mai',
      visitId: 'v2',
      status: 'active' as const,
      duration: '5 ngày',
    },
    {
      id: 'rx4',
      name: 'Amoxicillin 250mg',
      dosage: '3 viên/ngày — 7 ngày',
      prescribedDate: '15/04/2026',
      doctorName: 'BS. Lê Thị Mai',
      visitId: 'v2',
      status: 'completed' as const,
      duration: '7 ngày',
    },
  ];

  const labResults = [
    {
      id: 'lab1',
      name: 'Xét nghiệm máu tổng quát',
      date: '28/05/2026',
      doctorName: 'BS. Trần Văn Hùng',
      status: 'normal' as const,
      summary: 'Hồng cầu, bạch cầu, tiểu cầu trong giới hạn bình thường',
      visitId: 'v1',
    },
    {
      id: 'lab2',
      name: 'Đo lipid máu',
      date: '28/05/2026',
      doctorName: 'BS. Trần Văn Hùng',
      status: 'abnormal' as const,
      summary: 'Cholesterol LDL hơi cao — cần điều chỉnh chế độ ăn',
      visitId: 'v1',
    },
    {
      id: 'lab3',
      name: 'Xét nghiệm đường huyết',
      date: '02/01/2026',
      doctorName: 'BS. Lê Thị Mai',
      status: 'normal' as const,
      summary: 'Glucose lúc đói: 5.2 mmol/L — bình thường',
    },
    {
      id: 'lab4',
      name: 'Siêu âm tim',
      date: '10/12/2025',
      doctorName: 'BS. Trần Văn Hùng',
      status: 'normal' as const,
      summary: 'Chức năng tim bình thường, không phát hiện bất thường',
    },
    {
      id: 'lab5',
      name: 'Xét nghiệm chức năng gan',
      date: '10/12/2025',
      doctorName: 'BS. Lê Thị Mai',
      status: 'pending' as const,
      summary: 'Đang chờ kết quả từ phòng xét nghiệm',
    },
  ];

  const medicalHistory = [
    {
      id: 'h1',
      type: 'allergy' as const,
      label: 'Penicillin',
      detail: 'Phát ban, ngứa da',
      since: '2018',
    },
    {
      id: 'h2',
      type: 'allergy' as const,
      label: 'Hải sản',
      detail: 'Khó thở nhẹ, sưng môi',
      since: '2020',
    },
    {
      id: 'h3',
      type: 'chronic' as const,
      label: 'Tăng huyết áp',
      detail: 'Đang điều trị và theo dõi định kỳ',
      since: '2024',
    },
    {
      id: 'h4',
      type: 'surgery' as const,
      label: 'Cắt ruột thừa',
      detail: 'Phẫu thuật nội soi — Bệnh viện Chợ Rẫy',
      since: '2015',
    },
    {
      id: 'h5',
      type: 'family' as const,
      label: 'Tiền sử gia đình',
      detail: 'Bố mắc tiểu đường type 2, mẹ tăng huyết áp',
    },
  ];

  const activePrescriptionCount = prescriptions.filter((item) => item.status === 'active').length;
  const attentionLabCount = labResults.filter(
    (item) => item.status === 'pending' || item.status === 'abnormal',
  ).length;
  const allergyCount = medicalHistory.filter((item) => item.type === 'allergy').length;

  return {
    recordCode: buildRecordCode(user),
    updatedAt: visits[0]?.date ?? formatDate(new Date()),
    stats: [
      {
        id: 'visits',
        label: 'Lần khám',
        value: visits.length,
        trend: 'Trong 12 tháng',
        trendType: 'neutral',
        icon: 'clock',
        iconBg: 'bg-[rgba(0,82,204,0.1)]',
        tab: 'visits',
      },
      {
        id: 'prescriptions',
        label: 'Đơn thuốc',
        value: activePrescriptionCount,
        trend: 'Đang dùng',
        trendType: 'positive',
        icon: 'calendar',
        iconBg: 'bg-[rgba(130,249,190,0.2)]',
        tab: 'prescriptions',
      },
      {
        id: 'labs',
        label: 'Xét nghiệm',
        value: labResults.length,
        trend: attentionLabCount > 0 ? `${attentionLabCount} cần xem` : undefined,
        trendType: attentionLabCount > 0 ? 'negative' : 'neutral',
        icon: 'flask',
        iconBg: 'bg-[rgba(176,35,0,0.1)]',
        tab: 'labs',
      },
      {
        id: 'allergies',
        label: 'Dị ứng',
        value: allergyCount,
        trend: allergyCount > 0 ? 'Cần lưu ý' : undefined,
        trendType: allergyCount > 0 ? 'negative' : 'neutral',
        icon: 'receipt',
        iconBg: 'bg-[rgba(255,218,214,0.2)]',
        tab: 'history',
      },
    ],
    patientSummary: {
      bloodType: 'O+',
      height: user.height ? `${user.height} cm` : undefined,
      weight: user.weight ? `${user.weight} kg` : undefined,
      lastCheckup: visits[0]?.date,
    },
    visits,
    prescriptions,
    labResults,
    medicalHistory,
  };
};
