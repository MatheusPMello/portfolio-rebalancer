/**
 * @file AuthForm.tsx
 * @description A reusable form component for authentication pages (Login and Register)
 * to reduce code duplication and centralize loading/error handling.
 */

import React, { useState } from 'react';
import { ServerWakeupAlert } from './ServerWakeupAlert';
import { getErrorMessage } from '../utils/errorHandler';

interface AuthFormProps {
  title: string;
  submitButtonText: string;
  onSubmit: (credentials: { email: string; password: string; }) => Promise<void>;
  errorMessagePrefix: string;
  footer: React.ReactNode;
}

/**
 * Renders a standardized login/registration form with built-in loading and error management.
 * @param {AuthFormProps} props - Component props.
 * @returns {JSX.Element} The authentication form component.
 */
export function AuthForm({
  title,
  submitButtonText,
  onSubmit,
  errorMessagePrefix,
  footer,
}: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onSubmit({ email, password });
    } catch (err) {
      const message = getErrorMessage(err, errorMessagePrefix);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="fw-bold mb-2">{title}</h3>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <ServerWakeupAlert isLoading={isLoading} />

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
            submitButtonText
          )}
        </button>

        {footer}
      </form>
    </>
  );
}
