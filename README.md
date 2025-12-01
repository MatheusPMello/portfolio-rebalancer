# 💰 Portfolio Rebalancer

A full-stack FinTech application designed to help investors manage multi-currency portfolios (BRL/USD) and calculate optimal asset allocation based on target percentages.

## ✨ Features

* **🔐 Secure Authentication:** JWT-based user registration and login with protected routes.
* **🌍 Multi-Currency Support:** Seamlessly manage assets in BRL (Reais) and USD (Dollars) in a single dashboard.
* **🤖 Smart Rebalancing Engine:**
  * Calculates the optimal distribution for new contributions.
  * Uses "Buy-Only" logic to avoid tax-inefficient selling.
  * Automatically converts currencies to normalize math.
* **📡 Real-Time Data:** Integrates with AwesomeAPI to fetch live USD/BRL exchange rates for accurate valuations.
* **📊 Visual Analytics:** Interactive Clustered Bar Charts (via Chart.js) to visualize Current vs. Target allocation.
* **⚡ Modern UI/UX:** Clean, responsive interface built with Bootstrap and custom CSS themes.

---

## 🛠️ Tech Stack

### Frontend (Client)
* **Framework:** React 18 (via Vite)
* **Language:** TypeScript
* **Styling:** Bootstrap 5 + Custom CSS System
* **Data Visualization:** Chart.js + React-Chartjs-2
* **HTTP Client:** Axios

### Backend (Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL
* **Architecture:** MVC + Services Pattern (Separation of concerns)
* **Security:** BCrypt (Password Hashing) + JWT (Session Tokens)

### DevOps
* **Containerization:** Docker & Docker Compose

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
|   |-- .env
|
|-- docker-compose.yml        # Database Container Config
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Docker Desktop
* Git

### 1. Clone the Repository

```bash
git clone [https://github.com/MatheusPMello/portfolio-rebalancer.git](https://github.com/MatheusPMello/portfolio-rebalancer.git)
cd portfolio-rebalancer
```

### 2. Run the Database (Docker)

Start the PostgreSQL container. This creates a persistent volume for your data.

```bash
docker-compose up -d
```

### 3. Backend Setup

Navigate to the server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `/server` root and copy the content below:

```ini
# /server/.env
PORT=5001

# Database (Must match docker-compose.yml)
DB_USER=rebalancer_user
DB_PASSWORD=rebalancer_pass
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rebalancer

# Security
JWT_SECRET=your_super_secret_key_change_this
```

Initialize the Database Tables:

```bash
npm run db:setup
```

Start the Server:

```bash
npm start
```
*The server should now be running on `http://localhost:5001`*

### 4. Frontend Setup

Open a new terminal and navigate to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the React App:

```bash
npm run dev
```
*Access the app at `http://localhost:5173`*

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
