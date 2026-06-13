import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '../store/authStore';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const requestUrl = String(error.config?.url ?? '');
      const isLogoutRequest = requestUrl.includes('/auth/logout');

      useAuthStore.getState().logout();

      if (!isLogoutRequest && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
