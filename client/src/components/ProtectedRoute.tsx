/**
 * @file ProtectedRoute.tsx
 * @description This component acts as a wrapper for routes that should only be accessible to authenticated users.
 * It checks for the presence of a token in localStorage and redirects unauthenticated users to the login page.
 */

import { Navigate } from 'react-router-dom';

/**
 * Props for the ProtectedRoute component.
 */
interface ProtectedRouteProps {
  /** The child components/pages to render if authenticated. */
  children: React.ReactNode;
}

/**
 * Route guard component that restricts access to authenticated users.
 * Checks for a JWT token in local storage and redirects to /login if missing.
 *
 * @param props - Component props containing children.
 * @returns The children component tree if authenticated, otherwise a redirect Navigate element.
 */
export function ProtectedRoute({ children }: Readonly<ProtectedRouteProps>) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
