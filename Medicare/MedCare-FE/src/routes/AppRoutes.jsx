import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import HomePage from '../pages/HomePage';
import PlaceholderPage from '../pages/PlaceholderPage';
import { PaymentsPage } from '../features/payment/components';
import { ROUTES } from '../constants/routes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route
          path={ROUTES.APPOINTMENTS}
          element={
            <PlaceholderPage
              title="Lịch hẹn"
              description="Quản lý và theo dõi lịch hẹn khám bệnh."
            />
          }
        />
        <Route
          path={ROUTES.RECORDS}
          element={
            <PlaceholderPage title="Hồ sơ bệnh án" description="Theo dõi bệnh án và đơn thuốc." />
          }
        />
        <Route
          path={ROUTES.NOTIFICATIONS}
          element={
            <PlaceholderPage title="Thông báo" description="Tất cả thông báo hệ thống." />
          }
        />
        <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
        <Route
          path={ROUTES.REVIEWS}
          element={
            <PlaceholderPage title="Đánh giá dịch vụ" description="Phản hồi và đánh giá dịch vụ." />
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={<PlaceholderPage title="Cài đặt" description="Cấu hình tài khoản và hệ thống." />}
        />
        <Route
          path={ROUTES.HELP}
          element={<PlaceholderPage title="Trợ giúp" description="Hướng dẫn sử dụng MedCare." />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
