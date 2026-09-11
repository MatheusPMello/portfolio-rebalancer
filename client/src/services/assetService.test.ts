import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import assetService, { type NewAsset } from './assetService';

vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('assetService (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAll should fetch /assets and return data', async () => {
    const mockData = [{ id: 1, name: 'AAPL', current_value: 500, currency: 'USD', target_percentage: 50, user_id: 1 }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

    const result = await assetService.getAll();
    expect(result).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith('/assets');
  });

  it('create should post to /assets and return created asset', async () => {
    const newAsset: NewAsset = { name: 'PETR4', current_value: 1000, currency: 'BRL', target_percentage: 50 };
    const mockCreated = { id: 2, user_id: 1, ...newAsset };
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockCreated });

    const result = await assetService.create(newAsset);
    expect(result).toEqual(mockCreated);
    expect(api.post).toHaveBeenCalledWith('/assets', newAsset);
  });

  it('update should put to /assets/:id and return updated asset', async () => {
    const updateData: NewAsset = { name: 'PETR4', current_value: 1200, currency: 'BRL', target_percentage: 50 };
    const mockUpdated = { id: 2, user_id: 1, ...updateData };
    vi.mocked(api.put).mockResolvedValueOnce({ data: mockUpdated });

    const result = await assetService.update(2, updateData);
    expect(result).toEqual(mockUpdated);
    expect(api.put).toHaveBeenCalledWith('/assets/2', updateData);
  });

  it('remove should delete /assets/:id', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({});

    await assetService.remove(2);
    expect(api.delete).toHaveBeenCalledWith('/assets/2');
  });
});
