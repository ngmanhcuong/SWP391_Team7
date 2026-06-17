import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getRoleDashboardPath } from './roleConfig';

const RootRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  }

  return <Navigate to="/" replace />;
};

export default RootRedirect;
