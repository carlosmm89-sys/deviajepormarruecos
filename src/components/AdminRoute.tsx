import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminLayout';

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
