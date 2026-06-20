import bcrypt from 'bcrypt';
import { Op, fn, col, literal } from 'sequelize';
import { generateAndHashPassword } from '../middleware/generatePassword.js';
import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';
import User from '../models/users.js';
import { adaptUserToClient, adaptFullUserToClient, adaptUsersToClient } from '../adapter/userAdapter.js'
import { onlineUsers } from '../socket/presence/presence.store.js';

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

        const accessToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        )

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '30d' },
        )

        await user.update({ refreshToken });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        })

        res.json({ token: accessToken });
    } catch (error) {
        next(ApiError.internal('authorization error: ' + error))
    }
}

async function refresh(req, res, next) {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return next(ApiError.unauthorized('NO_REFRESH_TOKEN'));
        }

        let decoded;

        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            return next(ApiError.unauthorized('INVALID_REFRESH_TOKEN'));
        }

        const user = await User.findByPk(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return next(ApiError.unauthorized('MISMATCH_REFRESH_TOKEN'));
        }

        const accessToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' },
        )

        res.json({ token: accessToken });
    } catch (error) {
        next(ApiError.internal('refresh error: ' + error))
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
        { expiresIn: '31d' }
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
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            await User.update(
                { refreshToken: null },
                { where: { refreshToken } }
            )
        }

        res.clearCookie('refreshToken');
        res.status(204).send();
    } catch (error) {
        next(ApiError.internal('logout error: ' + error))
    }
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
                    { publicId: { [Op.iLike]: `%${query}%` } },
                    { username: { [Op.iLike]: `%${query}%` } },
                    { firstName: { [Op.iLike]: `%${query}%` } },
                    { lastName: { [Op.iLike]: `%${query}%` } }
                ]
            },
            attributes: ['id', 'firstName', 'lastName', 'username', 'avatarUrl', 'faculty', 'publicId', 'role'],
            limit: 50,
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

export async function getUsersByFaculty(req, res, next) {
    try {
        const faculty = String(req.query.faculty).trim();

        if (!faculty || typeof faculty !== 'string') {
            return res.json([]);
        }

        const users = await User.findAll({
            where: {
                faculty: faculty
            },
            attributes: ['id', 'firstName', 'lastName', 'username', 'avatarUrl', 'faculty', 'publicId', 'role'],
            limit: 100,
            order: [['firstName', 'ASC'],]
        });

        const adaptedUsers = users.map(user => {
            try {
                if (typeof adaptUsersToClient === 'function') {
                    return adaptUsersToClient(user);
                }
            } catch (e) {
                console.error('[Faculty Adapter Warning]: ', e);
            }

            return user.get({ plain: true });
        })

        return res.json(adaptedUsers);
    } catch (err) {
        console.error('[getUsersByFaculty Critical Error]:', err);
        next(err);
    }
} 

export function getPresence(req, res, next) {
    const userId = Number(req.params.id);

    const state = onlineUsers.get(userId);

    if (!state) {
        return res.json({
            status: 'offline',
            lastSeen: null,
        });
    }

    if (state.hideOnline) {
        return res.json({
            status: 'hidden',
        })
    }

    return res.json({
        status: state.status,
        lastSeen: state.lastSeen,
    })
}

export { registration, login, refresh, checkAuth, logout, uploadAvatar, editStatus, editUsername, getUser, getUserData };
