import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/admin.js';
import User from '../models/users.js';

const router = express.Router();

router.get('/admin', authenticateToken, adminOnly, async (req, res) => {
    const user = await User.findOne({ 
        where: { id: req.user.id, role: 'admin' } 
    });

    console.log(req.role)

    res.json({user: user});
    return;
});

export default router;
