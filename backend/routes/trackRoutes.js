import express from 'express';
import { getTopTracks, getMostRepeatedTracks, getMostSkippedTracks } from '../trackController.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/top', isAuthenticated, getTopTracks);
router.get('/most-repeated', isAuthenticated, getMostRepeatedTracks);
router.get('/most-skipped', isAuthenticated, getMostSkippedTracks);

export default router;