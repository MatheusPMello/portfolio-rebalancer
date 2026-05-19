/**
 * @file LoginPage.tsx
 * @description This component renders the login page, allowing users to sign in to their account.
 * It is designed to be rendered within the AuthLayout component.
 */

import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { AuthForm } from '../components/AuthForm';

/**
 * Renders the login page by using the shared AuthForm component.
 * @returns {JSX.Element} The login page component.
 */
export function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = async (credentials: { email: string; password: string }) => {
    const data = await authService.login(credentials);
    localStorage.setItem('token', data.token);
    navigate('/');
  };

  return (
    <AuthForm
      title="Welcome Back"
      submitButtonText="Log In"
      onSubmit={handleSubmit}
      errorMessagePrefix="Login failed. Please try again."
      footer={
        <p className="text-center mt-4">
          Don't Have An Account? <Link to="/register">Register Now.</Link>
        </p>
      }
    />
  );
}
