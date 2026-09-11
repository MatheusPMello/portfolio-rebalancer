import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import userService from './userService';

vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('userService (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProfile should get /user/profile', async () => {
    const profile = { id: 1, email: 'user@example.com' };
    vi.mocked(api.get).mockResolvedValueOnce({ data: profile });

    const result = await userService.getProfile();
    expect(result).toEqual(profile);
    expect(api.get).toHaveBeenCalledWith('/user/profile');
  });

  it('updateEmail should put /user/email', async () => {
    const res = { message: 'Email updated successfully', email: 'new@example.com' };
    vi.mocked(api.put).mockResolvedValueOnce({ data: res });

    const result = await userService.updateEmail({ email: 'new@example.com', currentPassword: 'pwd' });
    expect(result).toEqual(res);
    expect(api.put).toHaveBeenCalledWith('/user/email', { email: 'new@example.com', currentPassword: 'pwd' });
  });

  it('updatePassword should put /user/password', async () => {
    const res = { message: 'Password updated successfully' };
    vi.mocked(api.put).mockResolvedValueOnce({ data: res });

    const result = await userService.updatePassword({ currentPassword: 'old', newPassword: 'newpassword' });
    expect(result).toEqual(res);
    expect(api.put).toHaveBeenCalledWith('/user/password', { currentPassword: 'old', newPassword: 'newpassword' });
  });

  it('deleteAccount should delete /user/account', async () => {
    const res = { message: 'Account deleted successfully' };
    vi.mocked(api.delete).mockResolvedValueOnce({ data: res });

    const result = await userService.deleteAccount({ password: 'pwd' });
    expect(result).toEqual(res);
    expect(api.delete).toHaveBeenCalledWith('/user/account', { data: { password: 'pwd' } });
  });
});
