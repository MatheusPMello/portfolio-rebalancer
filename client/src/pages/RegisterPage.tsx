/**
 * @file RegisterPage.tsx
 * @description This component renders the registration page, allowing new users to create an account.
 * It is designed to be rendered within the AuthLayout component.
 */

import React, { useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      const data = await authService.register({ email, password });

      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      const message = getErrorMessage(err, 'Registration failed. Please try again.');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="fw-bold mb-2">Create an Account</h3>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        {isLoading && (
          <div className="alert alert-info small py-2 mb-3">
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            <span>Waking up the free server... this might take 30s.</span>
          </div>
        )}

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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2 fs-5 mt-3" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
              <span>Connecting...</span>
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <p className="text-center mt-4">
          Already Have An Account? <Link to="/login">Log In Now.</Link>
        </p>
      </form>
    </>
  );
}
