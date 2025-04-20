import express from 'express';
import { getTopTracks, getTrackInsights } from '../controllers/trackController.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/top', getTopTracks);
router.get('/insights', getTrackInsights);

export default router;