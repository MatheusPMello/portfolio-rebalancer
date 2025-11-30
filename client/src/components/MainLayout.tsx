// /client/src/components/MainLayout.tsx
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3">
        <div className="container">
          <Link
            to="/dashboard"
            className="navbar-brand fw-bold text-primary fs-4"
          >
            Portfolio Rebalancer
          </Link>

          <button
            className="btn btn-outline-danger btn-sm px-3"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container py-5">
        <Outlet />
      </div>
    </>
  );
}
