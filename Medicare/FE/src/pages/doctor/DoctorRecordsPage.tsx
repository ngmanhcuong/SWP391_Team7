import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import { buildDoctorMedicalRecordData } from '../../features/doctor/utils/buildDoctorMedicalRecordData';
import {
  getDoctorPatientById,
  getNextWaitingPatientId,
} from '../../features/doctor/utils/doctorPatientRegistry';
import { DOCTOR_PATHS } from '../../features/doctor/utils/doctorPaths';
import { MedicalRecordExamination, ParaclinicalTest, PrescriptionItem } from '../../features/doctor/types';
import { ClinicalContextInput } from '../../features/doctor/utils/clinicalContext';
import { scrollDashboardToTopAfterPaint } from '../../utils/scrollDashboardToTop';

export const DoctorRecordsPage: React.FC = () => {
  const { patientId = '' } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const listPatient = getDoctorPatientById(patientId);
  const recordData = useMemo(
    () => (patientId ? buildDoctorMedicalRecordData(patientId) : null),
    [patientId],
  );

  const [examination, setExamination] = useState<MedicalRecordExamination | null>(null);
  const [paraclinicalTests, setParaclinicalTests] = useState(recordData?.paraclinicalTests ?? []);
  const [prescriptions, setPrescriptions] = useState(recordData?.prescriptions ?? []);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
    setIsEditing(false);

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

  if (!patientId || !listPatient || !recordData || !examination) {
    return (
      <div className="flex items-center justify-center min-h-[420px]">
        <div className="max-w-md text-center bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm p-8">
          <h1 className="text-lg font-bold text-[#191c1e]">Không tìm thấy hồ sơ bệnh nhân</h1>
          <p className="text-sm text-[#737685] mt-2">
            Mã bệnh nhân không hợp lệ hoặc hồ sơ chưa được tạo.
          </p>
          <Link to={DOCTOR_PATHS.patients} className="inline-block mt-5">
            <Button className="bg-[#2563eb] border-[#2563eb] hover:bg-[#1d4ed8]">
              Quay lại danh sách bệnh nhân
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextPatientId = getNextWaitingPatientId(patientId);

  const handleExaminationChange = (field: keyof MedicalRecordExamination, value: string) => {
    if (!isEditing) return;
    setExamination((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleParaclinicalToggle = (id: string) => {
    if (!isEditing) return;
    setParaclinicalTests((prev) =>
      prev.map((test) =>
        test.id === id ? { ...test, checked: !test.checked } : test,
      ),
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

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage('');
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Đã lưu hồ sơ bệnh án thành công.');
    }, 600);
  };

  const handleSaveAndNext = () => {
    setIsSaving(true);
    setSaveMessage('');
    setTimeout(() => {
      setIsSaving(false);
      if (nextPatientId) {
        navigate(DOCTOR_PATHS.record(nextPatientId));
      } else {
        setSaveMessage('Đã lưu hồ sơ. Không còn bệnh nhân chờ khám tiếp theo.');
      }
    }, 600);
  };

  return (
    <div className="relative space-y-5 pb-16">
      <div id="medical-record-top" className="h-0 w-full" aria-hidden />

      <MedicalRecordHeader
        patientName={recordData.patient.name}
        patientCode={recordData.patient.id}
      />

      <MedicalRecordActionBar
        placement="top"
        onSave={handleSave}
        onSaveAndNext={handleSaveAndNext}
        onToggleEdit={() => setIsEditing((prev) => !prev)}
        isSaving={isSaving}
        hasNextPatient={Boolean(nextPatientId)}
        isEditing={isEditing}
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
          <ExaminationHistoryCard history={recordData.examinationHistory} />
          <WaitingPatientsWidget patients={recordData.waitingPatients} />
        </div>

        <div className="xl:col-span-5 space-y-5">
          <CurrentExaminationCard
            examination={examination}
            isEditing={isEditing}
            onChange={handleExaminationChange}
          />
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
        aria-label="Nhắn tin"
      >
        <span className="absolute inset-0 rounded-full bg-[#2563eb]/40 animate-ping opacity-75 group-hover:opacity-0" />
        <MessageCircle size={24} className="relative transition-transform duration-300 group-hover:rotate-6" />
      </button>
    </div>
  );
};

export default DoctorRecordsPage;
