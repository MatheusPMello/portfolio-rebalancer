// /server/src/routes/assetRoutes.js
const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middlewares/authMiddleware'); // Our new "bouncer"

// --- IMPORTANT ---
// We apply the authMiddleware to ALL routes in this file.
router.use(authMiddleware);

// These paths are relative to /api/assets

router.get('/', assetController.getAllAssets);

router.post('/', assetController.createAsset);

router.put('/:id', assetController.updateAsset);

router.delete('/:id', assetController.deleteAsset);

module.exports = router;
