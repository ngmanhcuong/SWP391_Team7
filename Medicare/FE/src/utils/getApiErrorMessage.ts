import axios from 'axios';

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const serverMessage = error.response?.data?.message;
  if (typeof serverMessage === 'string' && serverMessage.trim()) {
    return serverMessage;
  }

  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'Không kết nối được máy chủ. Backend có thể chưa chạy hoặc REACT_APP_API_URL chưa trỏ đúng URL API trên môi trường deploy.';
  }

  if (error.code === 'ECONNABORTED') {
    return 'Máy chủ phản hồi quá chậm. Vui lòng thử lại sau.';
  }

  return fallback;
};
