const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Visit = require('../models/Visit');

const ok = (res, data) => res.json({ success: true, data });

const calculateAge = (date) => {
  if (!date) return 0;
  const dob = new Date(date);
  if (Number.isNaN(dob.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return Math.max(age, 0);
};

const formatDateVN = (date) =>
  date
    ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
        new Date(date),
      )
    : '';

const mapGender = (gender) => {
  if (gender === 'male') return 'Nam';
  if (gender === 'female') return 'Nữ';
  return 'Nữ';
};

const mapHealthStatus = (status) => {
  if (status === 'pending' || status === 'checked-in') return 'waiting';
  if (status === 'done') return 'stable';
  return 'monitoring';
};

const mapScheduleStatus = (status) => {
  if (status === 'done') return 'completed';
  if (status === 'cancelled') return 'cancelled';
  if (status === 'confirmed') return 'confirmed';
  return 'waiting';
};

const mapTimeSlot = (time = '') => {
  const [hours] = String(time).split(':').map(Number);
  if (Number.isNaN(hours)) return 'all';
  if (hours < 12) return 'morning';
  if (hours < 18) return 'afternoon';
  return 'evening';
};

const mapAppointmentType = (source) => (source === 'patient' ? 'new' : 'followup');

const mapHistoryEntry = (doc, index) => ({
  id: String(doc._id || `history-${index + 1}`),
  date: formatDateVN(doc.date) || '',
  doctor: doc.doctorName || doc.doctor || 'Chưa cập nhật',
  diagnosis: doc.diagnosis || doc.service || doc.department || 'Chưa có chẩn đoán',
});

const listAssignedPatients = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return ok(res, { patients: [], totalCount: 0, summary: { totalManaged: 0, totalTrend: 'Theo dữ liệu hiện tại', newThisWeek: 0, weeklyChart: [0, 0, 0, 0, 0, 0, 0], waitingReExam: 0 } });

    const appointments = await Appointment.find({ doctorRef: doctor._id })
      .populate('patient', 'code fullName phone dob gender')
      .sort({ date: -1, time: -1 });

    const byPatient = new Map();
    for (const appt of appointments) {
      const patientId = appt.patient ? String(appt.patient._id) : `${appt.patientCode || appt.patientName}`;
      if (!byPatient.has(patientId)) {
        byPatient.set(patientId, {
          id: patientId,
          patientCode: appt.patient?.code || appt.patientCode || 'BN-CHUA-CAP',
          fullName: appt.patient?.fullName || appt.patientName,
          gender: mapGender(appt.patient?.gender),
          age: calculateAge(appt.patient?.dob),
          phone: appt.patient?.phone || appt.phone || '',
          lastVisit: formatDateVN(appt.date) || 'Hôm nay',
          healthStatus: mapHealthStatus(appt.status),
          department: appt.department || '',
        });
      }
    }

    const patients = [...byPatient.values()];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const weeklyChart = Array.from({ length: 7 }, () => 0);
    appointments.forEach((appt) => {
      const d = new Date(appt.date);
      if (d >= oneWeekAgo) {
        const diffDays = Math.floor((d.setHours(0, 0, 0, 0) - oneWeekAgo.getTime()) / 86400000);
        if (diffDays >= 0 && diffDays < 7) weeklyChart[diffDays] += 1;
      }
    });

    const summary = {
      totalManaged: patients.length,
      totalTrend: 'Theo dữ liệu hiện tại',
      newThisWeek: appointments.filter((appt) => new Date(appt.createdAt) >= oneWeekAgo).length,
      weeklyChart,
      waitingReExam: appointments.filter((appt) => ['pending', 'confirmed', 'checked-in'].includes(appt.status)).length,
    };

    return ok(res, { patients, totalCount: patients.length, summary });
  } catch (error) {
    return next(error);
  }
};

const listScheduleAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return ok(res, []);

    const appointments = await Appointment.find({ doctorRef: doctor._id })
      .populate('patient', 'code fullName')
      .sort({ date: 1, time: 1 });

    const data = appointments.map((appt) => ({
      id: String(appt._id),
      patientId: appt.patient ? String(appt.patient._id) : undefined,
      patientCode: appt.patient?.code || appt.patientCode || '',
      patientName: appt.patient?.fullName || appt.patientName || 'Chưa rõ bệnh nhân',
      patientNote: appt.symptoms || appt.service || '',
      department: appt.department || '',
      type: mapAppointmentType(appt.source),
      status: mapScheduleStatus(appt.status),
      timeSlot: mapTimeSlot(appt.time),
      date: new Date(appt.date).toISOString().slice(0, 10),
      time: appt.time,
    }));

    return ok(res, data);
  } catch (error) {
    return next(error);
  }
};

const listPatientHistory = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const patientDoc = await Patient.findById(patientId).select('code fullName');
    if (!patientDoc) return ok(res, []);

    const relatedAppointments = await Appointment.find({
      $or: [
        { patient: patientDoc._id },
        { patientCode: patientDoc.code },
        { patientName: patientDoc.fullName },
      ],
    })
      .select('patientUser doctor department service date status')
      .sort({ date: -1 });

    const patientUserIds = Array.from(
      new Set(
        relatedAppointments
          .map((appt) => (appt.patientUser ? String(appt.patientUser) : ''))
          .filter(Boolean),
      ),
    );

    let history = [];

    if (patientUserIds.length > 0) {
      const visits = await Visit.find({ patientUser: { $in: patientUserIds } })
        .sort({ date: -1 })
        .limit(10);

      history = visits.map(mapHistoryEntry);
    }

    if (history.length === 0) {
      history = relatedAppointments
        .filter((appt) => ['done', 'checked-in', 'confirmed', 'pending'].includes(appt.status))
        .slice(0, 10)
        .map((appt, index) =>
          mapHistoryEntry(
            {
              _id: appt._id,
              date: appt.date,
              doctor: appt.doctor,
              diagnosis: appt.service || appt.department,
              department: appt.department,
            },
            index,
          ),
        );
    }

    return ok(res, history);
  } catch (error) {
    return next(error);
  }
};

const completeAppointment = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return ok(res, null);

    const { appointmentId } = req.params;
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctorRef: doctor._id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn.' });
    }

    appointment.status = 'done';
    await appointment.save();

    return ok(res, {
      id: String(appointment._id),
      status: appointment.status,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listAssignedPatients,
  listScheduleAppointments,
  listPatientHistory,
  completeAppointment,
};
