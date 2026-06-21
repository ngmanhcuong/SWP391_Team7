import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { User } from '../../../types';
import { PatientDashboardData } from '../types';
import { patientApi } from '../api/patientApi';

export const usePatientDashboard = (user?: User | null): UseQueryResult<PatientDashboardData> =>
  useQuery({
    queryKey: ['patient', 'dashboard', user?.id],
    queryFn: () => patientApi.getDashboard(),
    enabled: !!user,
    staleTime: 60_000,
  });
