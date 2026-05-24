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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';
    const currentPath = globalThis.location.pathname || '';

    // If the error is 401 (Unauthorized) or 403 (Forbidden)
    if (status === 401 || status === 403) {
      const isAuthRequest =
        requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
      const isAuthPage = currentPath === '/login' || currentPath === '/register';

      // Only clear token and redirect if we're not on auth pages or initiating auth requests.
      // Form credentials/validation errors are handled via 400 Bad Request and bypass this block.
      if (!isAuthRequest && !isAuthPage) {
        localStorage.removeItem('token');
        globalThis.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
