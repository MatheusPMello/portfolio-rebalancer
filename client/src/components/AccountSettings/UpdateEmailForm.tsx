import React, { useState } from 'react';
import userService from '../../services/userService';
import { getErrorMessage } from '../../utils/errorHandler';

export function UpdateEmailForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await userService.updateEmail({ email: email.trim() });
      setSuccessMessage(response.message || 'Email updated successfully.');
      setEmail('');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update email. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded p-3">
      <h3 className="h5 mb-3 text-dark">Update Email</h3>
      <p className="text-muted small mb-3">
        Change the email address associated with your account.
      </p>

      {error && <div className="alert alert-danger py-2 px-3 small mb-3">{error}</div>}
      {successMessage && <div className="alert alert-success py-2 px-3 small mb-3">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="update-email-input" className="form-label small fw-bold">
            New Email Address
          </label>
          <input
            type="email"
            id="update-email-input"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            placeholder="Enter new email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Updating...
            </>
          ) : (
            'Update Email'
          )}
        </button>
      </form>
    </div>
  );
}
