// /server/src/routes/assetRoutes.js
const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middlewares/authMiddleware'); // Our new "bouncer"

// --- IMPORTANT ---
// We apply the authMiddleware to ALL routes in this file.
// This means no one can access these routes without a valid token.
router.use(authMiddleware);

// --- Asset CRUD Routes ---
// These paths are relative to /api/assets

// GET /api/assets/
router.get('/', assetController.getAllAssets);

// POST /api/assets/
router.post('/', assetController.createAsset);

// PUT /api/assets/:id
router.put('/:id', assetController.updateAsset);

// DELETE /api/assets/:id
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
