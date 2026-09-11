import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import authService from './authService';

vi.mock('./api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('authService (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('register should post credentials, set token in localStorage and return data', async () => {
    const mockResponse = {
      token: 'jwt-token-123',
      user: { id: 1, name: 'User', email: 'user@example.com' },
    };
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

    const result = await authService.register({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(result).toEqual(mockResponse);
    expect(localStorage.getItem('token')).toBe('jwt-token-123');
    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      email: 'user@example.com',
      password: 'password123',
    });
  });

  it('login should post credentials, set token in localStorage and return data', async () => {
    const mockResponse = {
      token: 'jwt-token-456',
      user: { id: 2, name: 'User 2', email: 'user2@example.com' },
    };
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

    const result = await authService.login({
      email: 'user2@example.com',
      password: 'password123',
    });

    expect(result).toEqual(mockResponse);
    expect(localStorage.getItem('token')).toBe('jwt-token-456');
  });

  it('logout should remove token from localStorage', () => {
    localStorage.setItem('token', 'some-token');
    authService.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
