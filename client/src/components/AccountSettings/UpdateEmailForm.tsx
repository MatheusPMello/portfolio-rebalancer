import React, { useState } from 'react';
import userService from '../../services/userService';
import { getErrorMessage } from '../../utils/errorHandler';

interface UpdateEmailFormProps {
  currentEmail: string;
  onSuccess: (newEmail: string) => void;
}

export function UpdateEmailForm({ currentEmail, onSuccess }: Readonly<UpdateEmailFormProps>) {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Real-time validation
  const isEmailNotEmpty = email.trim().length > 0;
  const isPasswordNotEmpty = currentPassword.trim().length > 0;

  const emailValidationError =
    emailTouched && email.length > 0 && !isEmailNotEmpty ? 'Email cannot be empty.' : null;
  const passwordValidationError =
    passwordTouched && currentPassword.length > 0 && !isPasswordNotEmpty
      ? 'Password cannot be empty.'
      : null;

  const isSubmitDisabled = !isEmailNotEmpty || !isPasswordNotEmpty || isLoading;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isEmailNotEmpty || !isPasswordNotEmpty) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await userService.updateEmail({
        email: email.trim(),
        currentPassword,
      });

      setSuccessMessage(response.message || 'Email updated successfully.');
      onSuccess(email.trim());
      setEmail('');
      setCurrentPassword('');
      setEmailTouched(false);
      setPasswordTouched(false);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update email. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-1">
      <h3 className="h5 mb-2 text-dark fw-bold">Update Email</h3>
      <p className="text-muted small mb-4">
        Change the email address associated with your account.
      </p>

      {currentEmail && (
        <div className="mb-4 p-3 bg-light rounded border">
          <span className="text-secondary small d-block mb-1">Current Email Address</span>
          <strong className="text-dark fs-6">{currentEmail}</strong>
        </div>
      )}

      {error && <div className="alert alert-danger py-2 px-3 small mb-3">{error}</div>}
      {successMessage && (
        <div className="alert alert-success py-2 px-3 small mb-3">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="update-email-input" className="form-label small fw-bold mb-1">
            New Email Address
          </label>
          <input
            type="email"
            id="update-email-input"
            className={`form-control ${emailValidationError ? 'is-invalid' : ''}`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailTouched(true);
            }}
            onBlur={() => setEmailTouched(true)}
            disabled={isLoading}
            required
          />
          {emailValidationError && (
            <div className="text-danger small mt-1" style={{ fontSize: '12px' }}>
              {emailValidationError}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="update-email-password" className="form-label small fw-bold mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="update-email-password"
            className={`form-control ${passwordValidationError ? 'is-invalid' : ''}`}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setPasswordTouched(true);
            }}
            onBlur={() => setPasswordTouched(true)}
            disabled={isLoading}
            required
          />
          {passwordValidationError && (
            <div className="text-danger small mt-1" style={{ fontSize: '12px' }}>
              {passwordValidationError}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isSubmitDisabled}
          style={{ minHeight: '44px' }}
        >
          {isLoading ? (
            <>
              <output className="spinner-border spinner-border-sm me-2" aria-hidden="true"></output>
              <span>Updating...</span>
            </>
          ) : (
            'Update Email'
          )}
        </button>
      </form>
    </div>
  );
}
