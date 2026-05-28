import { db } from '../config/db.js';

export interface UserRecord {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
}

export type SafeUser = Omit<UserRecord, 'password_hash'>;

export const User = {
  /**
   * Creates a new user in the database.
   */
  create: async (email: string, passwordHash: string): Promise<SafeUser> => {
    const query = `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, created_at;
    `;
    const values = [email, passwordHash];

    try {
      const res = await db.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  },

  /**
   * Updates a user's email.
   */
  updateEmail: async (id: number, email: string): Promise<SafeUser> => {
    const query = `
      UPDATE users
      SET email = $2
      WHERE id = $1
      RETURNING id, email, created_at;
    `;
    const values = [id, email];

    try {
      const res = await db.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error('Error updating email:', err);
      throw err;
    }
  },

  /**
   * Updates a user's password.
   */
  updatePassword: async (id: number, passwordHash: string): Promise<SafeUser> => {
    const query = `
      UPDATE users
      SET password_hash = $2
      WHERE id = $1
      RETURNING id, email, created_at;
    `;
    const values = [id, passwordHash];

    try {
      const res = await db.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error('Error updating password:', err);
      throw err;
    }
  },

  /**
   * Deletes a user and all their associated data.
   */
  deleteAccount: async (id: number): Promise<SafeUser> => {
    const deleteAssetsQuery = 'DELETE FROM assets WHERE user_id = $1;';
    const deleteUserQuery = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id, email, created_at;
    `;
    const values = [id];

    try {
      // Delete assets first to satisfy constraint checks
      await db.query(deleteAssetsQuery, values);
      const res = await db.query(deleteUserQuery, values);
      return res.rows[0];
    } catch (err) {
      console.error('Error deleting account:', err);
      throw err;
    }
  },

  /**
   * Finds a user by their email.
   */
  findByEmail: async (email: string): Promise<UserRecord | null> => {
    const query = 'SELECT * FROM users WHERE email = $1;';
    const values = [email];

    try {
      const res = await db.query(query, values);
      return res.rows[0] || null;
    } catch (err) {
      console.error('Error finding user by email:', err);
      throw err;
    }
  },

  /**
   * Finds a user by their ID.
   */
  findById: async (id: number): Promise<UserRecord | null> => {
    const query = 'SELECT * FROM users WHERE id = $1;';
    const values = [id];

    try {
      const res = await db.query(query, values);
      return res.rows[0] || null;
    } catch (err) {
      console.error('Error finding user by id:', err);
      throw err;
    }
  },
};
