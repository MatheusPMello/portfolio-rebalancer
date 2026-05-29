import React, { useState } from 'react';
import userService from '../../services/userService';
import { getErrorMessage } from '../../utils/errorHandler';
import { Button } from '../Button';

/**
 * Form to update user account password, with real-time validation checks for
 * length, password matching, and credential verify state.
 *
 * @returns React component rendering the update password form.
 */
export function UpdatePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [currentPasswordTouched, setCurrentPasswordTouched] = useState(false);
  const [newPasswordTouched, setNewPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Real-time validations
  const isCurrentPasswordNotEmpty = currentPassword.trim().length > 0;
  const isNewPasswordLongEnough = newPassword.length >= 6;
  const isConfirmPasswordMatching = newPassword === confirmPassword;

  const currentPasswordValidationError =
    currentPasswordTouched && !isCurrentPasswordNotEmpty ? 'Current password is required.' : null;

  const newPasswordValidationError =
    newPasswordTouched && newPassword.length > 0 && !isNewPasswordLongEnough
      ? 'Password must be at least 6 characters.'
      : null;

  const confirmPasswordValidationError =
    confirmPasswordTouched && confirmPassword.length > 0 && !isConfirmPasswordMatching
      ? 'Passwords do not match.'
      : null;

  const isSubmitDisabled =
    !isCurrentPasswordNotEmpty ||
    !isNewPasswordLongEnough ||
    !isConfirmPasswordMatching ||
    isLoading;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must differ from current password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await userService.updatePassword({
        currentPassword,
        newPassword,
      });

      setSuccessMessage(response.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPasswordTouched(false);
      setNewPasswordTouched(false);
      setConfirmPasswordTouched(false);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update password. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-1">
      <h3 className="h5 mb-2 text-dark fw-bold">Update Password</h3>
      <p className="text-muted small mb-4">Change the password associated with your account.</p>

      {error && <div className="alert alert-danger py-2 px-3 small mb-3">{error}</div>}
      {successMessage && (
        <div className="alert alert-success py-2 px-3 small mb-3">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="current-password-input" className="form-label small fw-bold mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="current-password-input"
            className={`form-control ${currentPasswordValidationError ? 'is-invalid' : ''}`}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setCurrentPasswordTouched(true);
            }}
            onBlur={() => setCurrentPasswordTouched(true)}
            disabled={isLoading}
            required
          />
          {currentPasswordValidationError && (
            <div className="text-danger small mt-1" style={{ fontSize: '12px' }}>
              {currentPasswordValidationError}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="new-password-input" className="form-label small fw-bold mb-1">
            New Password
          </label>
          <input
            type="password"
            id="new-password-input"
            className={`form-control ${newPasswordValidationError ? 'is-invalid' : ''}`}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setNewPasswordTouched(true);
            }}
            onBlur={() => setNewPasswordTouched(true)}
            disabled={isLoading}
            required
          />
          <div className="text-muted small mt-1" style={{ fontSize: '12px' }}>
            Minimum of 6 characters
          </div>
          {newPasswordValidationError && (
            <div className="text-danger small mt-1" style={{ fontSize: '12px' }}>
              {newPasswordValidationError}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirm-password-input" className="form-label small fw-bold mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirm-password-input"
            className={`form-control ${confirmPasswordValidationError ? 'is-invalid' : ''}`}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPasswordTouched(true);
            }}
            onBlur={() => setConfirmPasswordTouched(true)}
            disabled={isLoading}
            required
          />
          {confirmPasswordValidationError && (
            <div className="text-danger small mt-1" style={{ fontSize: '12px' }}>
              {confirmPasswordValidationError}
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="solid"
          color="primary"
          className="w-100"
          disabled={isSubmitDisabled}
          style={{ minHeight: '44px' }}
        >
          {isLoading ? (
            <>
              <output className="spinner-border spinner-border-sm me-2" aria-hidden="true"></output>
              <span>Updating...</span>
            </>
          ) : (
            'Update Password'
          )}
        </Button>
      </form>
    </div>
  );
}
