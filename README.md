# Portfolio Rebalancer

A full-stack application with a React frontend and a Node.js backend to help investors track and rebalance their portfolios.

## ✨ Features

- **User Authentication:** Secure user registration and login.
- **Asset Management:** Full CRUD (Create, Read, Update, Delete) functionality for assets.
- **Portfolio Tracking:** Monitor asset allocation and performance.
- **Target Allocation:** Define and manage target percentages for each asset class.
- **Rebalancing Calculation:** Get recommendations on how to allocate new contributions to align with your target portfolio.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TypeScript, Bootstrap
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Containerization:** Docker

## 📂 Project Structure

```
/portfolio-rebalancer/
|-- /client/            <-- React Frontend
|   |-- /src/
|   |-- package.json
|   -- vite.config.ts
|-- /server/            <-- Node.js API
|   |-- /src/
|   |-- .env
|   -- package.json
|-- .gitignore
|-- docker-compose.yml
|-- package.json
|-- LICENSE
-- README.md
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/MatheusPMello/portfolio-rebalancer.git
cd portfolio-rebalancer
```

### 2. Run the Database with Docker

This project uses Docker to run a PostgreSQL database in a container. This simplifies setup and ensures a consistent environment.

1.  **Start the database container:**

    ```bash
    docker-compose up -d
    ```

    This command will start the PostgreSQL container in the background and create a volume to persist your data.

2.  **Environment Variables:**
    In the `/server` directory, you'll find a `.env.example` file. Make a copy of it and rename it to `.env`:

    ```bash
    cp .env.example .env
    ```

    Next, open the `.env` file and fill in the required values. The default database credentials are set in `docker-compose.yml`.

    ```ini
    # /server/.env

    DB_USER=docker_username
    DB_PASSWORD=docker_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=rebalancer

    # You also need to add a secure secret for signing JWTs
    JWT_SECRET=your_super_secret_key_here
    ```

### 3. Setup and Run the Backend

1.  **Navigate to the server directory and install dependencies:**

    ```bash
    cd server
    npm install
    ```

2.  **Set up the database tables:**

    ```bash
    npm run db:setup
    ```

3.  **Run the server:**

    ```bash
    npm start
    ```

### 4. Setup and Run the Frontend

1.  **In a new terminal**, navigate to the client directory and install dependencies:

    ```bash
    cd client
    npm install
    ```

2.  **Run the client:**

    ```bash
    npm run dev
    ```

    The React development server will start, and you can access the application in your browser.

## 📈 Scripts

The following scripts are available in their respective `client` and `server` directories to help maintain code quality:

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

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [contributing guide](CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
