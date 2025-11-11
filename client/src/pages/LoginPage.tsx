// /client/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const data = await authService.login({ email, password });
      console.log('Login Successful!', data);

      localStorage.setItem('token', data.token);

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(
        err.response?.data?.message || 'Login failed. Please try again.',
      );
    }
  };
  return (
    <div className="row justify-content-center">
      <div className="col-md-14 col-lg-12">
        <h2 className="text-center mb-4">Login</h2>
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
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
