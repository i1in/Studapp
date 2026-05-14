import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get('/chats/:chatId/messages', authenticateToken, '...');

router.post('/chats/:chatId/messages', authenticateToken, '...');
router.post('/messages/:messageId/reactions', authenticateToken, '...');

router.put('/messages/:messageId', authenticateToken, '...');

router.delete('/messages/:messageId', authenticateToken, '...');
router.delete('/messages/:messageId/reactions/:emoji', authenticateToken, '...');

export default router;