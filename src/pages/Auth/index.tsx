import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // When the auth state is still loading, show nothing
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If the user is already authenticated, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the Auth page content
  return <Outlet />;
};

export default AuthLayout;
