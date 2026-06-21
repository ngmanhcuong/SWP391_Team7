import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import {
  FloatingChatButton,
  HealthRecordsHeader,
  HealthRecordsQuickActions,
  HealthRecordsRecordBanner,
  HealthRecordsStatCard,
  HealthRecordsTabNav,
  LabResultsSection,
  MedicalHistorySection,
  PatientHealthSummaryCard,
  PrescriptionsHistorySection,
  VisitHistorySection,
} from '../../features/patient/components';
import { usePatientHealthRecords } from '../../features/patient/hooks';
import { useProfile } from '../../features/profile/hooks';
import { HealthRecordTab } from '../../features/patient/types';
import { exportHealthRecordsPdf } from '../../features/patient/utils/exportHealthRecordsPdf';

const VALID_TABS: HealthRecordTab[] = ['visits', 'prescriptions', 'labs', 'history'];

const isHealthRecordTab = (value: string | null): value is HealthRecordTab =>
  value !== null && VALID_TABS.includes(value as HealthRecordTab);

const matchesSearch = (query: string, ...values: string[]): boolean => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return values.some((value) => value.toLowerCase().includes(normalized));
};

export const PatientHealthRecordsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: profile } = useProfile();
  const { data, isLoading, isError } = usePatientHealthRecords(user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null);
  const [visitLabFilter, setVisitLabFilter] = useState<string | null>(null);

  const tabParam = searchParams.get('tab');
  const activeTab: HealthRecordTab = isHealthRecordTab(tabParam) ? tabParam : 'visits';

  const setActiveTab = useCallback(
    (tab: HealthRecordTab) => {
      setVisitLabFilter(null);
      setSearchParams(tab === 'visits' ? {} : { tab }, { replace: true });
    },
    [setSearchParams],
  );

  const displayUser = profile ?? user;

  const filteredData = useMemo(() => {
    if (!data) return null;

    const visits = data.visits.filter((visit) => {
      const matchesSpecialty = !specialtyFilter || visit.specialty === specialtyFilter;
      return (
        matchesSpecialty &&
        matchesSearch(searchQuery, visit.doctorName, visit.specialty, visit.diagnosis, visit.symptoms)
      );
    });

    const prescriptions = data.prescriptions.filter((rx) =>
      matchesSearch(searchQuery, rx.name, rx.doctorName, rx.dosage),
    );

    const labResults = data.labResults.filter((lab) => {
      const matchesVisit = !visitLabFilter || lab.visitId === visitLabFilter;
      return (
        matchesVisit &&
        matchesSearch(searchQuery, lab.name, lab.doctorName, lab.summary)
      );
    });

    const medicalHistory = data.medicalHistory.filter((item) =>
      matchesSearch(searchQuery, item.label, item.detail, item.type),
    );

    return { visits, prescriptions, labResults, medicalHistory };
  }, [data, searchQuery, specialtyFilter, visitLabFilter]);

  const specialties = useMemo(
    () => (data ? Array.from(new Set(data.visits.map((visit) => visit.specialty))) : []),
    [data],
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#434654]">Vui lòng đăng nhập để xem hồ sơ bệnh án.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data || !filteredData || !displayUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#434654]">Không thể tải hồ sơ bệnh án. Vui lòng thử lại.</p>
      </div>
    );
  }

  const tabCounts: Record<HealthRecordTab, number> = {
    visits: filteredData.visits.length,
    prescriptions: filteredData.prescriptions.length,
    labs: filteredData.labResults.length,
    history: filteredData.medicalHistory.length,
  };

  const allergyCount = data.medicalHistory.filter((item) => item.type === 'allergy').length;
  const pendingLabCount = data.labResults.filter((item) => item.status === 'pending').length;

  const patientSummary = {
    ...data.patientSummary,
    height: displayUser.height ? `${displayUser.height} cm` : data.patientSummary.height,
    weight: displayUser.weight ? `${displayUser.weight} kg` : data.patientSummary.weight,
  };

  const handleViewVisitLabs = (visitId: string) => {
    setVisitLabFilter(visitId);
    setActiveTab('labs');
  };

  const handleDownloadPdf = () => {
    exportHealthRecordsPdf({
      patientName: displayUser.fullName,
      recordCode: data.recordCode,
      updatedAt: data.updatedAt,
      visits: data.visits,
      prescriptions: data.prescriptions,
      labResults: data.labResults,
      medicalHistory: data.medicalHistory,
      patientSummary,
    });
  };

  return (
    <div className="relative space-y-6 pb-16">
      <HealthRecordsHeader
        patientName={displayUser.fullName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onDownload={handleDownloadPdf}
      />

      <HealthRecordsRecordBanner recordCode={data.recordCode} updatedAt={data.updatedAt} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <HealthRecordsStatCard
            key={stat.id}
            stat={stat}
            isActive={activeTab === stat.tab}
            onSelect={setActiveTab}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-4 min-w-0">
          <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 p-4 sm:p-6 space-y-4">
            <HealthRecordsTabNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={tabCounts}
            />

            {activeTab === 'visits' && specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSpecialtyFilter(null)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    specialtyFilter === null
                      ? 'bg-[#003d9b] text-white'
                      : 'bg-[#f8f9fb] text-[#434654] border border-[#c3c6d6] hover:border-[#003d9b]/40'
                  }`}
                >
                  Tất cả khoa
                </button>
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => setSpecialtyFilter(specialty)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      specialtyFilter === specialty
                        ? 'bg-[#003d9b] text-white'
                        : 'bg-[#f8f9fb] text-[#434654] border border-[#c3c6d6] hover:border-[#003d9b]/40'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'labs' && visitLabFilter && (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8f9fb] border border-[#c3c6d6]/60 px-4 py-2.5 text-sm text-[#434654]">
                <span>Đang lọc xét nghiệm theo lần khám đã chọn</span>
                <button
                  type="button"
                  onClick={() => setVisitLabFilter(null)}
                  className="text-[#003d9b] font-medium hover:underline shrink-0"
                >
                  Bỏ lọc
                </button>
              </div>
            )}

            {activeTab === 'visits' && (
              <VisitHistorySection
                visits={filteredData.visits}
                labResults={data.labResults}
                onViewLabs={handleViewVisitLabs}
              />
            )}
            {activeTab === 'prescriptions' && (
              <PrescriptionsHistorySection prescriptions={filteredData.prescriptions} />
            )}
            {activeTab === 'labs' && <LabResultsSection results={filteredData.labResults} />}
            {activeTab === 'history' && (
              <MedicalHistorySection items={filteredData.medicalHistory} />
            )}
          </div>
        </div>

        <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <PatientHealthSummaryCard
            user={displayUser}
            summary={patientSummary}
            allergyCount={allergyCount}
          />
          <HealthRecordsQuickActions pendingLabCount={pendingLabCount} />
        </div>
      </div>

      <FloatingChatButton />
    </div>
  );
};

export default PatientHealthRecordsPage;
