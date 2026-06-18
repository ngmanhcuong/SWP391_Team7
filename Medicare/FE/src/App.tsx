import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { DashboardLayout, RoleProtectedRoute } from './pages';
import RootRedirect from './pages/shared/RootRedirect';
import ThemeSync from './components/ThemeSync';
import { Spinner } from './components/ui';

const LoginPage = lazy(() => import('./features/auth/components/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/components/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./features/auth/components/ForgotPasswordPage'));
const { CheckEmailPage, VerifyEmailPage } = { 
  CheckEmailPage: lazy(() => import('./features/auth/components/EmailVerifyPages').then(m => ({ default: m.CheckEmailPage }))),
  VerifyEmailPage: lazy(() => import('./features/auth/components/EmailVerifyPages').then(m => ({ default: m.VerifyEmailPage }))),
};
const GoogleSuccessPage = lazy(() => import('./features/auth/components/GoogleSuccessPage'));
const HomePage = lazy(() => import('./features/home/components/HomePage'));
const ProfilePage = lazy(() => import('./features/profile/components/ProfilePage'));
const SettingsPage = lazy(() => import('./features/profile/components/SettingsPage'));

const PatientDashboardPage = lazy(() => import('./pages/patient').then(m => ({ default: m.PatientDashboardPage })));
const PatientAppointmentsPage = lazy(() => import('./pages/patient').then(m => ({ default: m.PatientAppointmentsPage })));
const PatientProfilePage = lazy(() => import('./pages/patient').then(m => ({ default: m.PatientProfilePage })));
const PatientHealthRecordsPage = lazy(() => import('./pages/patient').then(m => ({ default: m.PatientHealthRecordsPage })));
const PatientNotificationsPage = lazy(() => import('./pages/patient').then(m => ({ default: m.PatientNotificationsPage })));
const PatientPaymentsPage = lazy(() => import('./pages/patient').then(m => ({ default: m.PatientPaymentsPage })));
const PatientReviewsPage = lazy(() => import('./pages/patient').then(m => ({ default: m.PatientReviewsPage })));

const DoctorDashboardPage = lazy(() => import('./pages/doctor').then(m => ({ default: m.DoctorDashboardPage })));
const DoctorSchedulePage = lazy(() => import('./pages/doctor').then(m => ({ default: m.DoctorSchedulePage })));
const DoctorPatientsPage = lazy(() => import('./pages/doctor').then(m => ({ default: m.DoctorPatientsPage })));
const DoctorRecordsPage = lazy(() => import('./pages/doctor').then(m => ({ default: m.DoctorRecordsPage })));
const DoctorRecordsIndexPage = lazy(() => import('./pages/doctor').then(m => ({ default: m.DoctorRecordsIndexPage })));
const DoctorSettingsPage = lazy(() => import('./pages/doctor').then(m => ({ default: m.DoctorSettingsPage })));

const ReceptionistDashboardPage = lazy(() => import('./pages/receptionist').then(m => ({ default: m.ReceptionistDashboardPage })));
const ReceptionistAppointmentsPage = lazy(() => import('./pages/receptionist').then(m => ({ default: m.ReceptionistAppointmentsPage })));
const ReceptionistQueuePage = lazy(() => import('./pages/receptionist').then(m => ({ default: m.ReceptionistQueuePage })));
const ReceptionistReceptionPage = lazy(() => import('./pages/receptionist').then(m => ({ default: m.ReceptionistReceptionPage })));
const ReceptionistPatientRegisterPage = lazy(() => import('./pages/receptionist').then(m => ({ default: m.ReceptionistPatientRegisterPage })));
const ReceptionistBillingPayment = lazy(() => import('./pages/receptionist').then(m => ({ default: m.ReceptionistBillingPayment })));
const ReceptionistPaymentsPage = lazy(() => import('./pages/receptionist').then(m => ({ default: m.ReceptionistPaymentsPage })));
const ReceptionistNotificationsPage = lazy(() => import('./pages/receptionist').then(m => ({ default: m.ReceptionistNotificationsPage })));
const ReceptionistProfilePage = lazy(() => import('./pages/receptionist').then(m => ({ default: m.ReceptionistProfilePage })));

const AdminDashboardPage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminDashboardPage })));
const AdminUsersPage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminUsersPage })));
const AdminReportsPage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminReportsPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminSettingsPage })));
const AdminDoctorsPage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminDoctorsPage })));
const AdminDepartmentsPage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminDepartmentsPage })));
const AdminRoomsPage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminRoomsPage })));
const AdminAppointmentsPage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminAppointmentsPage })));
const AdminFeedbackPage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminFeedbackPage })));
const AdminAuditLogPage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminAuditLogPage })));
const AdminProfilePage = lazy(() => import('./pages/admin').then(m => ({ default: m.AdminProfilePage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
    mutations: { retry: 0 },
  },
});

const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500 dark:text-slate-400">Đang tải...</p>
    </div>
  </div>
);

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeSync />
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public auth */}
          <Route path="/dang-nhap" element={<LoginPage />} />
          <Route path="/dang-ky" element={<RegisterPage />} />
          <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
          <Route path="/xac-thuc-email" element={<CheckEmailPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/google/success" element={<GoogleSuccessPage />} />

          {/* Public */}
          <Route path="/" element={<HomePage />} />

          {/* Protected — shared */}
          <Route path="/ho-so" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/cai-dat" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Role-based dashboards */}
          <Route path="/patient" element={<RoleProtectedRoute allowedRoles={['patient']}><DashboardLayout role="patient" /></RoleProtectedRoute>}>
            <Route index element={<PatientDashboardPage />} />
            <Route path="benh-nhan" element={<PatientProfilePage />} />
            <Route path="lich-hen" element={<PatientAppointmentsPage />} />
            <Route path="ho-so" element={<PatientHealthRecordsPage />} />
            <Route path="thong-bao" element={<PatientNotificationsPage />} />
            <Route path="thanh-toan" element={<PatientPaymentsPage />} />
            <Route path="danh-gia" element={<PatientReviewsPage />} />
          </Route>

          <Route path="/doctor" element={<RoleProtectedRoute allowedRoles={['doctor']}><DashboardLayout role="doctor" /></RoleProtectedRoute>}>
            <Route index element={<DoctorDashboardPage />} />
            <Route path="lich-kham" element={<DoctorSchedulePage />} />
            <Route path="benh-nhan" element={<DoctorPatientsPage />} />
            <Route path="benh-an" element={<DoctorRecordsIndexPage />} />
            <Route path="benh-an/:patientId" element={<DoctorRecordsPage />} />
            <Route path="cai-dat" element={<DoctorSettingsPage />} />
          </Route>

          <Route path="/receptionist" element={<RoleProtectedRoute allowedRoles={['receptionist']}><DashboardLayout role="receptionist" /></RoleProtectedRoute>}>
            <Route index element={<ReceptionistDashboardPage />} />
            <Route path="tiep-nhan" element={<ReceptionistReceptionPage />} />
            <Route path="hang-cho" element={<ReceptionistQueuePage />} />
            <Route path="lich-hen" element={<ReceptionistAppointmentsPage />} />
            <Route path="benh-nhan" element={<ReceptionistPatientRegisterPage />} />
            <Route path="thanh-toan" element={<ReceptionistBillingPayment />} />
            <Route path="hoa-don" element={<ReceptionistPaymentsPage />} />
            <Route path="thong-bao" element={<ReceptionistNotificationsPage />} />
            <Route path="ho-so" element={<ReceptionistProfilePage />} />
          </Route>

          <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['admin']}><DashboardLayout role="admin" /></RoleProtectedRoute>}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="nguoi-dung" element={<AdminUsersPage />} />
            <Route path="bac-si" element={<AdminDoctorsPage />} />
            <Route path="khoa" element={<AdminDepartmentsPage />} />
            <Route path="phong" element={<AdminRoomsPage />} />
            <Route path="lich-hen" element={<AdminAppointmentsPage />} />
            <Route path="danh-gia" element={<AdminFeedbackPage />} />
            <Route path="bao-cao" element={<AdminReportsPage />} />
            <Route path="nhat-ky" element={<AdminAuditLogPage />} />
            <Route path="ho-so" element={<AdminProfilePage />} />
            <Route path="cai-dat" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
