// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db');

// --- Import Routes ---
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const rebalanceRoutes = require('./routes/rebalanceRoutes');
const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Basic Test Route ---
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the server! 👋' });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/rebalance', rebalanceRoutes);

// --- Server Startup ---
const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  try {
    console.log('--- DEBUGGING ENV VARS ---');
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('----------------------------');
    const res = await db.query('SELECT NOW()');
    console.log(`Database connected successfully at ${res.rows[0].now}`);
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('Database connection failed:', err);
  }
});
