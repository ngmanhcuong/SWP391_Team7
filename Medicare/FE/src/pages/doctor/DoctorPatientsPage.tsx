import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  AddPatientModal,
  DoctorPatientsHeader,
  PatientListFiltersBar,
  PatientListPagination,
  PatientListSummaryCards,
  PatientListTable,
} from '../../features/doctor/components/patients';
import {
  buildDoctorPatientsData,
  filterPatients,
  getTotalPages,
  PAGE_SIZE,
  paginatePatients,
} from '../../features/doctor/utils/buildDoctorPatientsData';
import { registerDoctorPatient } from '../../features/doctor/utils/doctorPatientRegistry';
import { DOCTOR_PATHS } from '../../features/doctor/utils/doctorPaths';
import { NewPatientFormData, PatientListFilters } from '../../features/doctor/types';

const EMPTY_FILTERS: PatientListFilters = {
  patientCode: '',
  fullName: '',
  phone: '',
};

export const DoctorPatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [patientsData, setPatientsData] = useState(() => buildDoctorPatientsData());
  const data = patientsData;

  const [filters, setFilters] = useState<PatientListFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<PatientListFilters>(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const filteredPatients = useMemo(
    () => filterPatients(data.patients, appliedFilters),
    [data.patients, appliedFilters],
  );

  const displayTotal = appliedFilters.patientCode || appliedFilters.fullName || appliedFilters.phone
    ? filteredPatients.length
    : data.totalCount;

  const totalPages = getTotalPages(
    appliedFilters.patientCode || appliedFilters.fullName || appliedFilters.phone
      ? filteredPatients.length
      : data.totalCount,
  );

  const paginatedPatients = useMemo(() => {
    if (appliedFilters.patientCode || appliedFilters.fullName || appliedFilters.phone) {
      return paginatePatients(filteredPatients, currentPage);
    }
    return paginatePatients(data.patients, currentPage);
  }, [data.patients, filteredPatients, appliedFilters, currentPage]);

  const handleFilterChange = (field: keyof PatientListFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilter = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setCurrentPage(1);
  };

  const handleAddPatient = (
    form: NewPatientFormData,
    options: { openRecord: boolean; addAnother: boolean },
  ) => {
    const patient = registerDoctorPatient(form);
    setPatientsData(buildDoctorPatientsData());
    setCurrentPage(1);
    setSuccessMessage(`Đã thêm bệnh nhân ${patient.fullName} (${patient.patientCode}) thành công.`);

    if (options.openRecord) {
      setAddModalOpen(false);
      navigate(DOCTOR_PATHS.record(patient.id));
      return;
    }

    if (!options.addAnother) {
      setAddModalOpen(false);
    }
  };

  return (
    <div className="relative space-y-5 pb-20">
      <DoctorPatientsHeader onAddPatient={() => setAddModalOpen(true)} />

      {successMessage && (
        <p className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
          {successMessage}
        </p>
      )}

      <PatientListFiltersBar
        filters={filters}
        onChange={handleFilterChange}
        onFilter={handleApplyFilter}
        onRefresh={handleRefresh}
      />

      <PatientListTable patients={paginatedPatients} />

      <PatientListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={displayTotal}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />

      <PatientListSummaryCards summary={data.summary} />

      <button
        type="button"
        onClick={() => setAddModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#003d9b] text-white rounded-full shadow-lg shadow-[#003d9b]/30 flex items-center justify-center hover:bg-[#002d75] transition-colors"
        aria-label="Thêm bệnh nhân mới"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <AddPatientModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddPatient}
      />
    </div>
  );
};

export default DoctorPatientsPage;
