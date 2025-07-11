import bcrypt from 'bcrypt';
import { Op, fn, col, literal } from 'sequelize';
import { generateAndHashPassword } from '../middleware/generatePassword.js';
import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';
import User from '../models/users.js';
import { adaptUserToClient, adaptFullUserToClient, adaptUsersToClient } from '../adapter/userAdapter.js'

async function registration(req, res, next) {
    try {
        const { email, firstName, lastName, faculty, role } = req.body;

        if (!email) {
            return next(ApiError.badRequest('Missing email.'));
        }

        if (!firstName || !lastName) {
            return next(ApiError.badRequest('Missing first/last name.'));
        }

        if (!faculty) {
            return next(ApiError.badRequest('Missing faculty.'));
        }

        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            return next(ApiError.badRequest('user with this email is already exist.'));
        }

        const password = await generateAndHashPassword();

        const user = await User.create({
            firstName,
            lastName,
            email,
            faculty,
            role,
            password: password.hashedPassword
        });

        res.json({
            user: {
                id: user.id,
                email: user.email,
                publicId: user.publicId,
                role: user.role,
                faculty: user.faculty,
                password: password.plainPassword
            }
        });

    } catch (error) {
        next(ApiError.internal(`registration error: ${error}`))
    }
};

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(ApiError.badRequest('email and password is required'));
        }

        const user = await User.findOne({ where: { email } });
        if (!user) return next(ApiError.badRequest('USER_CREDS_IS_WRONG'))

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return next(ApiError.badRequest('PASSWORD_IS_WRONG'));

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token });
    } catch (error) {
        next(ApiError.internal('authorization error: ' + error))
    }
}

async function checkAuth(req, res) {
    const user = req.user;

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            faculty: user.faculty,
            avatarUrl: user.avatarUrl,
            username: user.username || user.publicId,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        faculty: user.faculty,
        avatarUrl: user.avatarUrl,
        username: user.username || user.publicId,
        token,
    });
}

async function logout(req, res) {
    res.status(204).send();
}

async function getUserData(req, res, next) {
    try {
        const id = req.user.id;

        const user = await User.findOne({
            where: { id }
        });

        if (!user) return next(ApiError.internal("USER_NOT_FOUND"))

        const userPlain = user.get({ plain: true });

        const adaptedFullUser = adaptFullUserToClient(userPlain)

        return res.status(200).json(adaptedFullUser);
    } catch (error) {
        next(ApiError.internal("failed to get user data: " + error));
    }
}

async function getUser(req, res, next) {
    try {
        const username = req.params.username;

        const user = await User.findOne({
            where: {
                [Op.or]: [{ username }, { publicId: username }]
            },
            attributes: {
                include: [
                    [
                        literal(`(
                      SELECT COUNT(*) 
                      FROM "follows" AS f 
                      WHERE f."followeeId" = "User"."id"
                    )`),
                        'followCount'
                    ],
                    [
                        literal(`EXISTS (
                      SELECT 1 
                      FROM "follows" AS f 
                      WHERE f."followeeId" = "User"."id" 
                        AND f."followerId" = ${req.user.id}
                    )`),
                        'isFollowedByCurrentUser'
                    ]
                ]
            },
            group: ['User.id']
        });

        if (!user) return next(ApiError.notFound("USER_NOT_FOUND"))

        const userPlain = user.get({ plain: true });

        const adaptedUser = adaptUserToClient(userPlain)

        return res.status(200).json(adaptedUser);
    } catch (error) {
        next(ApiError.internal("failed to get user data: " + error));
    }
}

async function uploadAvatar(req, res, next) {
    try {
        if (!req.file) {
            return next(ApiError.badRequest('Avatar file is required'));
        }

        const avatarUrl = `/static/${req.file.filename}`;
        await req.user.update({ avatarUrl });

        res.json({
            success: true,
            avatarUrl
        });
    } catch (error) {
        next(ApiError.internal("upload image error: " + error));
    }
}

async function editStatus(req, res, next) {
    try {
        const { status } = req.body;

        await req.user.update({ status });

        res.json({
            success: true,
            status
        });
    } catch (error) {
        next(ApiError.internal("edit status error: " + error));
    }
}

async function editUsername(req, res, next) {
    try {
        const { username } = req.body;
        if (!username) {
            return next(ApiError.badRequest('Username is required.'));
        }

        await req.user.update({ username });

        res.json({
            success: true,
            username
        });
    } catch (error) {
        next(ApiError.internal("edit status error: " + error));
    }
}

export async function getUsers(req, res, next) {
    try {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { username: { [Op.iLike]: `%${query}%` } },
                    { firstName: { [Op.iLike]: `%${query}%` } },
                    { lastName: { [Op.iLike]: `%${query}%` } }
                ]
            },
            attributes: ['id', 'firstName', 'lastName', 'username', 'avatarUrl', 'faculty', 'publicId'],
            limit: 20,
            order: [['username', 'ASC']],
        });

        const adaptedUsers = users.map(user =>
            adaptUsersToClient(user)
        )
        
        return res.json(adaptedUsers);
    } catch (err) {
        next(err);
    }
}

export { registration, login, checkAuth, logout, uploadAvatar, editStatus, editUsername, getUser, getUserData };
