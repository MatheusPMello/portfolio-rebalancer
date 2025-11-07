// /client/src/App.tsx

import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// 1. Import your new page components
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function App() {
  return (
    <div className="App">
      {/* (Your navbar code is here) */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">Portfolio Rebalancer</Link>
          <div>
            <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
            <Link to="/register" className="btn btn-light">Register</Link>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h2>Welcome Home!</h2>} />
          
          {/* 2. Use your new components in the routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;