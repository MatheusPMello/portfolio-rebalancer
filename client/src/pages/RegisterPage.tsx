/**
 * @file RegisterPage.tsx
 * @description This component renders the registration page, allowing new users to create an account.
 * It is designed to be rendered within the AuthLayout component.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Renders the registration form and handles the new user creation process.
 * @returns {JSX.Element} The registration page component.
 */
export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Handles the form submission for the registration attempt.
   * It prevents the default form submission, calls the auth service to register the user,
   * and handles the response. On success, it stores the token and navigates to the dashboard.
   * On failure, it displays an error message.
   * @param {React.FormEvent} event - The form submission event.
   * @description Handles form submission for user registration.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const data = await authService.register({ email, password });

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      const message = getErrorMessage(err, 'Registration failed. Please try again.');
      setError(message);
    }
  };

  return (
    <>
      <h3 className="fw-bold mb-2">Create an Account</h3>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3 text-start">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3 text-start">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2 fs-5 mt-3">
          Create Account
        </button>

        <p className="text-center mt-4">
          Already Have An Account? <Link to="/login">Log In Now.</Link>
        </p>
      </form>
    </>
  );
}
