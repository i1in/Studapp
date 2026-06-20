import { Router } from "express";
import { uploadFile, uploadImage } from '../middleware/upload.js';
import { authenticateToken } from "../middleware/authMiddleware.js";
import * as chatController from "../controllers/chatController.js";

const router = Router();

router.get('/chats', authenticateToken, chatController.getChats);
router.get('/chats/:chatId', authenticateToken, chatController.getChatById);
router.get('/chats/:chatId/members', authenticateToken, chatController.getChatMembers);

router.post('/chats', authenticateToken, chatController.createChat);
router.post('/chats/:chatId/members', authenticateToken, chatController.addMember);
router.post('/upload/group-avatar', 
    uploadImage.single('avatar'),
    authenticateToken,
    chatController.uploadGroupAvatar
);

router.put('/chats/:chatId', authenticateToken, chatController.updateChat);

router.delete('/chats/:chatId/members/:userId', authenticateToken, chatController.removeMember);
router.delete('/chats/:chatId', authenticateToken, chatController.deleteChat);

export default router;