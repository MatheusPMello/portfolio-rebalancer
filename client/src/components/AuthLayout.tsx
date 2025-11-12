/**
 * @file AuthLayout.tsx
 * @description This component provides a consistent layout for authentication-related pages,
 * such as login and registration. It features a two-column design with a form on one side
 * and a showcase section on the other.
 */

import { Outlet } from 'react-router-dom';
import './AuthLayout.css'; // Import the centralized CSS

/**
 * A functional component that serves as a layout for authentication pages.
 * It uses React Router's <Outlet> to render nested routes (e.g., LoginPage, RegisterPage)
 * within its structure.
 * @returns {JSX.Element} The rendered authentication layout.
 */
export function AuthLayout() {
  return (
    <div className="login-page-container">
      <div className="login-card shadow-sm">
        <div className="row g-0">
          
          {/* 1. LEFT FORM SIDE */}
          <div className="col-lg-6">
            <div className="login-form-container p-4 p-md-5">
              
              {/*
                This 'children' prop is the magic.
                It will render WHATEVER we put inside the <AuthLayout> tag.
                (e.g., the <LoginPage> form, or the <RegisterPage> form)
              */}
              <Outlet />

            </div>
          </div>

          {/* 2. RIGHT IMAGE SIDE */}
          <div className="col-lg-6 d-none d-lg-block">
            <div className="login-showcase-container">
              <h2 className="text-white fw-bold">Effortlessly manage your investments.</h2>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}