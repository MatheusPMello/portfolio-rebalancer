// /client/src/services/authService.ts
import axios from 'axios';

// This is the base URL of your backend server
const API_URL = 'http://localhost:5001/api/auth';

// --- Define Types for our data ---
// This is the data we send to the API
export interface AuthCredentials {
  email: string;
  password: string;
}

// This is the user object we get back
interface User {
  id: number;
  email: string;
}

// This is the full response we get back from login/register
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Registers a new user.
 * @param credentials - An object containing email and password
 */
const register = async (
  credentials: AuthCredentials,
): Promise<AuthResponse> => {
  // axios.post automatically converts our object to JSON
  const response = await axios.post(`${API_URL}/register`, credentials);

  // The data we want is in response.data
  return response.data;
};

/**
 * Logs in an existing user.
 * @param credentials - An object containing email and password
 */
const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

// Bundle our functions into an 'authService' object
const authService = {
  register,
  login,
};

export default authService;
