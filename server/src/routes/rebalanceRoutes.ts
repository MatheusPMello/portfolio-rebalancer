import express from 'express';
import { rebalanceController } from '../controllers/rebalanceController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', rebalanceController.calculate);

export default router;
