# ⚙️ Portfolio Rebalancer - Backend Server

This is the backend API for **Portfolio Rebalancer**, built with Node.js, Express, TypeScript, and PostgreSQL. It handles secure user authentication, asset management, live currency rate fetching, and portfolio rebalancing calculation logic.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js v18+ and a running PostgreSQL database (or Docker Desktop) installed.

### Setup and Running
To run the server in isolation:

1.  **Configure environment variables**:
    ```bash
    cd server
    cp .env.example .env
    ```
    *(The default `.env` is configured to connect to the local Docker database instance).*

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Initialize Database Schema**:
    Make sure PostgreSQL is running, then run:
    ```bash
    npm run db:setup
    ```
    *(This runs the `src/config/setupDatabase.ts` script to drop/create tables).*

4.  **Start development server**:
    ```bash
    npm run start
    ```
    The server will run on [http://localhost:5001](http://localhost:5001).

---

## 📂 Project Architecture

```text
/server/
|-- /src/
|   |-- /config/              # Database connection pools & setup scripts
|   |   |-- db.ts             # pg pool configuration
|   |   |-- setupDatabase.ts  # Database initializer/reset schema script
|   |-- /controllers/         # Request controllers parsing inputs and responding
|   |   |-- assetController.ts# Handles CRUD requests for assets
|   |   |-- authController.ts # Handles login and signup flows
|   |   |-- rebalanceController.ts # Formulates input for rebalancing calculations
|   |   |-- userController.ts # Handles user account updates/deletion
|   |-- /middlewares/         # Express middleware interceptors
|   |   |-- authMiddleware.ts # Verifies JWT tokens on protected routes
|   |-- /models/              # SQL Query models communicating with PostgreSQL
|   |   |-- Asset.ts          # CRUD query definitions for Assets
|   |   |-- User.ts           # CRUD query definitions for Users
|   |-- /routes/              # Express Router mount points mapping paths to controllers
|   |-- /services/            # Core business logic engines
|   |   |-- exchangeRateService.ts # AwesomeAPI USD/BRL live exchange rate integration
|   |   |-- rebalanceService.ts # Rebalancing mathematical core (buy-only allocation engine)
|   |-- /types/               # Global TypeScript interface/type overrides
|   |-- server.ts             # App bootstrap entry point configuring CORS, body parsing & routes
```

---

## 🔑 Authentication Flow

1.  **Sign Up / Log In**: User requests JWT token via `POST /api/auth/register` or `POST /api/auth/login`.
2.  **Token Verification**: For protected routes (like `/api/assets` or `/api/rebalance`), requests are processed through [authMiddleware.ts](file:///c:/Users/newti/Documents/Cypress%20-%20Tests/portfolio-rebalancer/server/src/middlewares/authMiddleware.ts).
3.  **Bearer Schema**: The middleware extracts the authorization header token (`Authorization: Bearer <jwt>`), verifies it using the `JWT_SECRET`, and attaches the decoded payload containing the `userId` to the request object (`req.userId`).

---

## 📊 Rebalancing Logic

The rebalancing engine calculates the optimal buy-only allocation:
*   Located in [rebalanceService.ts](file:///c:/Users/newti/Documents/Cypress%20-%20Tests/portfolio-rebalancer/server/src/services/rebalanceService.ts).
*   Normalizes all asset values to a main target currency using exchange rates fetched via AwesomeAPI.
*   Calculates the gap between current asset allocation percentage and the target weight.
*   Uses a **greedy allocation algorithm** to distribute new funds step-by-step to the asset furthest below its target allocation, ensuring no sales are required to rebalance the portfolio.
