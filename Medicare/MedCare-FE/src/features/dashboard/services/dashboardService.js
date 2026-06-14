import axiosClient from '../../../services/axiosClient';
import { API_ENDPOINTS } from '../../../constants/apiEndpoints';
import { DASHBOARD_MOCK } from '../constants/mockData';

export const fetchDashboardOverview = async () => {
  try {
    return await axiosClient.get(API_ENDPOINTS.DASHBOARD.OVERVIEW);
  } catch {
    // Fallback mock data khi API chưa sẵn sàng
    return DASHBOARD_MOCK;
  }
};
