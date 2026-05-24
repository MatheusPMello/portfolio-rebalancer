import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import api from './api';

describe('api.ts Response Interceptor', () => {
  const originalLocation = globalThis.location;

  beforeEach(() => {
    vi.stubGlobal('location', {
      ...originalLocation,
      href: 'http://localhost:3000/dashboard',
      pathname: '/dashboard',
    });
    vi.spyOn(Storage.prototype, 'removeItem');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // Helper to extract the response error interceptor handler
  const getRejectedInterceptor = () => {
    // Axios interceptors are stored in an array of handlers
    const interceptor = api.interceptors.response as unknown as {
      handlers: Array<{
        rejected?: (error: unknown) => Promise<unknown>;
      }>;
    };
    const handler = interceptor.handlers.find((h) => h && typeof h.rejected === 'function');
    if (!handler || !handler.rejected) {
      throw new Error('Axios response error interceptor handler not found');
    }
    return handler.rejected;
  };

  it('should clear token and redirect to /login for a 401 response on a non-auth page and non-auth request', async () => {
    const rejectedInterceptor = getRejectedInterceptor();

    const error = {
      response: { status: 401 },
      config: { url: '/api/dashboard' },
    };

    await expect(rejectedInterceptor(error)).rejects.toEqual(error);

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(globalThis.location.href).toBe('/login');
  });

  it('should clear token and redirect to /login for a 403 response on a non-auth page and non-auth request', async () => {
    const rejectedInterceptor = getRejectedInterceptor();

    const error = {
      response: { status: 403 },
      config: { url: '/api/settings' },
    };

    await expect(rejectedInterceptor(error)).rejects.toEqual(error);

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(globalThis.location.href).toBe('/login');
  });

  it('should NOT redirect or clear token for a 401 response on a login request (/auth/login)', async () => {
    const rejectedInterceptor = getRejectedInterceptor();

    const error = {
      response: { status: 401 },
      config: { url: '/auth/login' },
    };

    await expect(rejectedInterceptor(error)).rejects.toEqual(error);

    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(globalThis.location.href).toBe('http://localhost:3000/dashboard');
  });

  it('should NOT redirect or clear token for a 401 response on a register request (/auth/register)', async () => {
    const rejectedInterceptor = getRejectedInterceptor();

    const error = {
      response: { status: 401 },
      config: { url: '/auth/register' },
    };

    await expect(rejectedInterceptor(error)).rejects.toEqual(error);

    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(globalThis.location.href).toBe('http://localhost:3000/dashboard');
  });

  it('should NOT redirect or clear token for a 401 response when already on the /login page', async () => {
    vi.stubGlobal('location', {
      ...originalLocation,
      href: 'http://localhost:3000/login',
      pathname: '/login',
    });

    const rejectedInterceptor = getRejectedInterceptor();

    const error = {
      response: { status: 401 },
      config: { url: '/api/some-endpoint' },
    };

    await expect(rejectedInterceptor(error)).rejects.toEqual(error);

    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(globalThis.location.href).toBe('http://localhost:3000/login');
  });

  it('should NOT redirect or clear token for a 401 response when already on the /register page', async () => {
    vi.stubGlobal('location', {
      ...originalLocation,
      href: 'http://localhost:3000/register',
      pathname: '/register',
    });

    const rejectedInterceptor = getRejectedInterceptor();

    const error = {
      response: { status: 401 },
      config: { url: '/api/some-endpoint' },
    };

    await expect(rejectedInterceptor(error)).rejects.toEqual(error);

    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(globalThis.location.href).toBe('http://localhost:3000/register');
  });

  it('should NOT redirect or clear token for other error statuses (e.g., 500)', async () => {
    const rejectedInterceptor = getRejectedInterceptor();

    const error = {
      response: { status: 500 },
      config: { url: '/api/dashboard' },
    };

    await expect(rejectedInterceptor(error)).rejects.toEqual(error);

    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(globalThis.location.href).toBe('http://localhost:3000/dashboard');
  });

  it("should NOT redirect or clear token for a 401 response with 'Invalid credentials' message (e.g., wrong password on delete account)", async () => {
    const rejectedInterceptor = getRejectedInterceptor();

    const error = {
      response: {
        status: 401,
        data: { message: 'Invalid credentials' },
      },
      config: { url: '/user/account' },
    };

    await expect(rejectedInterceptor(error)).rejects.toEqual(error);

    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(globalThis.location.href).toBe('http://localhost:3000/dashboard');
  });
});
