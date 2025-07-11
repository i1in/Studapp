import { Router } from "express";
import { authenticateToken } from '../middleware/authMiddleware.js';
import { createPost, getAllPosts, getFullPost, 
        deletePost, changeVisibility, likePost,
        viewLikesOnPost, commentPost, deleteComment } from '../controllers/postController.js';
import { upload } from '../middleware/upload.js'

const router = new Router();
 
router.get('/:username/posts', authenticateToken, getAllPosts);
router.get('/:username/posts/:id', authenticateToken, getFullPost)
router.get('/:username/posts/:id/likes', authenticateToken, viewLikesOnPost)
router.post('/:username/posts/:id/comments', authenticateToken, commentPost)
router.delete('/:username/posts/:id/comments/:commentId', authenticateToken, deleteComment)

router.post('/post', authenticateToken, upload.array('attachment', 6), createPost)
router.delete('/post/:id', authenticateToken, deletePost)
router.patch('/post/:id/visibility', authenticateToken, changeVisibility)
router.post('/post/:id/like', authenticateToken, likePost);

export default router;