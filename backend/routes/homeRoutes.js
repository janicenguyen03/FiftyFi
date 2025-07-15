import express from 'express';
import { getLatestTrack, getPlaylistFollowers } from '../controllers/homeController.js';
import jwtAuth from '../middlewares/jwtAuth.js';

const router = express.Router();

router.use(jwtAuth);

router.get('/latest-track', getLatestTrack);
router.get('/playlist-saved-count', getPlaylistFollowers);

export default router;