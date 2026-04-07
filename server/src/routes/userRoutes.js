const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.put('/email', authMiddleware, userController.updateEmail);
router.put('/password', authMiddleware, userController.updatePassword);
router.delete('/account', authMiddleware, userController.deleteAccount);

module.exports = router;
