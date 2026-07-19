const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');

const getHomeData = async (req, res) => {
  try {
    const [specialties, doctors, patientCount] = await Promise.all([
      Specialty.find().sort({ order: 1, name: 1 }).lean(),
      Doctor.find()
        .populate('specialty', 'name departmentLabel slug')
        .sort({ rating: -1, reviewCount: -1, experienceYears: -1, name: 1 })
        .lean(),
      User.countDocuments({ role: 'patient' }),
    ]);

    const doctorCountBySlug = doctors.reduce((acc, doctor) => {
      const key = doctor.specialtySlug || doctor.specialty?.slug || '';
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const featuredSpecialties = specialties.map((specialty) => ({
      id: specialty.slug,
      name: specialty.name,
      departmentLabel: specialty.departmentLabel,
      doctorCount: doctorCountBySlug[specialty.slug] || 0,
    }));

    const featuredDoctors = doctors.slice(0, 3).map((doctor) => ({
      id: String(doctor._id),
      name: doctor.name,
      specialty: doctor.specialty?.departmentLabel || doctor.specialty?.name || '',
      reviews: doctor.reviewCount || 0,
      experience: `${doctor.experienceYears || 0} năm kinh nghiệm`,
      rating: doctor.rating || 0,
      avatarBg: doctor.avatarBg || 'rgba(218,226,255,0.3)',
    }));

    const averageRating =
      doctors.length > 0
        ? Math.round((doctors.reduce((sum, doctor) => sum + (doctor.rating || 0), 0) / doctors.length) * 10) / 10
        : 0;

    return res.json({
      success: true,
      data: {
        stats: {
          doctors: doctors.length,
          patients: patientCount,
          specialties: specialties.length,
          satisfactionRate: averageRating > 0 ? `${Math.min(100, Math.round((averageRating / 5) * 100))}%` : '0%',
        },
        featuredSpecialties,
        featuredDoctors,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getHomeData };
