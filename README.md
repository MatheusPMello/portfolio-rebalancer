# Portfolio Rebalancer

A full-stack web application (React, Node.js, PostgreSQL) to help investors track their asset allocation and rebalance their portfolio based on target percentages.

## ✨ Features

* User authentication (Login / Register)
* Full CRUD (Create, Read, Update, Delete) management for portfolio assets
* Define target allocation percentages for different asset classes
* Calculate the optimal allocation for new contributions to rebalance the portfolio
* (Future) Fetches real-time currency conversions (USD/BRL)
* (Future) Fetches real-time stock/ETF prices

## 🛠️ Tech Stack

* **Frontend:** React, Bootstrap
* **Backend:** Node.js, Express
* **Database:** PostgreSQL

## 📂 Project Structure

This project uses a **monorepo** structure, with the frontend and backend code in separate folders.

/portfolio-rebalancer/ | |-- /client/ <-- React application | |-- /src/ | -- package.json | |-- /server/ <-- Node.js/Express API | |-- /src/ | | |-- /config/ | | |-- /controllers/ | | |-- /middlewares/ | | |-- /models/ | | -- /routes/ | |-- .env | -- package.json | |-- .gitignore -- README.md


## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later)
* [PostgreSQL](https://www.postgresql.org/download/) (running on your local machine)
* [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone [https://github.com/](https://github.com/)[YOUR_USERNAME]/portfolio-rebalancer.git
cd portfolio-rebalancer
2. Backend Setup (Server)
Navigate to the server directory:

Bash

cd server
Install dependencies:

Bash

npm install
Create your environment file:

Create a file named .env in the /server directory.

Note: The .gitignore file is already set up to ignore this.

Ini, TOML

# /server/.env

# Server Port
PORT=5001

# Database Connection (Example)
# DB_USER=postgres
# DB_PASSWORD=mysecretpassword
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=rebalancer
Run the server:

Bash

npm start
The server will start on http://localhost:5001.

3. Frontend Setup (Client)
(Work in progress)

Navigate to the client directory:

Bash

cd client
Install dependencies:

Bash

npm install
Run the client:

Bash

npm start
The React app will start on http://localhost:3000.

📦 API Endpoints
A preliminary list of the API routes.

Test Route
GET /api/test

Description: Confirms the server is running.

Response: { "message": "Hello from the server! 👋" }

This README will be updated as the project progresses.