import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { User } from '../../../types';
import { PatientHealthRecordsData } from '../types';
import { patientApi } from '../api/patientApi';

export const usePatientHealthRecords = (user?: User | null): UseQueryResult<PatientHealthRecordsData> =>
  useQuery({
    queryKey: ['patient', 'health-records', user?.id],
    queryFn: () => patientApi.getHealthRecords(),
    enabled: !!user,
    staleTime: 60_000,
  });
