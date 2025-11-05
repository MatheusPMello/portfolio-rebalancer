# Portfolio Rebalancer

A backend API using Node.js, Express, and PostgreSQL to help investors track and rebalance their portfolios.

## ✨ Features

- **User Authentication:** Secure user registration and login.
- **Asset Management:** Full CRUD (Create, Read, Update, Delete) functionality for assets.
- **Portfolio Tracking:** Monitor asset allocation and performance.
- **Target Allocation:** Define and manage target percentages for each asset class.
- **Rebalancing Calculation:** Get recommendations on how to allocate new contributions to align with your target portfolio.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL

## 📂 Project Structure

```
/portfolio-rebalancer/
|-- /server/            <-- Node.js API
|   |-- /src/
|   |   |-- /config/
|   |   |-- /config/
|   |   |-- /controllers/
|   |   |   |-- authController.js
|   |   |   -- assetController.js
|   |   |-- /middlewares/
|   |   |   -- authMiddleware.js
|   |   |-- /models/
|   |   |-- /routes/
|   |   |   |-- authRoutes.js
|   |   |   -- assetRoutes.js
|   |-- .env
|   -- package.json
|-- .gitignore
|-- package.json
|-- LICENSE
-- README.md
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [PostgreSQL](https://www.postgresql.org/download/) (running locally)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/MatheusPMello/portfolio-rebalancer.git
cd portfolio-rebalancer
```

### 2. Setup

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

4.  **Set up the database:**
    Run the following command to create the necessary tables.

    ```bash
    npm run db:setup
    ```

5.  **Run the server:**
    ```bash
    npm start
    ```
    The server will start, and you will see a confirmation that the database is connected.

## 📈 Scripts

The following scripts are available in the root directory to help maintain code quality:

- `npm run lint`: Lints the codebase using ESLint.
- `npm run lint:fix`: Automatically fixes linting errors.
- `npm run format`: Formats the code using Prettier.

## 📦 API Endpoints

The following are the main endpoints available:

### Auth

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in a user.

### Assets

- `GET /api/assets`: Get all assets for the logged-in user.
- `POST /api/assets`: Add a new asset.
- `PUT /api/assets/:id`: Update an existing asset.
- `DELETE /api/assets/:id`: Delete an asset.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
