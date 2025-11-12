/**
 * @file authService.ts
 * @description This service handles all authentication-related API requests.
 * It provides functions for user login and registration, communicating with the backend server.
 */

import axios from 'axios';

/**
 * The base URL for the authentication endpoints of the backend API.
 */
const API_URL = 'http://localhost:5001/api/auth';

// --- Type Definitions ---

/**
 * Defines the shape of the credentials object required for login and registration.
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Defines the shape of the user object returned from the API.
 */
interface User {
  id: number;
  email: string;
}

/**
 * Defines the shape of the full response object from a successful login or registration.
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Sends a POST request to the /register endpoint to create a new user.
 * @param {AuthCredentials} credentials - The user's email and password.
 * @returns {Promise<AuthResponse>} A promise that resolves with the authentication response, including the token and user object.
 */
const register = async (
  credentials: AuthCredentials,
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/register`, credentials);
  return response.data;
};

/**
 * Sends a POST request to the /login endpoint to authenticate an existing user.
 * @param {AuthCredentials} credentials - The user's email and password.
 * @returns {Promise<AuthResponse>} A promise that resolves with the authentication response, including the token and user object.
 */
const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

/**
 * An object that bundles the authentication functions to be exported as a single service.
 */
const authService = {
  register,
  login,
};

export default authService;
