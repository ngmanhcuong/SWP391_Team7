import { useEffect, useState } from 'react';
import { fetchDashboardOverview } from '../services/dashboardService';

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchDashboardOverview();
        if (mounted) setData(response);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
};
