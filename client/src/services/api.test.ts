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

  // Dry test helper to execute error interception and verify outcomes
  const verifyInterception = async ({
    status,
    url,
    responseData,
    shouldClearAndRedirect,
    expectedRedirectUrl,
  }: {
    status: number;
    url: string;
    responseData?: unknown;
    shouldClearAndRedirect: boolean;
    expectedRedirectUrl: string;
  }) => {
    const rejectedInterceptor = getRejectedInterceptor();
    const error = {
      response: { status, data: responseData },
      config: { url },
    };

    await expect(rejectedInterceptor(error)).rejects.toEqual(error);

    if (shouldClearAndRedirect) {
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(globalThis.location.href).toBe(expectedRedirectUrl);
    } else {
      expect(localStorage.removeItem).not.toHaveBeenCalled();
      expect(globalThis.location.href).toBe(expectedRedirectUrl);
    }
  };

  it('should clear token and redirect to /login for a 401 response on a non-auth page and request', async () => {
    await verifyInterception({
      status: 401,
      url: '/api/dashboard',
      shouldClearAndRedirect: true,
      expectedRedirectUrl: '/login',
    });
  });

  it('should clear token and redirect to /login for a 403 response on a non-auth page and request', async () => {
    await verifyInterception({
      status: 403,
      url: '/api/settings',
      shouldClearAndRedirect: true,
      expectedRedirectUrl: '/login',
    });
  });

  it('should NOT redirect or clear token for a 401 response on a login request (/auth/login)', async () => {
    await verifyInterception({
      status: 401,
      url: '/auth/login',
      shouldClearAndRedirect: false,
      expectedRedirectUrl: 'http://localhost:3000/dashboard',
    });
  });

  it('should NOT redirect or clear token for a 401 response on a register request (/auth/register)', async () => {
    await verifyInterception({
      status: 401,
      url: '/auth/register',
      shouldClearAndRedirect: false,
      expectedRedirectUrl: 'http://localhost:3000/dashboard',
    });
  });

  it('should NOT redirect or clear token for a 401 response when already on the /login page', async () => {
    vi.stubGlobal('location', {
      ...originalLocation,
      href: 'http://localhost:3000/login',
      pathname: '/login',
    });

    await verifyInterception({
      status: 401,
      url: '/api/some-endpoint',
      shouldClearAndRedirect: false,
      expectedRedirectUrl: 'http://localhost:3000/login',
    });
  });

  it('should NOT redirect or clear token for a 401 response when already on the /register page', async () => {
    vi.stubGlobal('location', {
      ...originalLocation,
      href: 'http://localhost:3000/register',
      pathname: '/register',
    });

    await verifyInterception({
      status: 401,
      url: '/api/some-endpoint',
      shouldClearAndRedirect: false,
      expectedRedirectUrl: 'http://localhost:3000/register',
    });
  });

  it('should NOT redirect or clear token for other error statuses (e.g., 500)', async () => {
    await verifyInterception({
      status: 500,
      url: '/api/dashboard',
      shouldClearAndRedirect: false,
      expectedRedirectUrl: 'http://localhost:3000/dashboard',
    });
  });

  it('should NOT redirect or clear token for a 400 Bad Request response (e.g., wrong password on delete account)', async () => {
    await verifyInterception({
      status: 400,
      url: '/user/account',
      responseData: { message: 'Invalid credentials' },
      shouldClearAndRedirect: false,
      expectedRedirectUrl: 'http://localhost:3000/dashboard',
    });
  });
});
