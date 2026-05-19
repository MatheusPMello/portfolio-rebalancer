/**
 * @file RegisterPage.tsx
 * @description This component renders the registration page, allowing new users to create an account.
 * It is designed to be rendered within the AuthLayout component.
 */

import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { AuthForm } from '../components/AuthForm';

/**
 * Renders the registration page by using the shared AuthForm component.
 * @returns {JSX.Element} The registration page component.
 */
export function RegisterPage() {
  const navigate = useNavigate();

  const handleSubmit = async (credentials: { email: string; password: string }) => {
    const data = await authService.register(credentials);
    localStorage.setItem('token', data.token);
    navigate('/');
  };

  return (
    <AuthForm
      title="Create an Account"
      submitButtonText="Create Account"
      onSubmit={handleSubmit}
      errorMessagePrefix="Registration failed. Please try again."
      footer={
        <p className="text-center mt-4">
          Already Have An Account? <Link to="/login">Log In Now.</Link>
        </p>
      }
    />
  );
}
