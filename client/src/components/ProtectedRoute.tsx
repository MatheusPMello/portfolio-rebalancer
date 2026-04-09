/**
 * @file ProtectedRoute.tsx
 * @description This component acts as a wrapper for routes that should only be accessible to authenticated users.
 * It checks for the presence of a token in localStorage and redirects unauthenticated users to the login page.
 */

import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Readonly<ProtectedRouteProps>) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
