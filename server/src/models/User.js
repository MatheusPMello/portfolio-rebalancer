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
    const query = 'SELECT id, email, created_at FROM users WHERE id = $1;';
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
