# 💻 Portfolio Rebalancer - Client Application

This is the frontend Single Page Application (SPA) for **Portfolio Rebalancer**, built with React, Vite, TypeScript, and Bootstrap for styling.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js v18+ installed.

### Setup and Running
To run the client application in isolation:

1.  **Install dependencies**:
    ```bash
    cd client
    npm install
    ```

2.  **Start development server**:
    ```bash
    npm run dev
    ```
    This will run the application on [http://localhost:5173](http://localhost:5173).

3.  **Build for production**:
    ```bash
    npm run build
    ```
    The production bundle is built into the `dist/` directory.

4.  **Lint and Format**:
    ```bash
    npm run lint
    npm run format
    ```

---

## 📂 Project Architecture

```text
/client/
|-- /public/                  # Static assets (favicons, etc.)
|-- /src/
|   |-- /assets/              # Images, SVG resources
|   |-- /components/          # Reusable UI layout & custom elements
|   |   |-- /AccountSettings/ # Modal and sub-forms for user settings
|   |   |-- AuthLayout.tsx    # Frame for login & register pages
|   |   |-- MainLayout.tsx    # Header, main body and footer frame
|   |   |-- RebalanceDrawer.x # Interactive drawer showing rebalance suggestions
|   |   |-- PortfolioCharts.x # Allocation chart (Current vs. Target) using Chart.js
|   |-- /pages/               # High-level route views
|   |   |-- DashboardPage.tsx # Core workspace containing asset lists, charts & rebalancing
|   |   |-- LoginPage.tsx     # Sign-in route page
|   |   |-- RegisterPage.tsx  # Sign-up route page
|   |-- /services/            # API Client services communicating with the Backend
|   |   |-- api.ts            # Base Axios instance with interceptors for JWT injection
|   |   |-- assetService.ts   # CRUD operations for managing user portfolio assets
|   |   |-- authService.ts    # Authentication API requests (login/register)
|   |   |-- currencyService.ts# Fetches latest BRL/USD exchange rates
|   |   |-- rebalanceService.ts# Calls the backend calculations engine
|   |   |-- userService.ts    # User settings and delete account API endpoints
|   |-- /utils/               # Financial math helper functions & error handling
|   |-- App.tsx               # Root component establishing application routes
|   |-- main.tsx              # React mounting entry point
|   |-- index.css             # Main styling, overrides and variables
```

---

## 🛡️ Routing and Guards

Routes are declared using `react-router-dom` in [App.tsx](file:///c:/Users/newti/Documents/Cypress%20-%20Tests/portfolio-rebalancer/client/src/App.tsx).

*   **Public Routes**:
    *   `/login` (AuthLayout)
    *   `/register` (AuthLayout)
*   **Protected Routes**:
    *   `/` (MainLayout) — Wrapped in the [ProtectedRoute](file:///c:/Users/newti/Documents/Cypress%20-%20Tests/portfolio-rebalancer/client/src/components/ProtectedRoute.tsx) guard which checks for the presence of a valid JSON Web Token (JWT) in local storage, redirecting unauthenticated users to `/login`.

---

## 📊 State Management & API Services

*   **Local/Component State**: Managed via native React hooks (`useState`, `useContext`, `useEffect`).
*   **Authentication & Tokens**: Token-based authentication storing the token in local storage.
*   **Axios Client**: Centralized in [services/api.ts](file:///c:/Users/newti/Documents/Cypress%20-%20Tests/portfolio-rebalancer/client/src/services/api.ts), configured with automatic request/response interceptors to set the `Authorization: Bearer <token>` header dynamically.
