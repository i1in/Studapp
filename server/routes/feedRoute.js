import { Router } from "express";
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getFeed, redirectToFeed } from '../controllers/feedController.js'

const router = new Router();

router.get('/', authenticateToken, redirectToFeed)
router.get('/feed', authenticateToken, getFeed)

export default router;