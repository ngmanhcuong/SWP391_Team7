const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Visit = require('../models/Visit');
const LabResult = require('../models/LabResult');
const MedicalHistory = require('../models/MedicalHistory');
const Invoice = require('../models/Invoice');

const ok = (res, data) => res.json({ success: true, data });

const toDateKey = (value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateKey = (value) => {
  if (typeof value !== 'string') return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfToday = () => {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
};

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (value) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const calculateAge = (date) => {
  if (!date) return 0;
  const dob = new Date(date);
  if (Number.isNaN(dob.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age -= 1;
  return Math.max(age, 0);
};

const formatDateVN = (date) =>
  date
    ? new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(date))
    : '';

const mapGender = (gender) => {
  if (gender === 'male') return 'Nam';
  if (gender === 'female') return 'Nu';
  return 'Nu';
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
  doctor: doc.doctorName || doc.doctor || 'Chua cap nhat',
  diagnosis: doc.diagnosis || doc.service || doc.department || 'Chua co chan doan',
});

const normalizeHistoryItems = (items = [], type) =>
  items
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .map((label) => ({ type, label }));

const listAssignedPatients = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return ok(res, {
        patients: [],
        totalCount: 0,
        summary: {
          totalManaged: 0,
          totalTrend: 'Theo du lieu hien tai',
          newThisWeek: 0,
          weeklyChart: [0, 0, 0, 0, 0, 0, 0],
          waitingReExam: 0,
        },
      });
    }

    const appointments = await Appointment.find({ doctorRef: doctor._id })
      .populate('patient', 'code fullName phone dob gender')
      .populate('patientUser', 'dateOfBirth gender phone')
      .sort({ date: -1, time: -1 });

    const syncPatientBirthData = [];
    const byPatient = new Map();
    for (const appt of appointments) {
      const patientId = appt.patient ? String(appt.patient._id) : `${appt.patientCode || appt.patientName}`;
      const resolvedDob = appt.patient?.dob || appt.patientUser?.dateOfBirth || null;
      const resolvedGender = appt.patient?.gender || appt.patientUser?.gender;
      const resolvedPhone = appt.patient?.phone || appt.patientUser?.phone || appt.phone || '';

      if (appt.patient && resolvedDob && !appt.patient.dob) {
        syncPatientBirthData.push(
          Patient.updateOne(
            { _id: appt.patient._id, $or: [{ dob: { $exists: false } }, { dob: null }] },
            { $set: { dob: resolvedDob } },
          ),
        );
      }

      if (!byPatient.has(patientId)) {
        byPatient.set(patientId, {
          id: patientId,
          patientCode: appt.patient?.code || appt.patientCode || 'BN-CHUA-CAP',
          fullName: appt.patient?.fullName || appt.patientName,
          gender: mapGender(resolvedGender),
          age: calculateAge(resolvedDob),
          phone: resolvedPhone,
          lastVisit: formatDateVN(appt.date) || 'Hom nay',
          healthStatus: mapHealthStatus(appt.status),
          department: appt.department || '',
        });
      }
    }

    if (syncPatientBirthData.length > 0) {
      await Promise.allSettled(syncPatientBirthData);
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

    return ok(res, {
      patients,
      totalCount: patients.length,
      summary: {
        totalManaged: patients.length,
        totalTrend: 'Theo du lieu hien tai',
        newThisWeek: appointments.filter((appt) => new Date(appt.createdAt) >= oneWeekAgo).length,
        weeklyChart,
        waitingReExam: appointments.filter((appt) =>
          ['pending', 'confirmed', 'checked-in'].includes(appt.status),
        ).length,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const listScheduleAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return ok(res, []);

    const parsedFrom = req.query.fromDate ? parseDateKey(req.query.fromDate) : null;
    const parsedTo = req.query.toDate ? parseDateKey(req.query.toDate) : null;
    const hasCustomRange =
      parsedFrom instanceof Date &&
      !Number.isNaN(parsedFrom.getTime()) &&
      parsedTo instanceof Date &&
      !Number.isNaN(parsedTo.getTime());

    const dateFilter = hasCustomRange
      ? {
          $gte: startOfDay(parsedFrom),
          $lte: endOfDay(parsedTo),
        }
      : {
          $gte: startOfToday(),
          $lte: endOfToday(),
        };

    const appointments = await Appointment.find({
      doctorRef: doctor._id,
      date: dateFilter,
    })
      .populate('patient', 'code fullName')
      .sort({ date: 1, time: 1 });

    return ok(
      res,
      appointments.map((appt) => ({
        id: String(appt._id),
        patientId: appt.patient ? String(appt.patient._id) : undefined,
        patientCode: appt.patient?.code || appt.patientCode || '',
        patientName: appt.patient?.fullName || appt.patientName || 'Chua ro benh nhan',
        patientNote: appt.symptoms || appt.service || '',
        department: appt.department || '',
        type: mapAppointmentType(appt.source),
        status: mapScheduleStatus(appt.status),
        timeSlot: mapTimeSlot(appt.time),
        date: toDateKey(appt.date),
        time: appt.time,
      })),
    );
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

const saveAppointmentRecord = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return ok(res, null);

    const { appointmentId } = req.params;
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctorRef: doctor._id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Khong tim thay lich hen.' });
    }

    if (!appointment.patientUser) {
      return res.status(400).json({
        success: false,
        message: 'Ca kham nay chua gan tai khoan benh nhan nen khong the luu ho so.',
      });
    }

    const {
      examination = {},
      prescriptions = [],
      paraclinicalTests = [],
      allergies = [],
      medicalHistory = [],
      complete = false,
    } = req.body || {};

    const visit = await Visit.findOneAndUpdate(
      { appointment: appointment._id },
      {
        patientUser: appointment.patientUser,
        appointment: appointment._id,
        doctorName: appointment.doctor || doctor.fullName || 'Bac si phu trach',
        specialty: appointment.department || 'Kham tong quat',
        facility: appointment.room ? `Phong ${appointment.room}` : 'Phong kham Medicare',
        date: appointment.date || new Date(),
        diagnosis: String(examination.preliminaryDiagnosis || '').trim(),
        symptoms: String(examination.clinicalSymptoms || appointment.symptoms || '').trim(),
        treatment: String(examination.additionalNotes || '').trim(),
        status: complete ? 'completed' : 'ongoing',
        prescriptions: prescriptions
          .map((item) => ({
            name: String(item.name || '').trim(),
            dosage: [item.dosage, item.quantity].filter(Boolean).join(' | ').trim(),
            duration: String(item.instructions || '').trim(),
            status: complete ? 'completed' : 'active',
          }))
          .filter((item) => item.name),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    await LabResult.deleteMany({ visit: visit._id });
    const selectedTests = paraclinicalTests.filter((test) => test && test.checked && test.name);
    if (selectedTests.length > 0) {
      await LabResult.insertMany(
        selectedTests.map((test) => ({
          patientUser: appointment.patientUser,
          visit: visit._id,
          name: String(test.name).trim(),
          date: appointment.date || new Date(),
          doctorName: appointment.doctor || doctor.fullName || 'Bac si phu trach',
          status: 'pending',
          summary: 'Dang cho ket qua tu phong xet nghiem',
        })),
      );
    }

    const historyItems = [
      ...normalizeHistoryItems(allergies, 'allergy'),
      ...normalizeHistoryItems(medicalHistory, 'chronic'),
    ];

    await Promise.all(
      historyItems.map(async (item) => {
        const existing = await MedicalHistory.findOne({
          patientUser: appointment.patientUser,
          type: item.type,
          label: item.label,
        });

        if (!existing) {
          await MedicalHistory.create({
            patientUser: appointment.patientUser,
            type: item.type,
            label: item.label,
            detail: '',
            since: '',
          });
        }
      }),
    );

    return ok(res, {
      visitId: String(visit._id),
      appointmentId: String(appointment._id),
      status: visit.status,
      savedLabs: selectedTests.length,
      savedPrescriptions: visit.prescriptions.length,
    });
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
      return res.status(404).json({ success: false, message: 'Khong tim thay lich hen.' });
    }

    appointment.status = 'done';
    await appointment.save();

    const linkedInvoice = await Invoice.findOne({ appointment: appointment._id });
    if (linkedInvoice && linkedInvoice.status === 'awaiting_visit') {
      linkedInvoice.status = 'pending_payment';
      linkedInvoice.dueDate = linkedInvoice.dueDate || new Date();
      await linkedInvoice.save();
    }

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
  saveAppointmentRecord,
  completeAppointment,
};
