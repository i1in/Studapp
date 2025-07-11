import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';
import User from '../models/users.js';

async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer')) {
            return next(ApiError.unauthorized('UNAUTH_USE_TOKEN'));
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return next(ApiError.unauthorized('USER_NOT_FOUND'));
        }

        req.user = user;
        req.role = user.role;
        next();
    } catch (error) {
        next(ApiError.unauthorized('INVALID_TOKEN'));
    }
}

export { authenticateToken };