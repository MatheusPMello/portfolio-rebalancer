import { describe, it, expect } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { getErrorMessage } from './errorHandler';

describe('getErrorMessage utility', () => {
  it('should return the server error message if present in an AxiosError', () => {
    const error = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 400,
        statusText: 'Bad Request',
        data: { message: 'Custom server error explanation' },
        headers: {},
        config: { headers: new AxiosHeaders() },
      },
    );

    const result = getErrorMessage(error, 'Default fallback');
    expect(result).toBe('Custom server error explanation');
  });

  it('should return fallback if AxiosError does not contain data.message', () => {
    const error = new AxiosError('Network Error');
    const result = getErrorMessage(error, 'Default fallback');
    expect(result).toBe('Default fallback');
  });

  it('should return fallback if error is a generic Error', () => {
    const error = new Error('Random unexpected error');
    const result = getErrorMessage(error, 'Default fallback');
    expect(result).toBe('Default fallback');
  });

  it('should return fallback for non-error primitives', () => {
    expect(getErrorMessage('some string', 'Fallback')).toBe('Fallback');
    expect(getErrorMessage(null, 'Fallback')).toBe('Fallback');
    expect(getErrorMessage(undefined, 'Fallback')).toBe('Fallback');
  });
});
