import express from 'express';
import { getTimeInsights } from '../controllers/timeController.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getTimeInsights);

export default router;