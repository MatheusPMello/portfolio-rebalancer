/**
 * @file MainLayout.tsx
 * @description This component provides the main layout for the authenticated part of the application.
 * It includes a navigation bar with a logout button and a content area where nested routes are rendered.
 */

import { Link, Outlet, useNavigate } from 'react-router-dom';

/**
 * A functional component that serves as the main application layout.
 * It includes a navbar and uses React Router's <Outlet> to render the content of child routes.
 * @returns {JSX.Element} The rendered main layout.
 */
export function MainLayout() {
  const navigate = useNavigate();

  /**
   * Handles the user logout process.
   * It removes the authentication token from local storage and redirects the user to the login page.
   */
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to login
  };

  return (
    <>
      {/* This is your familiar navbar */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link to="/dashboard" className="navbar-brand">
            Portfolio Rebalancer
          </Link>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* This is the container for your page content */}
      <div className="container mt-4">
        {/* The child route (e.g., DashboardPage) will be rendered here */}
        <Outlet />
      </div>
    </>
  );
}