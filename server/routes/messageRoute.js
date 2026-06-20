import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { upload } from '../middleware/upload.js';
import * as MessageController from '../controllers/messageController.js'

const router = Router();

router.get('/chats/:chatId/messages', authenticateToken, MessageController.getMessages);
router.get('/messages/:messageId/reactions', authenticateToken, MessageController.getReactions);

router.post('/chats/:chatId/messages', authenticateToken, MessageController.sendMessage);
router.post('/messages/:messageId/reactions', authenticateToken, MessageController.addReaction);
router.post('/upload/attachments', 
    upload.array('files', 6),
    authenticateToken,
    MessageController.uploadMessageFiles
);

router.put('/messages/:messageId', authenticateToken, MessageController.editMessage);

router.delete('/messages/:messageId', authenticateToken, MessageController.deleteMessage);
router.delete('/messages/:messageId/reactions/:emoji', authenticateToken, MessageController.removeReaction);

export default router;