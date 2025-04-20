import express from 'express';
import { getLatestTrack, getTimeSpent } from '../controllers/homeController.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/latest-track', getLatestTrack);
router.get('/time-spent', getTimeSpent);

export default router;