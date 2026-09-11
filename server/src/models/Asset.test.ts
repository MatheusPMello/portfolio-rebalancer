import { Asset } from './Asset.js';
import { db } from '../config/db.js';

jest.mock('../config/db.js', () => ({
  db: {
    query: jest.fn(),
  },
}));

describe('Asset Model Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert a new asset and return the record', async () => {
      const mockAsset = {
        id: 1,
        user_id: 10,
        name: 'VT',
        target_percentage: 50,
        current_value: 1000,
        currency: 'USD',
      };
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [mockAsset] });

      const result = await Asset.create(10, 'VT', 50, 1000, 'USD');

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO assets'), [
        10,
        'VT',
        50,
        1000,
        'USD',
      ]);
      expect(result).toEqual(mockAsset);
    });

    it('should throw an error if database query fails', async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      await expect(Asset.create(10, 'VT', 50, 1000, 'USD')).rejects.toThrow('DB Error');
    });
  });

  describe('findByUserId', () => {
    it('should return assets for a given user id', async () => {
      const mockAssets = [{ id: 1, user_id: 10, name: 'VT' }];
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: mockAssets });

      const result = await Asset.findByUserId(10);

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM assets'), [10]);
      expect(result).toEqual(mockAssets);
    });

    it('should throw an error if database query fails', async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      await expect(Asset.findByUserId(10)).rejects.toThrow('DB Error');
    });
  });

  describe('updateById', () => {
    it('should update an existing asset and return the updated record', async () => {
      const updated = {
        id: 1,
        user_id: 10,
        name: 'VT Updated',
        target_percentage: 60,
        current_value: 1500,
        currency: 'USD',
      };
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [updated] });

      const result = await Asset.updateById(1, 10, {
        name: 'VT Updated',
        target_percentage: 60,
        current_value: 1500,
        currency: 'USD',
      });

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE assets'), [
        'VT Updated',
        60,
        1500,
        'USD',
        1,
        10,
      ]);
      expect(result).toEqual(updated);
    });

    it('should return null if asset to update is not found', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await Asset.updateById(999, 10, { name: 'None' });

      expect(result).toBeNull();
    });

    it('should throw an error if database query fails', async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      await expect(Asset.updateById(1, 10, { name: 'Fail' })).rejects.toThrow('DB Error');
    });
  });

  describe('deleteById', () => {
    it('should delete asset and return deleted record', async () => {
      const deleted = { id: 1, user_id: 10 };
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [deleted] });

      const result = await Asset.deleteById(1, 10);

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM assets'), [1, 10]);
      expect(result).toEqual(deleted);
    });

    it('should return null if asset to delete is not found', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await Asset.deleteById(999, 10);

      expect(result).toBeNull();
    });

    it('should throw an error if database query fails', async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      await expect(Asset.deleteById(1, 10)).rejects.toThrow('DB Error');
    });
  });
});
