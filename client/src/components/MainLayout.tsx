import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AccountSettingsModal } from './AccountSettings/AccountSettingsModal';

export function MainLayout() {
  const navigate = useNavigate();

  const [showAccountSettingsModal, setShowAccountSettingsModal] = useState(false);

  const handleAccountSettings = () => {
    setShowAccountSettingsModal(true);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold text-primary fs-4">
            Portfolio Rebalancer
          </Link>

          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm px-3" onClick={handleAccountSettings}>Account</button>
            <button className="btn btn-outline-danger btn-sm px-3" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <Outlet />
      </div>

      <AccountSettingsModal 
        show={showAccountSettingsModal} 
        onClose={() => setShowAccountSettingsModal(false)} 
      />
    </>
  );
}
