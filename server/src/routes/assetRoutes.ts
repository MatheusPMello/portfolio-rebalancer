import express from 'express';
import { assetController } from '../controllers/assetController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authMiddleware globally to all asset actions
router.use(authMiddleware);

router.get('/', assetController.getAllAssets);
router.post('/', assetController.createAsset);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

export default router;
