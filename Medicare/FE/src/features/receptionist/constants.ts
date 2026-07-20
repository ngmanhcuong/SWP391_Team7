export type RoomKey = 'P101' | 'P102' | 'P201' | 'P202' | 'P301' | 'P302' | 'P401' | 'P402';

export const CLINIC_DEPARTMENTS = [
  'Khoa Tim mạch',
  'Khoa Cơ xương khớp',
  'Khoa Sản & Nhi',
  'Khoa Mắt',
] as const;

export const CLINIC_DOCTORS = [
  'BSCKII. Lê Hoàng Cường',
  'TS.BS. Nguyễn Văn An',
  'TS.BS. Trần Minh Bách',
  'BS. Phạm Thu Dung',
  'BSCKII. Hoàng Văn Đức',
  'TS.BS. Trần Thị Phương',
  'BS. Nguyễn Thị Giang',
  'BS. Vũ Hà Phương',
  'BS. Đặng Quốc Anh',
  'BS. Dương Hoài Phương',
  'BS. Phạm Ngọc Anh',
  'TS.BS. Mai Quốc Thịnh',
] as const;

export const DEPARTMENT_DOCTORS: Record<(typeof CLINIC_DEPARTMENTS)[number], string[]> = {
  'Khoa Tim mạch': ['BSCKII. Lê Hoàng Cường', 'TS.BS. Nguyễn Văn An', 'TS.BS. Trần Minh Bách'],
  'Khoa Cơ xương khớp': ['BS. Phạm Thu Dung', 'BSCKII. Hoàng Văn Đức', 'TS.BS. Trần Thị Phương'],
  'Khoa Sản & Nhi': ['BS. Nguyễn Thị Giang', 'BS. Vũ Hà Phương', 'BS. Đặng Quốc Anh'],
  'Khoa Mắt': ['BS. Dương Hoài Phương', 'BS. Phạm Ngọc Anh', 'TS.BS. Mai Quốc Thịnh'],
};

export const DEPARTMENT_SERVICES: Record<(typeof CLINIC_DEPARTMENTS)[number], string[]> = {
  'Khoa Tim mạch': ['Khám tim mạch tổng quát', 'Điện tim', 'Siêu âm tim'],
  'Khoa Cơ xương khớp': ['Khám đau lưng', 'Khám đau vai gáy', 'Tái khám cơ xương khớp'],
  'Khoa Sản & Nhi': ['Khám nhi tổng quát', 'Khám sản định kỳ', 'Tư vấn dinh dưỡng trẻ em'],
  'Khoa Mắt': ['Khám mắt tổng quát', 'Đo thị lực', 'Soi đáy mắt'],
};

export const CLINIC_ROOMS: {
  key: RoomKey;
  label: string;
  department: (typeof CLINIC_DEPARTMENTS)[number];
  doctor: string;
}[] = [
  { key: 'P101', label: 'TM001', department: 'Khoa Tim mạch', doctor: 'BSCKII. Lê Hoàng Cường' },
  { key: 'P102', label: 'TM002', department: 'Khoa Tim mạch', doctor: 'TS.BS. Nguyễn Văn An' },
  { key: 'P201', label: 'XK001', department: 'Khoa Cơ xương khớp', doctor: 'BS. Phạm Thu Dung' },
  { key: 'P202', label: 'XK002', department: 'Khoa Cơ xương khớp', doctor: 'BSCKII. Hoàng Văn Đức' },
  { key: 'P301', label: 'SN001', department: 'Khoa Sản & Nhi', doctor: 'BS. Nguyễn Thị Giang' },
  { key: 'P302', label: 'SN002', department: 'Khoa Sản & Nhi', doctor: 'BS. Vũ Hà Phương' },
  { key: 'P401', label: 'MT001', department: 'Khoa Mắt', doctor: 'BS. Dương Hoài Phương' },
  { key: 'P402', label: 'MT002', department: 'Khoa Mắt', doctor: 'BS. Phạm Ngọc Anh' },
];

export const getDoctorsByDepartment = (department: string) =>
  DEPARTMENT_DOCTORS[department as (typeof CLINIC_DEPARTMENTS)[number]] ?? [];

export const getServicesByDepartment = (department: string) =>
  DEPARTMENT_SERVICES[department as (typeof CLINIC_DEPARTMENTS)[number]] ?? [];

export type ReceptionistInvoiceStatus = 'paid' | 'cancelled' | 'pending';
export type ReceptionistInvoiceMethod = 'Tiền mặt' | 'Chuyển khoản BIDV' | 'MoMo QR';

export interface ReceptionistServiceLine {
  service: string;
  qty: string;
  unit: number;
  total: number;
}

export interface ReceptionistInvoiceRecord {
  code: string;
  patientId: string;
  name: string;
  dateOfBirth: string;
  department: string;
  doctor: string;
  phone: string;
  insurance: string;
  date: string;
  time: string;
  method: ReceptionistInvoiceMethod;
  amount: number;
  status: ReceptionistInvoiceStatus;
  urgent?: boolean;
  depositDeduction: number;
  insuranceDeduction: number;
  subtotal: number;
  serviceLines: ReceptionistServiceLine[];
}

export const RECEPTIONIST_INVOICE_RECORDS: ReceptionistInvoiceRecord[] = [
  {
    code: 'HD2026071901',
    patientId: 'BN-2026-0018',
    name: 'Đỗ Huy Hoàng',
    dateOfBirth: '21/11/2004',
    department: 'Khoa Cơ xương khớp',
    doctor: 'BSCKII. Hoàng Văn Đức',
    phone: '0837860557',
    insurance: 'Có (80%)',
    date: '19/07/2026',
    time: '09:35',
    method: 'Chuyển khoản BIDV',
    amount: 1150000,
    status: 'paid',
    urgent: true,
    depositDeduction: 100000,
    insuranceDeduction: 250000,
    subtotal: 1500000,
    serviceLines: [
      { service: 'Phí khám chuyên khoa Cơ xương khớp', qty: '1', unit: 300000, total: 300000 },
      { service: 'X-quang cột sống thắt lưng', qty: '1', unit: 450000, total: 450000 },
      { service: 'Siêu âm phần mềm quanh khớp', qty: '1', unit: 500000, total: 500000 },
      { service: 'Thuốc điều trị sau khám', qty: '--', unit: 250000, total: 250000 },
    ],
  },
  {
    code: 'HD2026071902',
    patientId: 'BN-2026-0011',
    name: 'Nguyễn Mạnh Cường',
    dateOfBirth: '30/09/2006',
    department: 'Khoa Cơ xương khớp',
    doctor: 'BSCKII. Hoàng Văn Đức',
    phone: '0812414556',
    insurance: 'Không',
    date: '19/07/2026',
    time: '10:20',
    method: 'MoMo QR',
    amount: 620000,
    status: 'paid',
    depositDeduction: 100000,
    insuranceDeduction: 0,
    subtotal: 720000,
    serviceLines: [
      { service: 'Phí khám tái khám chuyên khoa', qty: '1', unit: 250000, total: 250000 },
      { service: 'Vật lý trị liệu hỗ trợ đau lưng', qty: '1', unit: 320000, total: 320000 },
      { service: 'Thuốc giảm đau kháng viêm', qty: '--', unit: 150000, total: 150000 },
    ],
  },
  {
    code: 'HD2026071903',
    patientId: 'BN-2026-0007',
    name: 'Nguyễn Diệu Nhi',
    dateOfBirth: '08/03/2012',
    department: 'Khoa Sản & Nhi',
    doctor: 'BS. Nguyễn Thị Giang',
    phone: '0902000007',
    insurance: 'Có (80%)',
    date: '19/07/2026',
    time: '10:55',
    method: 'Tiền mặt',
    amount: 380000,
    status: 'paid',
    depositDeduction: 0,
    insuranceDeduction: 120000,
    subtotal: 500000,
    serviceLines: [
      { service: 'Phí khám Nhi tổng quát', qty: '1', unit: 200000, total: 200000 },
      { service: 'Đơn thuốc điều trị sốt siêu vi', qty: '--', unit: 300000, total: 300000 },
    ],
  },
  {
    code: 'HD2026071904',
    patientId: 'BN-2026-0015',
    name: 'Võ Quốc Bảo',
    dateOfBirth: '14/02/1998',
    department: 'Khoa Cơ xương khớp',
    doctor: 'BS. Phạm Thu Dung',
    phone: '0911333999',
    insurance: 'Không',
    date: '19/07/2026',
    time: '11:25',
    method: 'Tiền mặt',
    amount: 450000,
    status: 'pending',
    depositDeduction: 0,
    insuranceDeduction: 0,
    subtotal: 450000,
    serviceLines: [
      { service: 'Phí khám đau vai gáy', qty: '1', unit: 250000, total: 250000 },
      { service: 'Thuốc giãn cơ và giảm đau', qty: '--', unit: 200000, total: 200000 },
    ],
  },
  {
    code: 'HD2026071801',
    patientId: 'BN-2026-0016',
    name: 'Ngô Tuấn Kiệt',
    dateOfBirth: '11/01/1999',
    department: 'Khoa Cơ xương khớp',
    doctor: 'TS.BS. Trần Thị Phương',
    phone: '0901008899',
    insurance: 'Không',
    date: '18/07/2026',
    time: '15:40',
    method: 'Chuyển khoản BIDV',
    amount: 900000,
    status: 'paid',
    depositDeduction: 100000,
    insuranceDeduction: 0,
    subtotal: 1000000,
    serviceLines: [
      { service: 'Phí khám chuyên khoa', qty: '1', unit: 300000, total: 300000 },
      { service: 'Chụp X-quang vai', qty: '1', unit: 350000, total: 350000 },
      { service: 'Thuốc điều trị', qty: '--', unit: 350000, total: 350000 },
    ],
  },
  {
    code: 'HD2026071802',
    patientId: 'BN-2026-0014',
    name: 'Trần Văn Tú',
    dateOfBirth: '03/06/1987',
    department: 'Khoa Tim mạch',
    doctor: 'BSCKII. Lê Hoàng Cường',
    phone: '0901234567',
    insurance: 'Có (80%)',
    date: '18/07/2026',
    time: '08:45',
    method: 'MoMo QR',
    amount: 740000,
    status: 'paid',
    depositDeduction: 100000,
    insuranceDeduction: 160000,
    subtotal: 1000000,
    serviceLines: [
      { service: 'Phí khám tim mạch', qty: '1', unit: 300000, total: 300000 },
      { service: 'Điện tim', qty: '1', unit: 250000, total: 250000 },
      { service: 'Thuốc điều trị huyết áp', qty: '--', unit: 450000, total: 450000 },
    ],
  },
  {
    code: 'HD2026071701',
    patientId: 'BN-2026-0012',
    name: 'Bùi Gia Hân',
    dateOfBirth: '18/12/2017',
    department: 'Khoa Sản & Nhi',
    doctor: 'BS. Nguyễn Thị Giang',
    phone: '0902000007',
    insurance: 'Có (80%)',
    date: '17/07/2026',
    time: '16:10',
    method: 'Tiền mặt',
    amount: 560000,
    status: 'cancelled',
    depositDeduction: 0,
    insuranceDeduction: 140000,
    subtotal: 700000,
    serviceLines: [
      { service: 'Phí khám Nhi', qty: '1', unit: 200000, total: 200000 },
      { service: 'Xét nghiệm máu', qty: '1', unit: 500000, total: 500000 },
    ],
  },
  {
    code: 'HD2026071601',
    patientId: 'BN-2026-0009',
    name: 'Lê Hoàng Nam',
    dateOfBirth: '15/08/1985',
    department: 'Khoa Tim mạch',
    doctor: 'TS.BS. Nguyễn Văn An',
    phone: '0911223344',
    insurance: 'Có (80%)',
    date: '16/07/2026',
    time: '14:05',
    method: 'Chuyển khoản BIDV',
    amount: 1320000,
    status: 'paid',
    depositDeduction: 100000,
    insuranceDeduction: 280000,
    subtotal: 1700000,
    serviceLines: [
      { service: 'Phí khám tim mạch chuyên sâu', qty: '1', unit: 350000, total: 350000 },
      { service: 'Siêu âm tim', qty: '1', unit: 650000, total: 650000 },
      { service: 'Thuốc điều trị', qty: '--', unit: 700000, total: 700000 },
    ],
  },
  {
    code: 'HD2026071501',
    patientId: 'BN-2026-0010',
    name: 'Phạm Mỹ Linh',
    dateOfBirth: '27/04/2001',
    department: 'Khoa Mắt',
    doctor: 'BS. Dương Hoài Phương',
    phone: '0905667788',
    insurance: 'Không',
    date: '15/07/2026',
    time: '09:50',
    method: 'MoMo QR',
    amount: 480000,
    status: 'pending',
    depositDeduction: 0,
    insuranceDeduction: 0,
    subtotal: 480000,
    serviceLines: [
      { service: 'Phí khám mắt', qty: '1', unit: 180000, total: 180000 },
      { service: 'Đo thị lực và soi đáy mắt', qty: '1', unit: 300000, total: 300000 },
    ],
  },
];
