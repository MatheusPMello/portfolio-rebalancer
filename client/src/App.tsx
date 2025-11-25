/**
 * @file App.tsx
 * @description This is the root component of the application. It sets up the routing structure
 * using React Router, defining which components are rendered for different URL paths.
 * It uses a layout-based approach to group routes (e.g., authentication vs. main application).
 */

import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layout components provide a consistent frame for different sections of the app.
import { AuthLayout } from './components/AuthLayout';
import { MainLayout } from './components/MainLayout';

// Page components are the main content for each route.
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

/**
 * The main App component that defines the application's routes.
 * - Routes under `/login` and `/register` use the `AuthLayout`.
 * - Routes under `/` and `/dashboard` use the `MainLayout`.
 * @returns {JSX.Element} The router configuration for the application.
 */
function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;