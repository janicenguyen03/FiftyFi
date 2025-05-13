import express from 'express';
import isAuthenticated from '../middlewares/authMiddleware.js';
import { getArtistInsights, getTopArtists } from '../controllers/artistController.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/top', getTopArtists);
router.get('/insights', getArtistInsights);

export default router;