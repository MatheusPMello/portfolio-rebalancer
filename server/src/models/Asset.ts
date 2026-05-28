import { db } from '../config/db.js';

export interface AssetRecord {
  id: number;
  user_id: number;
  name: string;
  target_percentage: number | string;
  current_value: number | string;
  currency: 'USD' | 'BRL';
  created_at?: Date;
}

export interface NewAssetInput {
  name: string;
  target_percentage: number;
  current_value: number;
  currency: 'USD' | 'BRL';
}

export const Asset = {
  /**
   * Creates a new asset for a user.
   *
   * @param userId - The ID of the owner user.
   * @param name - The name of the asset (e.g. 'AAPL').
   * @param targetPercentage - Desired portfolio allocation percentage weight.
   * @param currentValue - The current monetary value of the asset.
   * @param currency - The asset base currency code ('USD' or 'BRL').
   * @returns A promise resolving to the created asset record.
   */
  create: async (
    userId: number,
    name: string,
    targetPercentage: number,
    currentValue: number,
    currency: 'USD' | 'BRL',
  ): Promise<AssetRecord> => {
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
   *
   * @param userId - The ID of the user.
   * @returns A promise resolving to an array of asset records.
   */
  findByUserId: async (userId: number): Promise<AssetRecord[]> => {
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
   *
   * @param assetId - The unique ID of the asset.
   * @param userId - The owner user's ID.
   * @param assetData - An object containing fields to update.
   * @returns A promise resolving to the updated asset record or null if not found.
   */
  updateById: async (
    assetId: number,
    userId: number,
    assetData: Partial<NewAssetInput>,
  ): Promise<AssetRecord | null> => {
    const { name, target_percentage, current_value, currency } = assetData;
    const query = `
      UPDATE assets
      SET name = $1, target_percentage = $2, current_value = $3, currency = $4
      WHERE id = $5 AND user_id = $6
      RETURNING *;
    `;
    const values = [name, target_percentage, current_value, currency, assetId, userId];

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
   *
   * @param assetId - The unique ID of the asset.
   * @param userId - The owner user's ID.
   * @returns A promise resolving to the deleted asset record or null if not found.
   */
  deleteById: async (assetId: number, userId: number): Promise<AssetRecord | null> => {
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
