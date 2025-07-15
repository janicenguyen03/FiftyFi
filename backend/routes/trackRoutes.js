import express from 'express';
import { getTopTracks, getTrackInsights } from '../controllers/trackController.js';
import jwtAuth from '../middlewares/jwtAuth.js';

const router = express.Router();

router.use(jwtAuth);

router.get('/top', getTopTracks);
router.get('/insights', getTrackInsights);

export default router;