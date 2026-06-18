import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { User } from '../../../types';
import { DoctorDashboardData } from '../types';
import { buildDoctorDashboardData } from '../utils/buildDoctorDashboardData';

export const useDoctorDashboard = (user?: User | null): UseQueryResult<DoctorDashboardData> =>
  useQuery({
    queryKey: ['doctor', 'dashboard', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Chưa đăng nhập');
      return buildDoctorDashboardData(user);
    },
    enabled: !!user,
    staleTime: 60_000,
  });
