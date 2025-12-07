# 💰 Portfolio Rebalancer

[![CI Pipeline (Build & Test)](https://github.com/MatheusPMello/portfolio-rebalancer/actions/workflows/ci.yml/badge.svg)](https://github.com/MatheusPMello/portfolio-rebalancer/actions/workflows/ci.yml)

A full-stack FinTech application designed to help investors manage multi-currency portfolios (BRL/USD) and calculate optimal asset allocation based on target percentages.

https://portfolio-rebalancer-eta.vercel.app/

## ✨ Features

- **🔐 Secure Authentication:** JWT-based user registration and login with protected routes.
- **🌍 Multi-Currency Support:** Seamlessly manage assets in BRL (Reais) and USD (Dollars) in a single dashboard.
- **🤖 Smart Rebalancing Engine:**
  - Calculates the optimal distribution for new contributions.
  - Uses "Buy-Only" logic to avoid tax-inefficient selling.
  - Automatically converts currencies to normalize math.
- **📡 Real-Time Data:** Integrates with AwesomeAPI to fetch live USD/BRL exchange rates for accurate valuations.
- **📊 Visual Analytics:** Interactive Clustered Bar Charts (via Chart.js) to visualize Current vs. Target allocation.
- **⚡ Modern UI/UX:** Clean, responsive interface built with Bootstrap and custom CSS themes.

---

## 🛠️ Tech Stack

### Frontend (Client)

- **Framework:** React 18 (via Vite)
- **Language:** TypeScript
- **Styling:** Bootstrap 5 + Custom CSS System
- **Data Visualization:** Chart.js + React-Chartjs-2
- **HTTP Client:** Axios

### Backend (Server)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Architecture:** MVC + Services Pattern (Separation of concerns)
- **Security:** BCrypt (Password Hashing) + JWT (Session Tokens)

### DevOps

- **Containerization:** Docker & Docker Compose

### Tooling & Code Quality

- **Linting:** ESLint
- **Code Formatting:** Prettier

---

## 📂 Project Architecture

This project follows a Monorepo structure:

```bash
/portfolio-rebalancer/
|-- /client/                  # React Application
|   |-- /src/
|   |   |-- /components/      # Reusable UI (AuthLayout, MainLayout, Charts)
|   |   |-- /pages/           # View Logic (Dashboard, Login)
|   |   |-- /services/        # API integration (assetService, authService)
|   |-- vite.config.ts
|
|-- /server/                  # Node.js API
|   |-- /src/
|   |   |-- /config/          # DB Connection
|   |   |-- /controllers/     # Request Logic
|   |   |-- /middlewares/     # Auth Guards (The "Bouncer")
|   |   |-- /models/          # Database Queries (SQL)
|   |   |-- /routes/          # Endpoint Definitions
|   |   |-- /services/        # External APIs (Exchange Rate logic)
|   |-- .env                  # Environment Variables
|
|-- docker-compose.yml        # Database Container Config
```

---

## 🤖 DevOps & CI/CD

This project utilizes **GitHub Actions** to ensure code quality and prevent broken deployments. The pipeline runs automatically on every Pull Request and Push to main.

**Pipeline Steps:**

1.  **Environment Setup:** Installs Node.js v20 (matching production).
2.  **Dependency Caching:** Uses `npm ci` with caching to speed up builds.
3.  **Backend Verification:** Runs Unit Tests (Jest) to verify mathematical correctness of the rebalancing engine.
4.  **Frontend Verification:** Runs TypeScript Build process to catch type errors and broken imports.

[View the Pipeline Configuration (.yml)](./.github/workflows/ci.yml)

## 🚀 Getting Started (The Fast Way)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Must be running)

### 1. Setup

Clone the repo and run the automated setup script. This will install dependencies for both client/server, start the Docker database, and create the tables.

```bash
git clone [https://github.com/MatheusPMello/portfolio-rebalancer.git](https://github.com/MatheusPMello/portfolio-rebalancer.git)
cd portfolio-rebalancer

# Run the master setup
npm run setup
```

> **Note:** If the setup fails on the database step, ensure Docker Desktop is running and run `npm run db:init` manually.

### 2. Environment Variables

Create a `.env` file in the `/server` folder using the example provided.

```bash
cp server/.env.example server/.env
```

### 3. Run

Start the full stack (Frontend + Backend) with one command:

```bash
npm run dev
```

Open http://localhost:5173 to view the app.

## 📦 API Reference

### 🔐 Auth

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate & receive JWT

### 💰 Assets

- `GET /api/assets` - List all user assets
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset details
- `DELETE /api/assets/:id` - Remove asset

### ⚖️ Rebalancing

- `POST /api/rebalance`
  - **Payload:** `{ "amount": 1000, "mainCurrency": "BRL" }`
  - **Response:** Returns a smart list of assets to buy, with amounts converted to the asset's native currency.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
