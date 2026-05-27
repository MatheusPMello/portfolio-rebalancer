/**
 * @file AuthForm.tsx
 * @description A reusable form component for authentication pages (Login and Register)
 * to reduce code duplication and centralize loading/error handling.
 */

import React, { useState } from 'react';
import { ServerWakeupAlert } from './ServerWakeupAlert';
import { getErrorMessage } from '../utils/errorHandler';
import { Button } from './Button';

interface AuthFormProps {
  title: string;
  submitButtonText: string;
  onSubmit: (credentials: { email: string; password: string; }) => Promise<void>;
  errorMessagePrefix: string;
  footer: React.ReactNode;
  isLogin: boolean;
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
  isLogin,
}: Readonly<AuthFormProps>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
            autoComplete="email"
          />
        </div>
        <div className="mb-3 w-100 text-start">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              disabled={isLoading}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                  <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.97 0 1.861-.242 2.685-.673l.799.799A7 7 0 0 1 8 13.5c-5 0-8-5.5-8-5.5s-.981-1.79 1.172-3.628zm10.428 10.427a.5.5 0 0 1-.708 0L.707 3.313a.5.5 0 1 1 .708-.708L13.778 15.11a.5.5 0 0 1 0 .708"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <Button type="submit" variant="solid" color="primary" className="w-100 py-2 fs-5 mt-3" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
              <span>Connecting...</span>
            </>
          ) : (
            submitButtonText
          )}
        </Button>

        {footer}
      </form>
    </>
  );
}
