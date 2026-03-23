import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const isAdminLoggedIn = localStorage.getItem('admin_session') === 'true';

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
