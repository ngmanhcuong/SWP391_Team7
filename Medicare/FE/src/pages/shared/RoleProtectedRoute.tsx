import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AppRole, getRoleDashboardPath } from './roleConfig';

interface RoleProtectedRouteProps {
  allowedRoles: AppRole[];
  children: React.ReactNode;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  }

  const userRole = (user?.role ?? 'patient') as AppRole;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={getRoleDashboardPath(userRole)} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
