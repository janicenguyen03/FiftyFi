import express from 'express';
import { getTimeInsights } from '../controllers/timeController.js';
import jwtAuth from '../middlewares/jwtAuth.js';

const router = express.Router();

router.use(jwtAuth);

router.get('/', getTimeInsights);

export default router;