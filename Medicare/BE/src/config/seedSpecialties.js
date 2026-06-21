const Specialty = require('../models/Specialty');

// Slug khớp với CLINIC_SPECIALTIES ở FE để giữ nguyên phần trình bày (icon, màu sắc).
const SPECIALTIES = [
  { slug: 'cardiology', name: 'Tim mạch', departmentLabel: 'Khoa Tim mạch', consultationFee: 350_000, iconKey: 'heart', doctorCount: 3, order: 1, color: 'from-rose-500 to-rose-700', description: 'Khám và điều trị các bệnh lý tim mạch, tăng huyết áp và rối loạn nhịp tim.' },
  { slug: 'musculoskeletal', name: 'Cơ xương khớp', departmentLabel: 'Khoa Cơ xương khớp', consultationFee: 300_000, iconKey: 'bone', doctorCount: 3, order: 2, color: 'from-violet-500 to-violet-700', description: 'Chẩn đoán và điều trị các bệnh lý cơ, xương, khớp và vật lý trị liệu.' },
  { slug: 'obstetrics-pediatrics', name: 'Sản & Nhi', departmentLabel: 'Khoa Sản & Nhi', consultationFee: 320_000, iconKey: 'baby', doctorCount: 3, order: 3, color: 'from-blue-500 to-blue-700', description: 'Chăm sóc sức khỏe phụ nữ, thai sản và khám chữa bệnh cho trẻ em.' },
  { slug: 'ophthalmology', name: 'Mắt', departmentLabel: 'Khoa Mắt', consultationFee: 280_000, iconKey: 'eye', doctorCount: 3, order: 4, color: 'from-cyan-500 to-teal-700', description: 'Khám, đo thị lực và điều trị các bệnh lý về mắt cho mọi lứa tuổi.' },
];

const seedSpecialties = async () => {
  if (process.env.NODE_ENV === 'production' || process.env.SEED_PATIENT === 'false') {
    return;
  }

  for (const item of SPECIALTIES) {
    await Specialty.findOneAndUpdate({ slug: item.slug }, item, { upsert: true });
  }
  console.log('🌱 Seeded specialties');
};

module.exports = seedSpecialties;
module.exports.SPECIALTIES = SPECIALTIES;
