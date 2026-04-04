# 💰 Portfolio Rebalancer

[![CI Pipeline (Build & Test)](https://github.com/MatheusPMello/portfolio-rebalancer/actions/workflows/ci.yml/badge.svg)](https://github.com/MatheusPMello/portfolio-rebalancer/actions/workflows/ci.yml)

> A full-stack FinTech application designed to help investors manage multi-currency portfolios (BRL/USD) and calculate
> optimal asset allocation based on target percentages.

**[🚀 View Live Demo](https://portfolio-rebalancer-eta.vercel.app/)**
---

## ✨ Features

* **🔐 Secure Authentication:** JWT-based user registration and login with protected routes.
* **🌍 Multi-Currency Support:** Seamlessly manage assets in BRL (Reais) and USD (Dollars) in a single dashboard.
* **🤖 Smart Rebalancing Engine:**
  * Calculates the optimal distribution for new contributions.
  * Uses "Buy-Only" logic to avoid tax-inefficient selling.
  * Automatically converts currencies to normalize math.
* **📡 Real-Time Data:** Integrates with AwesomeAPI to fetch live USD/BRL exchange rates for accurate valuations.
* **📊 Visual Analytics:** Interactive Clustered Bar Charts (via Chart.js) to visualize Current vs. Target allocation.

---

## 🛠️ Tech Stack & Infrastructure

### Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

### Backend

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

### Infrastructure & Hosting

![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-%2346E3B7.svg?style=for-the-badge&logo=render&logoColor=white) ![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=black)

### DevOps & Tooling

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

---

## 📂 Project Architecture

This project follows a Monorepo structure separating the client and server environments.

```text
/portfolio-rebalancer/
|-- /client/                  # React Application (Frontend)
|   |-- /src/
|   |   |-- /components/      # Reusable UI (AuthLayout, MainLayout, Charts)
|   |   |-- /pages/           # View Logic (Dashboard, Login)
|   |   |-- /services/        # API integration (assetService, authService)
|
|-- /server/                  # Node.js API (Backend)
|   |-- /src/
|   |   |-- /controllers/     # Request Logic
|   |   |-- /middlewares/     # Auth Guards (The "Bouncer")
|   |   |-- /models/          # Database Queries (SQL)
|   |   |-- /services/        # External APIs (Exchange Rate logic)
|
|-- docker-compose.yml        # Database Container Config
```

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18+)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Must be running)

### 1. Clone & Configure Environment

First, clone the repository and navigate into the project directory:

```bash
git clone https://github.com/MatheusPMello/portfolio-rebalancer.git
cd portfolio-rebalancer
```

Next, create your `.env` file in the `/server` directory. The provided example file is pre-configured with standard
values that work instantly with the local Docker database.

```bash
cp server/.env.example server/.env
```

*(You can leave the default values as they are for local development).*

### 2. Setup Environment

Now, run the automated setup script. This installs dependencies, starts the Docker database, and creates the required
tables using the `.env` file you just created.

```bash
# Run the master setup
npm run setup
```
> **Note:** If the setup fails on the database step, ensure Docker Desktop is running and run `npm run db:init` manually.

### 3. Run the Application

Start the full stack (Frontend + Backend) with a single command:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

---

## 🤖 DevOps & CI/CD

This project utilizes **GitHub Actions** to ensure code quality and prevent broken deployments. The pipeline runs
automatically on every Pull Request and Push to main.

**Pipeline Steps:**

1. **Environment Setup:** Installs Node.js v20 (matching production).
2. **Dependency Caching:** Uses `npm ci` with caching to speed up builds.
3. **Backend Verification:** Runs Unit Tests (Jest) to verify mathematical correctness of the rebalancing engine.
4. **Frontend Verification:** Runs TypeScript Build process to catch type errors and broken imports.

---

## 📦 API Reference

### 🔐 Auth

* `POST /api/auth/register` - Create account
* `POST /api/auth/login` - Authenticate & receive JWT

### 💰 Assets

* `GET /api/assets` - List all user assets
* `POST /api/assets` - Create new asset
* `PUT /api/assets/:id` - Update asset details
* `DELETE /api/assets/:id` - Remove asset

### ⚖️ Rebalancing

* `POST /api/rebalance`
  * **Payload:** `{ "amount": 1000, "mainCurrency": "BRL" }`
  * **Response:** Returns a smart list of assets to buy, with amounts converted to the asset's native currency.

---

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.