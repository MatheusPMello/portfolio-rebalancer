/**
 * @file LoginPage.tsx
 * @description This component renders the login page, allowing users to sign in to their account.
 * It is designed to be rendered within the AuthLayout component.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * Renders the login form and handles the user authentication process.
 * @returns {JSX.Element} The login page component.
 */
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Handles the form submission for the login attempt.
   * It prevents the default form submission, calls the auth service, and handles the response.
   * On success, it stores the token and navigates to the dashboard.
   * On failure, it displays an error message.
   * @param {React.FormEvent} event - The form submission event.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.',
      );
    }
  };

  return (
    <>
      <h3 className="fw-bold mb-2">Welcome Back</h3>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

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
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2 fs-5 mt-3">
          Log In
        </button>

        <p className="text-center mt-4">
          Don't Have An Account? <Link to="/register">Register Now.</Link>
        </p>
      </form>
    </>
  );
}
