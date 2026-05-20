import React, { useState } from 'react';
import userService from '../../services/userService';
import { getErrorMessage } from '../../utils/errorHandler';

export function UpdatePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

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
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update password. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded p-3">
      <h3 className="h5 mb-3 text-dark">Update Password</h3>
      <p className="text-muted small mb-3">
        Change the password associated with your account.
      </p>

      {error && <div className="alert alert-danger py-2 px-3 small mb-3">{error}</div>}
      {successMessage && <div className="alert alert-success py-2 px-3 small mb-3">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="current-password-input" className="form-label small fw-bold">
            Current Password
          </label>
          <input
            type="password"
            id="current-password-input"
            className="form-control"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="new-password-input" className="form-label small fw-bold">
            New Password
          </label>
          <input
            type="password"
            id="new-password-input"
            className={`form-control ${error && newPassword.length < 6 ? 'is-invalid' : ''}`}
            placeholder="Enter new password (min. 6 chars)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirm-password-input" className="form-label small fw-bold">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirm-password-input"
            className={`form-control ${error && newPassword !== confirmPassword ? 'is-invalid' : ''}`}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
          {isLoading ? (
            <>
              <output className="spinner-border spinner-border-sm me-2" aria-hidden="true"></output>
              <span>Updating...</span>
            </>
          ) : (
            'Update Password'
          )}
        </button>
      </form>
    </div>
  );
}
