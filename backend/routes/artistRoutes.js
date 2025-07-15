import express from 'express';
import jwtAuth from '../middlewares/jwtAuth.js';
import { getArtistInsights, getTopArtists } from '../controllers/artistController.js';

const router = express.Router();

router.use(jwtAuth);

router.get('/top', getTopArtists);
router.get('/insights', getArtistInsights);

export default router;