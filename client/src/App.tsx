// /client/src/App.tsx

import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <div className="App">
      {/* (Your navbar code is here) */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Portfolio Rebalancer
          </Link>
          <div>
            <Link to="/login" className="btn btn-outline-light me-2">
              Login
            </Link>
            <Link to="/register" className="btn btn-light">
              Register
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<DashboardPage />} />{' '}
          {/* 2. Set Dashboard as the home page for now */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />{' '}
          {/* 3. Add a dedicated route */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
