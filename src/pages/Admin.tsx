import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { useAuth } from '../hooks/useAuth';
import { LoaderSpinner } from '../components/ui/Loader-spinner';

export function Admin() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <LoaderSpinner />;
  }

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
} 