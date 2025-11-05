// /server/src/models/Asset.js

const db = require('../config/db');

const Asset = {
  /**
   * Creates a new asset for a user.
   * @returns {Promise<object>} The new asset object.
   */
  create: async (userId, name, targetPercentage, currentValue, currency) => {
    const query = `
      INSERT INTO assets (user_id, name, target_percentage, current_value, currency)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [userId, name, targetPercentage, currentValue, currency];

    try {
      const res = await db.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error('Error creating asset:', err);
      throw err;
    }
  },

  /**
   * Finds all assets for a specific user.
   * @param {number} userId - The user's ID.
   * @returns {Promise<Array>} An array of asset objects.
   */
  findByUserId: async (userId) => {
    const query = 'SELECT * FROM assets WHERE user_id = $1 ORDER BY name ASC;';
    const values = [userId];

    try {
      const res = await db.query(query, values);
      return res.rows;
    } catch (err) {
      console.error('Error finding assets by user id:', err);
      throw err;
    }
  },

  /**
   * Updates an existing asset.
   * @param {number} assetId - The ID of the asset to update.
   * @param {number} userId - The ID of the user who owns the asset.
   * @returns {Promise<object|null>} The updated asset object or null.
   */
  updateById: async (assetId, userId, assetData) => {
    const { name, target_percentage, current_value, currency } = assetData;
    const query = `
      UPDATE assets
      SET name = $1, target_percentage = $2, current_value = $3, currency = $4
      WHERE id = $5 AND user_id = $6
      RETURNING *;
    `;
    const values = [
      name,
      target_percentage,
      current_value,
      currency,
      assetId,
      userId,
    ];

    try {
      const res = await db.query(query, values);
      return res.rows[0] || null;
    } catch (err) {
      console.error('Error updating asset:', err);
      throw err;
    }
  },

  /**
   * Deletes an asset.
   * @param {number} assetId - The ID of the asset to delete.
   * @param {number} userId - The ID of the user who owns the asset.
   * @returns {Promise<object|null>} The deleted asset object or null.
   */
  deleteById: async (assetId, userId) => {
    const query = `
      DELETE FROM assets
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const values = [assetId, userId];

    try {
      const res = await db.query(query, values);
      return res.rows[0] || null;
    } catch (err) {
      console.error('Error deleting asset:', err);
      throw err;
    }
  },
};

module.exports = Asset;
