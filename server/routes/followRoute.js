import { Router } from "express";
import { authenticateToken } from '../middleware/authMiddleware.js';
import { toggleFollow, followerList } from '../controllers/followController.js'

const router = new Router();

router.post('/:userId/followers', authenticateToken, toggleFollow)
router.get('/:userId/followers', authenticateToken, followerList)

export default router;