import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import {
  CurrentExaminationCard,
  ExaminationHistoryCard,
  ImportantWarningCard,
  LatestTestResultsCard,
  MedicalRecordActionBar,
  MedicalRecordHeader,
  ParaclinicalIndicationsCard,
  PatientInfoCard,
  PrescriptionCard,
  WaitingPatientsWidget,
} from '../../features/doctor/components/records';
import { buildDoctorMedicalRecordDataFromPatient } from '../../features/doctor/utils/buildDoctorMedicalRecordData';
import { doctorApi } from '../../features/doctor/api/doctorApi';
import { resolveDoctorPatientId } from '../../features/doctor/utils/doctorPatientRegistry';
import { DOCTOR_PATHS } from '../../features/doctor/utils/doctorPaths';
import {
  DoctorPatientListItem,
  ExaminationHistoryEntry,
  MedicalRecordExamination,
  ParaclinicalTest,
  PrescriptionItem,
  ScheduledAppointment,
} from '../../features/doctor/types';
import { ClinicalContextInput } from '../../features/doctor/utils/clinicalContext';
import { scrollDashboardToTopAfterPaint } from '../../utils/scrollDashboardToTop';

export const DoctorRecordsPage: React.FC = () => {
  const { patientId = '' } = useParams<{ patientId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const requestedAppointmentId = searchParams.get('appointmentId') ?? undefined;
  const { data: patientData } = useQuery({
    queryKey: ['doctor', 'patients'],
    queryFn: doctorApi.getPatients,
  });
  const { data: scheduleAppointments } = useQuery({
    queryKey: ['doctor', 'appointments'],
    queryFn: doctorApi.getAppointments,
  });

  const dbPatient = useMemo(
    () => patientData?.patients.find((patient: DoctorPatientListItem) => patient.id === patientId) ?? null,
    [patientData, patientId],
  );
  const allDbPatients = useMemo(() => patientData?.patients ?? [], [patientData]);

  const { data: patientHistory } = useQuery({
    queryKey: ['doctor', 'patient-history', patientId],
    queryFn: () => doctorApi.getPatientHistory(patientId),
    enabled: Boolean(dbPatient?.id),
  });

  const listPatient: DoctorPatientListItem | null = dbPatient;
  const recordData = useMemo(() => {
    if (!dbPatient) return null;
    return buildDoctorMedicalRecordDataFromPatient(dbPatient, allDbPatients);
  }, [allDbPatients, dbPatient]);

  const [examination, setExamination] = useState<MedicalRecordExamination | null>(null);
  const [paraclinicalTests, setParaclinicalTests] = useState(recordData?.paraclinicalTests ?? []);
  const [prescriptions, setPrescriptions] = useState(recordData?.prescriptions ?? []);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const isEditing = true;

  useLayoutEffect(() => {
    scrollDashboardToTopAfterPaint();
  }, [patientId]);

  useEffect(() => {
    if (!recordData) return;
    setExamination(recordData.examination);
    setParaclinicalTests(recordData.paraclinicalTests);
    setPrescriptions(recordData.prescriptions);
    setAiEnabled(true);
    setSaveMessage('');

    const timer = window.setTimeout(scrollDashboardToTopAfterPaint, 0);
    return () => window.clearTimeout(timer);
  }, [recordData, patientId]);

  const clinicalContext = useMemo<ClinicalContextInput>(
    () => ({
      clinicalSymptoms: examination?.clinicalSymptoms ?? '',
      preliminaryDiagnosis: examination?.preliminaryDiagnosis ?? '',
      additionalNotes: examination?.additionalNotes ?? '',
      allergies: recordData?.patient.allergies ?? [],
      medicalHistory: recordData?.patient.medicalHistory ?? [],
    }),
    [examination, recordData],
  );

  const examinationHistory = useMemo<ExaminationHistoryEntry[]>(
    () => (patientHistory && patientHistory.length > 0 ? patientHistory : recordData?.examinationHistory ?? []),
    [patientHistory, recordData],
  );

  const nextPatientId = useMemo(() => {
    if (!patientId) return undefined;

    const currentResolvedId = resolveDoctorPatientId(patientId, listPatient?.fullName);

    if (scheduleAppointments?.length) {
      const candidate = scheduleAppointments.find((appointment: ScheduledAppointment) => {
        const appointmentPatientId = resolveDoctorPatientId(appointment.patientId, appointment.patientName);
        if (!appointmentPatientId || appointmentPatientId === currentResolvedId) return false;
        return appointment.status === 'waiting' || appointment.status === 'confirmed';
      });

      if (candidate) return resolveDoctorPatientId(candidate.patientId, candidate.patientName);
    }

    if (allDbPatients.length > 0) {
      return (
        allDbPatients.find(
          (patient: DoctorPatientListItem) => patient.id !== patientId && patient.healthStatus === 'waiting',
        )?.id ?? undefined
      );
    }

    return undefined;
  }, [allDbPatients, listPatient?.fullName, patientId, scheduleAppointments]);

  const currentAppointmentId = useMemo(() => {
    if (!scheduleAppointments?.length || !patientId) return undefined;

    if (requestedAppointmentId) {
      const requestedAppointment = scheduleAppointments.find(
        (appointment: ScheduledAppointment) =>
          appointment.id === requestedAppointmentId &&
          resolveDoctorPatientId(appointment.patientId, appointment.patientName) ===
            resolveDoctorPatientId(patientId, listPatient?.fullName),
      );

      if (requestedAppointment) return requestedAppointment.id;
    }

    const currentResolvedId = resolveDoctorPatientId(patientId, listPatient?.fullName);
    const currentAppointment = scheduleAppointments.find((appointment: ScheduledAppointment) => {
      const appointmentPatientId = resolveDoctorPatientId(appointment.patientId, appointment.patientName);
      if (!appointmentPatientId || appointmentPatientId !== currentResolvedId) return false;
      return appointment.status === 'waiting' || appointment.status === 'confirmed';
    });

    return currentAppointment?.id;
  }, [listPatient?.fullName, patientId, requestedAppointmentId, scheduleAppointments]);

  const completeAppointmentMutation = useMutation({
    mutationFn: (appointmentId: string) => doctorApi.completeAppointment(appointmentId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['doctor', 'appointments'] }),
        queryClient.invalidateQueries({ queryKey: ['doctor', 'patients'] }),
        queryClient.invalidateQueries({ queryKey: ['doctor', 'patient-history', patientId] }),
      ]);
    },
  });

  const buildRecordPayload = useCallback(
    (complete = false) => {
      if (!examination || !recordData) return null;
      return {
        examination,
        prescriptions,
        paraclinicalTests,
        allergies: recordData.patient.allergies ?? [],
        medicalHistory: recordData.patient.medicalHistory ?? [],
        complete,
      };
    },
    [examination, paraclinicalTests, prescriptions, recordData],
  );

  if (!patientId || !listPatient || !recordData || !examination) {
    return (
      <div className="flex items-center justify-center min-h-[420px]">
        <div className="max-w-md text-center bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm p-8">
          <h1 className="text-lg font-bold text-[#191c1e]">Khong tim thay ho so benh nhan</h1>
          <p className="text-sm text-[#737685] mt-2">
            Ma benh nhan khong hop le hoac ho so chua duoc tao.
          </p>
          <Link to={DOCTOR_PATHS.patients} className="inline-block mt-5">
            <Button className="bg-[#2563eb] border-[#2563eb] hover:bg-[#1d4ed8]">
              Quay lai danh sach benh nhan
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleExaminationChange = (field: keyof MedicalRecordExamination, value: string) => {
    if (!isEditing) return;
    setExamination((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleParaclinicalToggle = (id: string) => {
    if (!isEditing) return;
    setParaclinicalTests((prev) =>
      prev.map((test) => (test.id === id ? { ...test, checked: !test.checked } : test)),
    );
  };

  const handleAddParaclinicalTest = (test: ParaclinicalTest) => {
    if (!isEditing) return;
    setParaclinicalTests((prev) => [...prev, test]);
  };

  const handleRemovePrescription = (id: string) => {
    if (!isEditing) return;
    setPrescriptions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddPrescription = (item: PrescriptionItem) => {
    if (!isEditing) return;
    setPrescriptions((prev) => [...prev, item]);
  };

  const handleSave = async () => {
    if (!currentAppointmentId) {
      setSaveMessage('Khong tim thay ca kham dang hoat dong de luu ho so.');
      return;
    }

    const payload = buildRecordPayload(false);
    if (!payload) return;

    setIsSaving(true);
    setSaveMessage('');
    try {
      await doctorApi.saveAppointmentRecord(currentAppointmentId, payload);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['doctor', 'patient-history', patientId] }),
        queryClient.invalidateQueries({ queryKey: ['patient', 'health-records'] }),
      ]);
      setSaveMessage('Da luu ho so benh an thanh cong.');
    } catch {
      setSaveMessage('Khong the luu ho so benh an luc nay.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndNext = async () => {
    if (!currentAppointmentId) {
      setSaveMessage('Khong tim thay ca kham dang hoat dong de luu ho so.');
      return;
    }

    const payload = buildRecordPayload(false);
    if (!payload) return;

    setIsSaving(true);
    setSaveMessage('');
    try {
      await doctorApi.saveAppointmentRecord(currentAppointmentId, payload);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['doctor', 'patient-history', patientId] }),
        queryClient.invalidateQueries({ queryKey: ['patient', 'health-records'] }),
      ]);
      if (nextPatientId) {
        navigate(DOCTOR_PATHS.record(nextPatientId));
      } else {
        setSaveMessage('Da luu ho so. Khong con benh nhan cho kham tiep theo.');
      }
    } catch {
      setSaveMessage('Khong the luu ho so benh an luc nay.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!currentAppointmentId) {
      setSaveMessage('Khong tim thay ca kham dang hoat dong de cap nhat.');
      return;
    }

    const payload = buildRecordPayload(true);
    if (!payload) return;

    setIsSaving(true);
    setSaveMessage('');
    try {
      await doctorApi.saveAppointmentRecord(currentAppointmentId, payload);
      await completeAppointmentMutation.mutateAsync(currentAppointmentId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['doctor', 'patient-history', patientId] }),
        queryClient.invalidateQueries({ queryKey: ['patient', 'health-records'] }),
      ]);
      setExamination((prev) => (prev ? { ...prev, status: 'completed' } : prev));
      setSaveMessage('Da danh dau ca kham hoan tat.');
    } catch {
      setSaveMessage('Khong the cap nhat trang thai ca kham luc nay.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative space-y-5 pb-16">
      <div id="medical-record-top" className="h-0 w-full" aria-hidden />

      <MedicalRecordHeader patientName={recordData.patient.name} patientCode={recordData.patient.id} />

      <MedicalRecordActionBar
        placement="top"
        onSave={handleSave}
        onComplete={handleComplete}
        onSaveAndNext={handleSaveAndNext}
        isSaving={isSaving}
        hasNextPatient={Boolean(nextPatientId)}
      />

      {saveMessage && (
        <p className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
          {saveMessage}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-12 items-start">
        <div className="xl:col-span-3 space-y-5">
          <PatientInfoCard patient={recordData.patient} />
          <ImportantWarningCard patient={recordData.patient} />
          <ExaminationHistoryCard history={examinationHistory} />
          <WaitingPatientsWidget patients={recordData.waitingPatients} />
        </div>

        <div className="xl:col-span-5 space-y-5">
          <CurrentExaminationCard examination={examination} isEditing={isEditing} onChange={handleExaminationChange} />
          <ParaclinicalIndicationsCard
            tests={paraclinicalTests}
            clinicalContext={clinicalContext}
            isEditing={isEditing}
            onToggle={handleParaclinicalToggle}
            onAdd={handleAddParaclinicalTest}
          />
          <LatestTestResultsCard results={recordData.labResults} />
        </div>

        <div className="xl:col-span-4 space-y-5">
          <PrescriptionCard
            prescriptions={prescriptions}
            clinicalContext={clinicalContext}
            isEditing={isEditing}
            aiEnabled={aiEnabled}
            onAiToggle={setAiEnabled}
            onAdd={handleAddPrescription}
            onRemovePrescription={handleRemovePrescription}
          />
        </div>
      </div>

      <button
        type="button"
        className="group fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#2563eb] to-[#06b6d4] text-white rounded-full shadow-lg shadow-blue-500/40 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
        aria-label="Nhan tin"
      >
        <span className="absolute inset-0 rounded-full bg-[#2563eb]/40 animate-ping opacity-75 group-hover:opacity-0" />
        <MessageCircle size={24} className="relative transition-transform duration-300 group-hover:rotate-6" />
      </button>
    </div>
  );
};

export default DoctorRecordsPage;
