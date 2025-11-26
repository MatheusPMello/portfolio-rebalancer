// /server/src/controllers/assetController.js
const Asset = require('../models/Asset');


const assetController = {
  /**
   * Retrieves the active portfolio assets for the authenticated user
  */
  getAllAssets: async (req, res) => {
    try {
      const assets = await Asset.findByUserId(req.user.id);
      res.status(200).json(assets);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  /**
   * Create a new asset for the authenticated user.
   */
  createAsset: async (req, res) => {
    try {
      const { name, target_percentage, current_value, currency } = req.body;
      const userId = req.user.id;

      if (!name || !target_percentage || !current_value || !currency) {
        return res
          .status(400)
          .json({ message: 'Please provide all required fields' });
      }

      const newAsset = await Asset.create(
        userId,
        name,
        target_percentage,
        current_value,
        currency,
      );
      res.status(201).json(newAsset);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  updateAsset: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const updatedAsset = await Asset.updateById(id, userId, req.body);

      if (!updatedAsset) {
        return res
          .status(404)
          .json({ message: 'Asset not found or user not authorized' });
      }
      res.status(200).json(updatedAsset);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  deleteAsset: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const deletedAsset = await Asset.deleteById(id, userId);

      if (!deletedAsset) {
        return res
          .status(404)
          .json({ message: 'Asset not found or user not authorized' });
      }
      res.status(200).json({ message: 'Asset deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },
};

module.exports = assetController;
