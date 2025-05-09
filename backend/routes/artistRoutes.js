import express from 'express';
import { getLatestTrack, getPlaylistFollowers } from '../controllers/homeController.js';
import isAuthenticated from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(isAuthenticated);

export default router;