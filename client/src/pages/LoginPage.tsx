// /client/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function LoginPage() {
  // Use 'useState' to manage the form's input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // This function will run when the form is submitted
  const handleSubmit = (event: React.FormEvent) => {
    // Prevent the browser from refreshing the page
    event.preventDefault();
    console.log('Login attempt with:', { email, password });
    // TODO: Call API service here
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
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