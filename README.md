# Portfolio Rebalancer

A full-stack web application using React, Node.js, and PostgreSQL to help investors track and rebalance their portfolios.

## ✨ Features

*   **User Authentication:** Secure login and registration.
*   **Portfolio Management:** Full CRUD (Create, Read, Update, Delete) for assets.
*   **Target Allocation:** Define and manage target percentages for asset classes.
*   **Rebalancing Calculation:** Optimize new contributions to align with targets.
*   **(Future) Real-time Data:** Currency conversion and stock/ETF price fetching.

## 🛠️ Tech Stack

*   **Frontend:** React, Bootstrap
*   **Backend:** Node.js, Express
*   **Database:** PostgreSQL

## 📂 Project Structure

This project follows a monorepo structure, separating the client and server into their own directories.

```
/portfolio-rebalancer/
|-- /client/            <-- React Application
|   |-- /src/
|   -- package.json
|-- /server/            <-- Node.js API
|   |-- /src/
|   |   |-- /config/
|   |   |-- /controllers/
|   |   |-- /middlewares/
|   |   |-- /models/
|   |   -- /routes/
|   |-- .env
|   -- package.json
|-- .gitignore
|-- LICENSE
-- README.md
```

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [PostgreSQL](https://www.postgresql.org/download/) (running locally)
*   [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/portfolio-rebalancer.git
cd portfolio-rebalancer
```

### 2. Backend Setup (Server)

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create the environment file:**
    Create a `.env` file in the `/server` directory and add your database credentials. The server defaults to port `5000` if not specified.

    ```ini
    # /server/.env

    # Server Port (Optional, defaults to 5000)
    PORT=5001

    # Database Connection
    DB_USER=postgres
    DB_PASSWORD=mysecretpassword
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=rebalancer
    ```

4.  **Run the server:**
    ```bash
    npm start
    ```
    The server will start, and you will see a confirmation that the database is connected.

### 3. Frontend Setup (Client)

1.  **Navigate to the client directory:**
    ```bash
    cd ../client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the client:**
    ```bash
    npm start
    ```
    The React development server will start on `http://localhost:3000`.

## 📦 API Endpoints

Currently, there is one endpoint for testing the server connection:

*   **`GET /api/test`**
    *   **Description:** Confirms that the server is running correctly.
    *   **Response:** `{"message": "Hello from the server! 👋"}`

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.