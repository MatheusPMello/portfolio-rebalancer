/**
 * @file main.tsx
 * @description This is the main entry point for the React application.
 * It initializes the React DOM and renders the root component (`App`) into the HTML.
 * It also sets up global providers like the Router.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Import the root App component
import App from './App.tsx';

// Import global stylesheets
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

/**
 * Renders the root of the React application.
 * - `React.StrictMode` is a tool for highlighting potential problems in an application.
 * - `BrowserRouter` enables client-side routing for the entire app.
 * - `App` is the root component that contains all other components and routes.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
