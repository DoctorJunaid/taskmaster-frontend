import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute() {
  const { user, loading } = useAuth();

  // 1. Wait for the "Check-up" /me call to finish
  if (loading) return null; 

  // 2. If user is ALREADY logged in, redirect them to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. If not logged in, let them see the Login/Signup page
  return <Outlet />;
}