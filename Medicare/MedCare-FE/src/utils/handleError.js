export { formatDate, formatCurrency } from './formatDate';

export const handleError = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'Đã xảy ra lỗi. Vui lòng thử lại.';
};
