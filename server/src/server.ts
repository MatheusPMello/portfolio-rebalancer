// Load environment variables from .env file
import 'dotenv/config';

import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { db } from './config/db.js';

// --- Import Routes ---
import authRoutes from './routes/authRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import rebalanceRoutes from './routes/rebalanceRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
app.disable('x-powered-by');

// --- Middlewares ---
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
  }),
);
app.use(express.json());

// --- Basic Test Route ---
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the server! 👋' });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/rebalance', rebalanceRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/user', userRoutes);

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
export default app;
