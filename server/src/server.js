// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Initialize the Express app
const app = express();

// --- Middlewares ---
// Enable CORS for all routes
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// --- Basic Test Route ---
// A simple route to check if the server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the server! 👋' });
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});