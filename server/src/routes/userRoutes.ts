import express from 'express';
import userController from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/email', authMiddleware, userController.updateEmail);
router.put('/password', authMiddleware, userController.updatePassword);
router.delete('/account', authMiddleware, userController.deleteAccount);

export default router;
