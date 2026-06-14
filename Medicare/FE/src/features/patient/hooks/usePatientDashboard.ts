import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { User } from '../../../types';
import { PatientDashboardData } from '../types';
import { buildPatientDashboardData } from '../utils/buildPatientDashboardData';

export const usePatientDashboard = (user?: User | null): UseQueryResult<PatientDashboardData> =>
  useQuery({
    queryKey: ['patient', 'dashboard', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Chưa đăng nhập');
      return buildPatientDashboardData(user);
    },
    enabled: !!user,
    staleTime: 60_000,
  });
