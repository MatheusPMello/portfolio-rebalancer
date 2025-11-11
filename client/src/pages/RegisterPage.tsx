// /client/src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 1. Import our new auth service
import authService from '../services/authService';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const data = await authService.register({ email, password });

      console.log('Register Successful!', data);

      localStorage.setItem('token', data.token);

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Register failed:', err);
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.',
      );
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-14 col-lg-12">
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          {/* This part shows the error if it exists */}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2">
            Create Account
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
