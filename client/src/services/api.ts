// /client/src/services/api.ts
import axios from 'axios';

// 1. DYNAMIC URL SELECTION
// If Vercel provides a URL (VITE_API_URL), use it.
// Otherwise, fall back to localhost (for dev).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// 2. CREATE AXIOS INSTANCE
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. AUTOMATIC TOKEN ATTACHMENT
// This automatically adds the JWT token to every request if the user is logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;