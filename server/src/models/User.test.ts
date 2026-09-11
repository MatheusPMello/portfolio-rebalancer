import { User } from './User.js';
import { db } from '../config/db.js';

jest.mock('../config/db.js', () => ({
  db: {
    query: jest.fn(),
  },
}));

describe('User Model Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert a user and return the safe user record', async () => {
      const mockSafeUser = { id: 1, email: 'test@example.com', created_at: new Date() };
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [mockSafeUser] });

      const result = await User.create('test@example.com', 'hashed');

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO users'), [
        'test@example.com',
        'hashed',
      ]);
      expect(result).toEqual(mockSafeUser);
    });

    it('should throw an error if db query fails', async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      await expect(User.create('test@example.com', 'hashed')).rejects.toThrow('DB Error');
    });
  });

  describe('updateEmail', () => {
    it('should update user email and return safe user record', async () => {
      const updated = { id: 1, email: 'new@example.com', created_at: new Date() };
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [updated] });

      const result = await User.updateEmail(1, 'new@example.com');

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE users'), [
        1,
        'new@example.com',
      ]);
      expect(result).toEqual(updated);
    });

    it('should throw an error if db query fails', async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      await expect(User.updateEmail(1, 'fail@example.com')).rejects.toThrow('DB Error');
    });
  });

  describe('updatePassword', () => {
    it('should update password and return safe user record', async () => {
      const updated = { id: 1, email: 'test@example.com', created_at: new Date() };
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [updated] });

      const result = await User.updatePassword(1, 'new_hash');

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE users'), [
        1,
        'new_hash',
      ]);
      expect(result).toEqual(updated);
    });

    it('should throw an error if db query fails', async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      await expect(User.updatePassword(1, 'fail')).rejects.toThrow('DB Error');
    });
  });

  describe('deleteAccount', () => {
    it('should delete assets and user account', async () => {
      const deleted = { id: 1, email: 'test@example.com', created_at: new Date() };
      (db.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] }) // assets delete
        .mockResolvedValueOnce({ rows: [deleted] }); // user delete

      const result = await User.deleteAccount(1);

      expect(db.query).toHaveBeenNthCalledWith(1, expect.stringContaining('DELETE FROM assets'), [1]);
      expect(db.query).toHaveBeenNthCalledWith(2, expect.stringContaining('DELETE FROM users'), [1]);
      expect(result).toEqual(deleted);
    });

    it('should throw an error if delete query fails', async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      await expect(User.deleteAccount(1)).rejects.toThrow('DB Error');
    });
  });

  describe('findByEmail', () => {
    it('should find and return user by email', async () => {
      const user = { id: 1, email: 'test@example.com', password_hash: 'hash' };
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [user] });

      const result = await User.findByEmail('test@example.com');

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM users'), [
        'test@example.com',
      ]);
      expect(result).toEqual(user);
    });

    it('should return null if user not found by email', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await User.findByEmail('missing@example.com');

      expect(result).toBeNull();
    });

    it('should throw an error if db query fails', async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      await expect(User.findByEmail('error@example.com')).rejects.toThrow('DB Error');
    });
  });

  describe('findById', () => {
    it('should find and return user by id', async () => {
      const user = { id: 1, email: 'test@example.com', password_hash: 'hash' };
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [user] });

      const result = await User.findById(1);

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM users'), [1]);
      expect(result).toEqual(user);
    });

    it('should return null if user not found by id', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await User.findById(999);

      expect(result).toBeNull();
    });

    it('should throw an error if db query fails', async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      await expect(User.findById(1)).rejects.toThrow('DB Error');
    });
  });
});
