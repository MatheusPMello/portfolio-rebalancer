// /server/src/config/db.js

// We need dotenv to read the .env variables
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// We'll export a simple 'query' function that our controllers can use.
// This is a clean pattern that hides the connection logic from our business logic.
module.exports = {
  query: (text, params) => pool.query(text, params),
};