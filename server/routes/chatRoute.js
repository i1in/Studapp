import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get('/chats', authenticateToken, '...');
router.get('/chats/:chatId', authenticateToken, '...');
router.get('/chats/:chatId/members', authenticateToken, '...');

router.post('/chats', authenticateToken, '...');
router.post('/chats/:chatId/members', authenticateToken, '...');

router.put('/chats/:chatId', authenticateToken, '...');

router.delete('/chats/:chatId/members/:userId', authenticateToken, '...');
router.delete('/chats/:chatId', authenticateToken, '...');

export default router;