/**
 * @file LoginPage.tsx
 * @description This component renders the login page, allowing users to sign in to their account.
 * It is designed to be rendered within the AuthLayout component.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Renders the login form and handles the user authentication process.
 * @returns {JSX.Element} The login page component.
 */
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  /**
   * Handles the form submission for the login attempt.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    setIsLoading(true);

    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      const message = getErrorMessage(err, 'Login failed. Please try again.');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="fw-bold mb-2">Welcome Back</h3>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        {isLoading && (
          <div className="alert alert-info small py-2 mb-3">
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            <span>Waking up the free server... this might take 30s.</span>
          </div>
        )}

        <div className="mb-3 w-100 text-start">
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
        <div className="mb-3 w-100 text-start">
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
            'Log In'
          )}
        </button>

        <p className="text-center mt-4">
          Don't Have An Account? <Link to="/register">Register Now.</Link>
        </p>
      </form>
    </>
  );
}
