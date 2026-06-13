import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/layout/ProtectedRoute';
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

          {/* Protected */}
          <Route path="/ho-so" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/cai-dat" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
