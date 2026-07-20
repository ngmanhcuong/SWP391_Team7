require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const MedicalHistory = require('../models/MedicalHistory');
const Visit = require('../models/Visit');

const profiles = [
  {
    patientCode: 'BN-2026-0007',
    userEmail: 'ngmanhcuong300906@gmail.com',
    user: {
      fullName: 'Nguyễn Mạnh Cường',
      phone: '0837860557',
      dateOfBirth: new Date('2006-09-30'),
      gender: 'male',
      address: '33 Lê Thiện Trị, Phường Hòa Hải, Quận Ngũ Hành Sơn, TP. Đà Nẵng',
      nationalId: '09182827236',
      occupation: 'Sinh viên công nghệ thông tin',
      emergencyPhone: '0912345678',
      bio: 'Thường xuyên ngồi học và làm việc với máy tính thời gian dài.',
      height: 173,
      weight: 58,
    },
    patient: {
      fullName: 'Nguyễn Mạnh Cường',
      phone: '0837860557',
      nationalId: '09182827236',
      dob: new Date('2006-09-30'),
      gender: 'male',
      address: '33 Lê Thiện Trị, Phường Hòa Hải, Quận Ngũ Hành Sơn, TP. Đà Nẵng',
      email: 'ngmanhcuong300906@gmail.com',
      insurance: {
        code: 'DN4020123456789',
        expiry: new Date('2027-12-31'),
        place: 'Bệnh viện Đà Nẵng',
      },
    },
    histories: [
      { type: 'chronic', label: 'Đau thắt lưng cơ học tái phát', detail: 'Đau tăng khi ngồi lâu và cúi người, chưa ghi nhận chèn ép thần kinh.', since: '2025' },
      { type: 'allergy', label: 'Dị ứng hải sản', detail: 'Nổi mề đay và ngứa da khi ăn tôm cua số lượng nhiều.', since: '2022' },
      { type: 'family', label: 'Tiền sử gia đình', detail: 'Cha thoái hóa cột sống thắt lưng, mẹ đau khớp gối mạn tính.', since: '' },
    ],
    visits: [
      {
        date: new Date('2026-05-22T08:30:00+07:00'),
        doctorName: 'BSCKI. Hoàng Văn Đức',
        specialty: 'Khoa Cơ xương khớp',
        diagnosis: 'Đau thắt lưng cơ học sau vận động thể thao',
        symptoms: 'Đau vùng thắt lưng phải sau khi chơi cầu lông, tăng khi xoay người.',
        treatment: 'Kê thuốc giảm đau ngắn ngày, hướng dẫn bài tập kéo giãn cột sống thắt lưng.',
        prescriptions: [
          { name: 'Eperisone 50mg', dosage: '1 viên x 2 lần/ngày sau ăn', duration: '7 ngày', status: 'completed' },
          { name: 'Diclofenac 50mg', dosage: '1 viên buổi tối sau ăn', duration: '5 ngày', status: 'completed' },
        ],
      },
    ],
    appointmentUpdates: {
      '#LH-9804': {
        service: 'Khám đau mạn sườn lưng',
        symptoms: 'Đau vùng mạn sườn lưng phải sau khi chơi cầu lông, đau tăng khi xoay người và bê vật nặng.',
        additionalNotes: 'Đã nghỉ ngơi 2 ngày nhưng đau vẫn còn âm ỉ.',
      },
      '#LH-9805': {
        service: 'Khám đau thắt lưng',
        symptoms: 'Đau thắt lưng âm ỉ lan nhẹ xuống mông phải, ngồi học lâu hơn 2 giờ thì đau tăng rõ.',
        additionalNotes: 'Mong muốn được kiểm tra lại cột sống và tư vấn bài tập phục hồi.',
      },
      '#LH-9812': {
        service: 'Tái khám cơ xương khớp',
        symptoms: 'Tái khám đau lưng sau đợt thuốc trước, cần đánh giá lại biên độ vận động và mức độ đau.',
        additionalNotes: 'Bệnh nhân đã tập kéo giãn tại nhà nhưng vẫn mỏi khi ngồi lâu.',
      },
    },
  },
  {
    patientCode: 'BN-2026-0012',
    userEmail: 'vo.quoc.bao@medicare.com',
    user: {
      fullName: 'Võ Quốc Bảo',
      phone: '0902000005',
      password: 'Medicare@123',
      dateOfBirth: new Date('1991-04-18'),
      gender: 'male',
      address: '15 Đường số 8, Phường Linh Trung, TP. Thủ Đức, TP.HCM',
      nationalId: '079191456782',
      occupation: 'Kỹ sư cơ khí',
      emergencyPhone: '0915552201',
      bio: 'Công việc phải lái xe và mang vác thiết bị tại công trình.',
      height: 170,
      weight: 72,
      isEmailVerified: true,
      role: 'patient',
    },
    patient: {
      fullName: 'Võ Quốc Bảo',
      phone: '0902000005',
      nationalId: '079191456782',
      dob: new Date('1991-04-18'),
      gender: 'male',
      address: '15 Đường số 8, Phường Linh Trung, TP. Thủ Đức, TP.HCM',
      email: 'vo.quoc.bao@medicare.com',
      insurance: {
        code: 'HCM7910234567890',
        expiry: new Date('2027-06-30'),
        place: 'Bệnh viện Thủ Đức',
      },
    },
    histories: [
      { type: 'chronic', label: 'Tăng huyết áp độ I', detail: 'Đang theo dõi huyết áp tại nhà, huyết áp dao động 135-145/85-90 mmHg.', since: '2024' },
      { type: 'chronic', label: 'Thoái hóa cột sống cổ sớm', detail: 'Đau cổ vai gáy tăng khi lái xe đường dài.', since: '2025' },
      { type: 'allergy', label: 'Dị ứng bụi nhà', detail: 'Hắt hơi, nghẹt mũi khi thời tiết thay đổi hoặc tiếp xúc bụi công trình.', since: '2018' },
      { type: 'family', label: 'Tiền sử gia đình', detail: 'Cha tăng huyết áp, mẹ đái tháo đường type 2.', since: '' },
    ],
    visits: [
      {
        date: new Date('2026-04-11T08:30:00+07:00'),
        doctorName: 'BSCKII. Lê Hoàng Cường',
        specialty: 'Khoa Tim mạch',
        diagnosis: 'Tăng huyết áp độ I, chưa biến chứng cơ quan đích',
        symptoms: 'Đau đầu nhẹ buổi sáng, mệt sau khi leo cầu thang, huyết áp cao khi đo tại nhà.',
        treatment: 'Hướng dẫn giảm muối, kiểm soát cân nặng và dùng thuốc hạ áp liều thấp.',
        prescriptions: [
          { name: 'Amlodipine 5mg', dosage: '1 viên buổi sáng', duration: '30 ngày', status: 'completed' },
        ],
      },
      {
        date: new Date('2026-06-28T14:30:00+07:00'),
        doctorName: 'BSCKI. Hoàng Văn Đức',
        specialty: 'Khoa Cơ xương khớp',
        diagnosis: 'Hội chứng cổ vai gáy do quá tải cơ',
        symptoms: 'Đau cổ vai gáy bên phải, tê nhẹ cánh tay sau khi lái xe liên tục nhiều giờ.',
        treatment: 'Thuốc giãn cơ 5 ngày, kết hợp chườm ấm và điều chỉnh tư thế làm việc.',
        prescriptions: [
          { name: 'Tolperisone 150mg', dosage: '1 viên x 2 lần/ngày', duration: '5 ngày', status: 'completed' },
          { name: 'Meloxicam 7.5mg', dosage: '1 viên sau ăn sáng', duration: '5 ngày', status: 'completed' },
        ],
      },
    ],
    appointmentUpdates: {
      '#LH-9901': {
        service: 'Tái khám tim mạch',
        symptoms: 'Tái khám huyết áp, gần đây hay đau đầu nhẹ và mệt khi làm việc nặng ngoài công trình.',
        additionalNotes: 'Đã uống thuốc đều 3 tuần nhưng huyết áp chiều vẫn tăng nhẹ.',
      },
      '#LH-9908': {
        service: 'Khám đau vai gáy',
        symptoms: 'Đau cổ vai gáy phải kéo dài 10 ngày, đau tăng khi quay cổ sang phải và lái xe xa.',
        additionalNotes: 'Bệnh nhân muốn kiểm tra nguy cơ chèn ép rễ thần kinh cổ.',
      },
    },
  },
  {
    patientCode: 'BN-2026-0016',
    userEmail: 'ngo.tuan.kiet@medicare.com',
    user: {
      fullName: 'Ngô Tuấn Kiệt',
      phone: '0902000009',
      password: 'Medicare@123',
      dateOfBirth: new Date('1986-11-09'),
      gender: 'male',
      address: '212 Trần Hưng Đạo, Phường 11, Quận 5, TP.HCM',
      nationalId: '079186234567',
      occupation: 'Nhân viên kho vận',
      emergencyPhone: '0938123456',
      bio: 'Thường xuyên bốc xếp hàng nặng và đứng liên tục nhiều giờ.',
      height: 168,
      weight: 74,
      isEmailVerified: true,
      role: 'patient',
    },
    patient: {
      fullName: 'Ngô Tuấn Kiệt',
      phone: '0902000009',
      nationalId: '079186234567',
      dob: new Date('1986-11-09'),
      gender: 'male',
      address: '212 Trần Hưng Đạo, Phường 11, Quận 5, TP.HCM',
      email: 'ngo.tuan.kiet@medicare.com',
      insurance: {
        code: 'HCM8611092345678',
        expiry: new Date('2027-09-30'),
        place: 'Bệnh viện Nguyễn Trãi',
      },
    },
    histories: [
      { type: 'chronic', label: 'Thoát vị đĩa đệm thắt lưng L4-L5 mức độ nhẹ', detail: 'Đã chụp MRI năm 2025, đau tăng khi khuân hàng hoặc cúi nhiều.', since: '2025' },
      { type: 'chronic', label: 'Viêm dạ dày', detail: 'Có tiền sử đau thượng vị khi dùng thuốc giảm đau kéo dài.', since: '2021' },
      { type: 'allergy', label: 'Dị ứng NSAID nhóm ibuprofen', detail: 'Uống ibuprofen gây cồn cào dạ dày và nổi mẩn đỏ nhẹ.', since: '2023' },
      { type: 'family', label: 'Tiền sử gia đình', detail: 'Mẹ từng phẫu thuật thoái hóa khớp gối, anh trai có thoát vị đĩa đệm.', since: '' },
    ],
    visits: [
      {
        date: new Date('2026-03-16T09:00:00+07:00'),
        doctorName: 'BSCKI. Hoàng Văn Đức',
        specialty: 'Khoa Cơ xương khớp',
        diagnosis: 'Đau cột sống thắt lưng do quá tải lao động',
        symptoms: 'Đau thắt lưng giữa, đau tăng khi cúi nhấc hàng hóa và đứng lâu.',
        treatment: 'Giảm mang vác nặng trong 2 tuần, tập tăng sức cơ lưng bụng và dùng thuốc giảm đau bảo vệ dạ dày.',
        prescriptions: [
          { name: 'Celecoxib 200mg', dosage: '1 viên sau ăn tối', duration: '7 ngày', status: 'completed' },
          { name: 'Esomeprazole 20mg', dosage: '1 viên trước ăn sáng', duration: '7 ngày', status: 'completed' },
        ],
      },
      {
        date: new Date('2026-06-04T10:00:00+07:00'),
        doctorName: 'TS.BS. Trần Thị Mai',
        specialty: 'Khoa Sản & Nhi',
        diagnosis: 'Khám sức khỏe tổng quát theo doanh nghiệp',
        symptoms: 'Mệt mỏi nhẹ, ngủ không sâu giấc sau ca đêm.',
        treatment: 'Điều chỉnh giấc ngủ, bổ sung nước và tái khám chuyên khoa cơ xương khớp nếu đau lưng tái phát.',
        prescriptions: [],
      },
    ],
    appointmentUpdates: {
      '#LH-9916': {
        service: 'Khám sức khỏe tổng quát',
        symptoms: 'Mệt mỏi và đau lưng tái phát sau nhiều ngày tăng ca, muốn kiểm tra tổng quát thêm.',
        additionalNotes: 'Khám bổ sung do công ty yêu cầu kiểm tra sức khỏe định kỳ.',
      },
      '#LH-9909': {
        service: 'Tư vấn đau cột sống',
        symptoms: 'Đau thắt lưng lan mông trái, cúi người và mang hàng nặng làm đau tăng rõ trong 2 tuần gần đây.',
        additionalNotes: 'Có tiền sử thoát vị đĩa đệm L4-L5 mức độ nhẹ, mong muốn được đánh giá lại.',
      },
    },
  },
];

const syncAppointment = async (filter, patient, user, updates) => {
  const appointment = await Appointment.findOne(filter);
  if (!appointment) return false;

  appointment.patient = patient._id;
  appointment.patientUser = user?._id || appointment.patientUser || null;
  appointment.patientName = patient.fullName;
  appointment.patientCode = patient.code;
  appointment.phone = patient.phone;
  appointment.insured = Boolean(patient.insurance?.code);
  appointment.symptoms = updates.symptoms;
  appointment.service = updates.service;
  appointment.additionalNotes = updates.additionalNotes;
  await appointment.save();
  return true;
};

const upsertHistory = async (patientUserId, entries) => {
  await MedicalHistory.deleteMany({
    patientUser: patientUserId,
    type: { $in: ['allergy', 'chronic', 'family'] },
  });

  await MedicalHistory.insertMany(
    entries.map((entry) => ({
      patientUser: patientUserId,
      ...entry,
    })),
  );
};

const upsertVisits = async (patientUserId, visits) => {
  await Visit.deleteMany({ patientUser: patientUserId, isSeed: true });
  await Visit.insertMany(
    visits.map((visit) => ({
      patientUser: patientUserId,
      facility: 'Phòng khám MediCare AI',
      status: 'completed',
      isSeed: true,
      ...visit,
    })),
  );
};

const main = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  for (const profile of profiles) {
    let user = await User.findOne({ email: profile.userEmail.toLowerCase() }).select('+password');
    if (!user) {
      user = new User({
        email: profile.userEmail.toLowerCase(),
        ...profile.user,
      });
    } else {
      Object.assign(user, profile.user, { email: profile.userEmail.toLowerCase() });
      if (profile.user.password) {
        user.password = profile.user.password;
      }
    }
    await user.save();

    let patient = await Patient.findOne({ code: profile.patientCode });
    if (!patient) {
      patient = new Patient({
        code: profile.patientCode,
        ...profile.patient,
      });
    } else {
      Object.assign(patient, profile.patient);
    }
    await patient.save();

    await upsertHistory(user._id, profile.histories);
    await upsertVisits(user._id, profile.visits);

    for (const [appointmentCode, updates] of Object.entries(profile.appointmentUpdates)) {
      await syncAppointment({ code: appointmentCode }, patient, user, updates);
    }
  }

  console.log(
    JSON.stringify(
      {
        updatedPatients: profiles.map((profile) => profile.patientCode),
        updatedAppointments: profiles.flatMap((profile) => Object.keys(profile.appointmentUpdates)),
      },
      null,
      2,
    ),
  );

  await mongoose.connection.close();
};

main().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
