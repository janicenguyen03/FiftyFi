import express from 'express';
import { getLatestTrack, getPlaylistFollowers } from '../controllers/homeController.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/latest-track', getLatestTrack);
router.get('/playlist-saved-count', getPlaylistFollowers);

export default router;