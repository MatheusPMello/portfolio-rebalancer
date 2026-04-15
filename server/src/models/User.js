// /server/src/models/User.js

const db = require('../config/db');

const User = {
  /**
   * Creates a new user in the database.
   * @param {string} email - The user's email.
   * @param {string} passwordHash - The user's hashed password.
   * @returns {Promise<object>} The new user object.
   */
  create: async (email, passwordHash) => {
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
   * @param {number} id - The user's ID.
   * @param {string} email - The new email.
   * @returns {Promise<object>} The updated user object.
   */
  updateEmail: async (id, email) => {
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
   * @param {number} id - The user's ID.
   * @param {string} passwordHash - The new password hash.
   * @returns {Promise<object>} The updated user object.
   */
  updatePassword: async (id, passwordHash) => {
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
   * @param {number} id - The user's ID.
   * @returns {Promise<object>} The deleted user object.
   */
  deleteAccount: async (id) => {
    const deleteAssetsQuery = 'DELETE FROM assets WHERE user_id = $1;';
    const deleteUserQuery = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id, email, created_at;
    `;
    const values = [id];

    try {
      // Ensure we delete assets first to prevent orphaned records or foreign key constraint errors
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
   * @param {string} email - The user's email.
   * @returns {Promise<object|null>} The user object or null if not found.
   */
  findByEmail: async (email) => {
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
   * @param {number} id - The user's ID.
   * @returns {Promise<object|null>} The user object or null if not found.
   */
  findById: async (id) => {
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

module.exports = User;
