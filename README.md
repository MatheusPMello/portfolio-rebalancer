# 💰 Portfolio Rebalancer

[![CI Pipeline (Build & Test)](https://github.com/MatheusPMello/portfolio-rebalancer/actions/workflows/ci.yml/badge.svg)](https://github.com/MatheusPMello/portfolio-rebalancer/actions/workflows/ci.yml)

**[🚀 View Live Demo](https://portfolio-rebalancer-eta.vercel.app/)**

---

Managing a multi-currency investment portfolio is surprisingly painful — spreadsheets break, the math gets messy across
currencies, and selling assets triggers unnecessary taxes. Portfolio Rebalancer automates the allocation math using a *
*buy-only strategy**, so you can put new capital to work intelligently without ever needing to sell.

---

> ![App Preview](.github/assets/preview.gif)
---

## ✨ Features

* **🔐 Secure Authentication:** JWT-based registration and login with protected routes.
* **🌍 Multi-Currency Support:** Manage BRL and USD assets side-by-side in a single dashboard.
* **🤖 Smart Rebalancing Engine:** Calculates optimal allocation for new contributions using buy-only logic, with
  automatic currency normalization.
* **📡 Real-Time Exchange Rates:** Integrates with AwesomeAPI to fetch live USD/BRL rates for accurate valuations.
* **📊 Visual Analytics:** Interactive Clustered Bar Charts (Chart.js) comparing Current vs. Target allocation.

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

### Backend
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

### Infrastructure & DevOps

![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-%2346E3B7.svg?style=for-the-badge&logo=render&logoColor=white) ![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=black) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

---

## 📂 Architecture

Monorepo structure separating client and server environments.

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
|   |   |-- /middlewares/     # Auth Guards
|   |   |-- /models/          # Database Queries (SQL)
|   |   |-- /services/        # External APIs (Exchange Rate logic)
|
|-- docker-compose.yml        # Database Container Config
```

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) v18+
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be running)

### 1. Clone & Configure

```bash
git clone https://github.com/MatheusPMello/portfolio-rebalancer.git
cd portfolio-rebalancer
cp server/.env.example server/.env
```

The `.env.example` is pre-configured to work with the local Docker database — no changes needed for local development.

### 2. Setup

```bash
npm run setup
```

This installs dependencies, starts the Docker database, and creates the required tables.

> **Note:** If the database step fails, make sure Docker Desktop is running, then run `npm run db:init` manually.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 API Reference

### Auth

| Method | Endpoint             | Description                |
|--------|----------------------|----------------------------|
| `POST` | `/api/auth/register` | Create account             |
| `POST` | `/api/auth/login`    | Authenticate & receive JWT |

### Assets

| Method   | Endpoint          | Description          |
|----------|-------------------|----------------------|
| `GET`    | `/api/assets`     | List all user assets |
| `POST`   | `/api/assets`     | Create new asset     |
| `PUT`    | `/api/assets/:id` | Update asset details |
| `DELETE` | `/api/assets/:id` | Remove asset         |

### Rebalancing

| Method | Endpoint         | Description                  |
|--------|------------------|------------------------------|
| `POST` | `/api/rebalance` | Calculate optimal allocation |

**Rebalance payload:**

```json
{
  "amount": 1000,
  "mainCurrency": "BRL"
}
```

Returns a list of assets to buy with amounts converted to each asset's native currency.

---

## 🤖 CI/CD

A GitHub Actions pipeline runs on every push and pull request to `main`. It verifies backend unit tests (Jest) and the
frontend TypeScript build, ensuring no broken code reaches production.