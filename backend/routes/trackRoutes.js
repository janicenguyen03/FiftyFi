import express from 'express';
import { getTopTracks, getMostRepeatedTracks, getMostSkippedTracks } from '../trackController.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/top', getTopTracks);
router.get('/most-repeated', getMostRepeatedTracks);
router.get('/most-skipped', getMostSkippedTracks);

export default router;