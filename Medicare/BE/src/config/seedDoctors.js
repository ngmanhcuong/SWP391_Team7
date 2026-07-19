const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');
const User = require('../models/User');

const DOCTORS = [
  { name: 'TS.BS. Nguyễn Văn An', email: 'nguyen.van.an@medicare.com', specialtySlug: 'cardiology', rating: 4.9, reviewCount: 128, experienceYears: 15, tag: { label: 'Chuyên gia đầu ngành', variant: 'expert' }, nextAvailableSlot: 'Hôm nay, 14:30', isAvailable: true, avatarBg: 'rgba(218,226,255,0.3)' },
  { name: 'TS.BS. Trần Minh Bách', email: 'tran.minh.bach@medicare.com', specialtySlug: 'cardiology', rating: 4.8, reviewCount: 95, experienceYears: 10, tag: { label: 'Tiến sĩ Y khoa', variant: 'phd' }, nextAvailableSlot: 'Ngày mai, 08:00', isAvailable: true, avatarBg: 'rgba(255,218,210,0.3)' },
  { name: 'BSCKII. Lê Hoàng Cường', email: 'le.hoang.cuong@medicare.com', specialtySlug: 'cardiology', rating: 5.0, reviewCount: 210, experienceYears: 22, tag: { label: 'Bác sĩ ưu tú', variant: 'elite' }, nextAvailableSlot: null, isAvailable: false, avatarBg: 'rgba(130,249,190,0.3)' },
  { name: 'BS. Phạm Thu Dung', email: 'pham.thu.dung@medicare.com', specialtySlug: 'musculoskeletal', rating: 4.7, reviewCount: 52, experienceYears: 8, tag: { label: 'Bác sĩ trẻ tiềm năng', variant: 'potential' }, nextAvailableSlot: 'Hôm nay, 16:00', isAvailable: true, avatarBg: 'rgba(218,226,255,0.3)' },
  { name: 'BSCKI. Hoàng Văn Đức', email: 'hoang.van.duc@medicare.com', specialtySlug: 'musculoskeletal', rating: 4.9, reviewCount: 143, experienceYears: 18, tag: { label: 'Chuyên gia đầu ngành', variant: 'expert' }, nextAvailableSlot: 'Hôm nay, 10:00', isAvailable: true, avatarBg: 'rgba(255,218,210,0.3)' },
  { name: 'TS.BS. Trần Thị Phương', email: 'tran.thi.phuong@medicare.com', specialtySlug: 'musculoskeletal', rating: 4.6, reviewCount: 67, experienceYears: 12, tag: { label: 'Tiến sĩ Y khoa', variant: 'phd' }, nextAvailableSlot: 'Ngày mai, 15:30', isAvailable: true, avatarBg: 'rgba(130,249,190,0.3)' },
  { name: 'BS. Nguyễn Thị Giang', email: 'nguyen.thi.giang@medicare.com', specialtySlug: 'obstetrics-pediatrics', rating: 4.9, reviewCount: 186, experienceYears: 16, tag: { label: 'Chuyên gia đầu ngành', variant: 'expert' }, nextAvailableSlot: 'Hôm nay, 09:00', isAvailable: true, avatarBg: 'rgba(255,218,210,0.3)' },
  { name: 'BSCKII. Lê Văn Hùng', email: 'le.van.hung@medicare.com', specialtySlug: 'obstetrics-pediatrics', rating: 4.8, reviewCount: 112, experienceYears: 14, tag: { label: 'Bác sĩ ưu tú', variant: 'elite' }, nextAvailableSlot: 'Ngày mai, 11:00', isAvailable: true, avatarBg: 'rgba(218,226,255,0.3)' },
  { name: 'TS.BS. Trần Thị Mai', email: 'tran.thi.mai@medicare.com', specialtySlug: 'obstetrics-pediatrics', rating: 4.7, reviewCount: 89, experienceYears: 12, tag: { label: 'Tiến sĩ Y khoa', variant: 'phd' }, nextAvailableSlot: 'Hôm nay, 15:00', isAvailable: true, avatarBg: 'rgba(130,249,190,0.3)' },
  { name: 'BSCKII. Phạm Hoàng Long', email: 'pham.hoang.long@medicare.com', specialtySlug: 'ophthalmology', rating: 5.0, reviewCount: 210, experienceYears: 22, tag: { label: 'Bác sĩ ưu tú', variant: 'elite' }, nextAvailableSlot: null, isAvailable: false, avatarBg: 'rgba(130,249,190,0.3)' },
  { name: 'BS. Trần Anh Khoa', email: 'tran.anh.khoa@medicare.com', specialtySlug: 'ophthalmology', rating: 4.7, reviewCount: 78, experienceYears: 11, tag: { label: 'Bác sĩ trẻ tiềm năng', variant: 'potential' }, nextAvailableSlot: 'Hôm nay, 16:00', isAvailable: true, avatarBg: 'rgba(218,226,255,0.3)' },
  { name: 'TS.BS. Võ Minh Lâm', email: 'vo.minh.lam@medicare.com', specialtySlug: 'ophthalmology', rating: 4.8, reviewCount: 99, experienceYears: 13, tag: { label: 'Tiến sĩ Y khoa', variant: 'phd' }, nextAvailableSlot: 'Ngày mai, 14:00', isAvailable: true, avatarBg: 'rgba(255,218,210,0.3)' },
];

const seedDoctors = async () => {
  if (process.env.NODE_ENV === 'production' || process.env.SEED_PATIENT === 'false') {
    return;
  }

  const specialties = await Specialty.find();
  const bySlug = new Map(specialties.map((s) => [s.slug, s]));

  for (const item of DOCTORS) {
    const specialty = bySlug.get(item.specialtySlug);
    if (!specialty) continue;
    const linkedUser = item.email
      ? await User.findOne({ email: item.email.toLowerCase() }).select('_id')
      : null;
    await Doctor.findOneAndUpdate(
      { name: item.name },
      { ...item, specialty: specialty._id, user: linkedUser?._id || null },
      { upsert: true },
    );
  }
  console.log('🌱 Seeded doctors');
};

module.exports = seedDoctors;
module.exports.DOCTORS = DOCTORS;
