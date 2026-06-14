import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { User } from '../../../types';
import { PatientHealthRecordsData } from '../types';
import { buildPatientHealthRecordsData } from '../utils/buildPatientHealthRecordsData';

export const usePatientHealthRecords = (user?: User | null): UseQueryResult<PatientHealthRecordsData> =>
  useQuery({
    queryKey: ['patient', 'health-records', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Chưa đăng nhập');
      return buildPatientHealthRecordsData(user);
    },
    enabled: !!user,
    staleTime: 60_000,
  });
