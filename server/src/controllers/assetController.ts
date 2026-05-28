import { type Request, type Response } from 'express';
import { Asset } from '../models/Asset.js';

export const assetController = {
  /**
   * Retrieves the active portfolio assets for the authenticated user
   */
  getAllAssets: async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      const assets = await Asset.findByUserId(userId);
      res.status(200).json(assets);
    } catch (err: any) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  /**
   * Create a new asset for the authenticated user.
   */
  createAsset: async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, target_percentage, current_value, currency } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      if (!name || target_percentage === undefined || current_value === undefined || !currency) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }

      const newAsset = await Asset.create(
        userId,
        name,
        Number(target_percentage),
        Number(current_value),
        currency,
      );
      res.status(201).json(newAsset);
    } catch (err: any) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  /**
   * Update an asset.
   */
  updateAsset: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const assetId = Number(id);
      if (Number.isNaN(assetId)) {
        return res.status(400).json({ message: 'Invalid asset ID' });
      }

      const updatedAsset = await Asset.updateById(assetId, userId, req.body);

      if (!updatedAsset) {
        return res.status(404).json({ message: 'Asset not found or user not authorized' });
      }
      res.status(200).json(updatedAsset);
    } catch (err: any) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  /**
   * Delete an asset.
   */
  deleteAsset: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const assetId = Number(id);
      if (Number.isNaN(assetId)) {
        return res.status(400).json({ message: 'Invalid asset ID' });
      }

      const deletedAsset = await Asset.deleteById(assetId, userId);

      if (!deletedAsset) {
        return res.status(404).json({ message: 'Asset not found or user not authorized' });
      }
      res.status(200).json({ message: 'Asset deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },
};
