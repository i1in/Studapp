import { Router } from "express";
import { uploadFile, uploadImage } from '../middleware/upload.js'
import {
        registration, login, checkAuth, logout,
        uploadAvatar, editStatus, editUsername, getUser, getUserData,
        getUsers, getPresence, getUsersByFaculty
} from '../controllers/userController.js'
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = new Router();
router.post('/register', registration);
router.post('/login', login);

router.get('/u/:username', authenticateToken, getUser);
router.get('/user', authenticateToken, getUserData);
router.get('/users', authenticateToken, getUsers);
router.get('/users/faculty', authenticateToken, getUsersByFaculty);
router.get('/users/:id/presence', authenticateToken, getPresence);

router.post('/edit/avatar',
        uploadImage.single('avatar'),
        authenticateToken,
        uploadAvatar)
router.post('/edit/status', authenticateToken, editStatus);
router.post('/edit/username', authenticateToken, editUsername);

router.get('/login', authenticateToken, checkAuth);
router.delete('/logout', logout);

export default router;