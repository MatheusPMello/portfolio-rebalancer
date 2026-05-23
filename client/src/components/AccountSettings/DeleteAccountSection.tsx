import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import { getErrorMessage } from '../../utils/errorHandler';

interface DeleteAccountSectionProps {
  currentUserEmail: string;
}

export function DeleteAccountSection({ currentUserEmail }: Readonly<DeleteAccountSectionProps>) {
  const [typedEmail, setTypedEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const navigate = useNavigate();

  // Real-time validations
  const isEmailMatching = typedEmail.trim().toLowerCase() === currentUserEmail.trim().toLowerCase();
  const isPasswordNotEmpty = password.length > 0;

  const emailValidationError = emailTouched && typedEmail.length > 0 && !isEmailMatching
    ? 'Email does not match your currently registered email address.'
    : null;

  const passwordValidationError = passwordTouched && password.length > 0 && !isPasswordNotEmpty
    ? 'Password is required.'
    : null;

  const isSubmitDisabled = !isEmailMatching || !isPasswordNotEmpty || isLoading;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailMatching || !isPasswordNotEmpty) return;

    try {
      setIsLoading(true);
      setError(null);
      await userService.deleteAccount({ password });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err, 'Error deleting account. Please try again.'));
      setIsLoading(false);
    }
  };

  return (
    <div className="p-1">
      <h3 className="h5 mb-2 text-danger fw-bold">Danger Zone</h3>
      <p className="text-danger small fw-bold mb-4 bg-danger-subtle p-3 rounded border border-danger-subtle">
        WARNING: This action is irreversible. Once you delete your account, all your data, portfolio, and settings will be permanently erased.
      </p>

      {error && <div className="alert alert-danger py-2 px-3 small mb-3">{error}</div>}

      <form onSubmit={handleDelete} noValidate>
        <div className="mb-3">
          <label htmlFor="delete-account-email" className="form-label small fw-bold mb-1">
            Confirm Account Email Address
          </label>
          <input
            type="email"
            id="delete-account-email"
            className={`form-control ${emailValidationError ? 'is-invalid' : ''}`}
            value={typedEmail}
            onChange={(e) => {
              setTypedEmail(e.target.value);
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
          <label htmlFor="delete-account-password" className="form-label small fw-bold mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="delete-account-password"
            className={`form-control ${passwordValidationError ? 'is-invalid' : ''}`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
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
          className="btn btn-outline-danger w-100" 
          disabled={isSubmitDisabled}
          style={{ minHeight: '44px' }}
        >
          {isLoading ? (
            <>
              <output className="spinner-border spinner-border-sm me-2" aria-hidden="true"></output>
              <span>Deleting Account...</span>
            </>
          ) : (
            'Permanently Delete Account'
          )}
        </button>
      </form>
    </div>
  );
}
