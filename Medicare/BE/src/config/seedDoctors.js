const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');

// ~12 bác sĩ tiếng Việt, mirror danh sách bookingDoctors.ts cũ ở FE.
const DOCTORS = [
  { name: 'BS. Nguyễn Văn An', specialtySlug: 'cardiology', rating: 4.9, reviewCount: 128, experienceYears: 15, tag: { label: 'Chuyên gia đầu ngành', variant: 'expert' }, nextAvailableSlot: 'Hôm nay, 14:30', isAvailable: true, avatarBg: 'rgba(218,226,255,0.3)' },
  { name: 'BS. Trần Minh Bách', specialtySlug: 'cardiology', rating: 4.8, reviewCount: 95, experienceYears: 10, tag: { label: 'Tiến sĩ Y khoa', variant: 'phd' }, nextAvailableSlot: 'Mai, 08:00', isAvailable: true, avatarBg: 'rgba(255,218,210,0.3)' },
  { name: 'BS. Lê Hoàng Cường', specialtySlug: 'cardiology', rating: 5.0, reviewCount: 210, experienceYears: 22, tag: { label: 'Bác sĩ Ưu tú', variant: 'elite' }, nextAvailableSlot: null, isAvailable: false, avatarBg: 'rgba(130,249,190,0.3)' },
  { name: 'BS. Phạm Thu Dung', specialtySlug: 'musculoskeletal', rating: 4.7, reviewCount: 52, experienceYears: 8, tag: { label: 'Bác sĩ trẻ tiềm năng', variant: 'potential' }, nextAvailableSlot: 'Hôm nay, 16:00', isAvailable: true, avatarBg: 'rgba(218,226,255,0.3)' },
  { name: 'BS. Hoàng Văn Đức', specialtySlug: 'musculoskeletal', rating: 4.9, reviewCount: 143, experienceYears: 18, tag: { label: 'Chuyên gia đầu ngành', variant: 'expert' }, nextAvailableSlot: 'Hôm nay, 10:00', isAvailable: true, avatarBg: 'rgba(255,218,210,0.3)' },
  { name: 'BS. Trần Thị Phương', specialtySlug: 'musculoskeletal', rating: 4.6, reviewCount: 67, experienceYears: 12, tag: { label: 'Tiến sĩ Y khoa', variant: 'phd' }, nextAvailableSlot: 'Mai, 15:30', isAvailable: true, avatarBg: 'rgba(130,249,190,0.3)' },
  { name: 'BS. Nguyễn Thị Giang', specialtySlug: 'obstetrics-pediatrics', rating: 4.9, reviewCount: 186, experienceYears: 16, tag: { label: 'Chuyên gia đầu ngành', variant: 'expert' }, nextAvailableSlot: 'Hôm nay, 09:00', isAvailable: true, avatarBg: 'rgba(255,218,210,0.3)' },
  { name: 'BS. Lê Văn Hùng', specialtySlug: 'obstetrics-pediatrics', rating: 4.8, reviewCount: 112, experienceYears: 14, tag: { label: 'Bác sĩ Ưu tú', variant: 'elite' }, nextAvailableSlot: 'Mai, 11:00', isAvailable: true, avatarBg: 'rgba(218,226,255,0.3)' },
  { name: 'BS. Trần Thị Mai', specialtySlug: 'obstetrics-pediatrics', rating: 4.7, reviewCount: 89, experienceYears: 12, tag: { label: 'Tiến sĩ Y khoa', variant: 'phd' }, nextAvailableSlot: 'Hôm nay, 15:00', isAvailable: true, avatarBg: 'rgba(130,249,190,0.3)' },
  { name: 'BS. Phạm Hoàng Long', specialtySlug: 'ophthalmology', rating: 5.0, reviewCount: 210, experienceYears: 22, tag: { label: 'Bác sĩ Ưu tú', variant: 'elite' }, nextAvailableSlot: null, isAvailable: false, avatarBg: 'rgba(130,249,190,0.3)' },
  { name: 'BS. Trần Anh Khoa', specialtySlug: 'ophthalmology', rating: 4.7, reviewCount: 78, experienceYears: 11, tag: { label: 'Bác sĩ trẻ tiềm năng', variant: 'potential' }, nextAvailableSlot: 'Hôm nay, 16:00', isAvailable: true, avatarBg: 'rgba(218,226,255,0.3)' },
  { name: 'BS. Võ Minh Lâm', specialtySlug: 'ophthalmology', rating: 4.8, reviewCount: 99, experienceYears: 13, tag: { label: 'Tiến sĩ Y khoa', variant: 'phd' }, nextAvailableSlot: 'Mai, 14:00', isAvailable: true, avatarBg: 'rgba(255,218,210,0.3)' },
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
    await Doctor.findOneAndUpdate(
      { name: item.name },
      { ...item, specialty: specialty._id },
      { upsert: true },
    );
  }
  console.log('🌱 Seeded doctors');
};

module.exports = seedDoctors;
module.exports.DOCTORS = DOCTORS;
