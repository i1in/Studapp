import { Op, fn, col, literal } from 'sequelize';
import Follow from '../models/follow.js';
import ApiError from '../error/ApiError.js';
import User from '../models/users.js'
import { adaptFollowersToClient } from '../adapter/followAdapter.js';

export async function toggleFollow(req, res, next) {
    try {
        const followerId = req.user.id;
        const followeeId = req.params.userId;

        if (Number(followerId) === Number(followeeId)) {
            return next(ApiError.badRequest('CANT_FOLLOW_YOURSELF'));
        }

        const followed = await Follow.findOne({
            where: { followerId, followeeId }
        })

        if (followed) {
            await followed.destroy({
                followerId, followeeId
            });

            return res.status(200).json({
                followed: false,
            })
        }

        await Follow.create({
            followerId, followeeId
        })

        res.status(200).json({
            followed: true,
        })
    } catch (error) {
        return next(ApiError.internal('failed to follow: ' + error))
    }
}

export async function followerList(req, res, next) {
    try {
        const followerId = req.user.id;
        const followeeId = req.params.userId;

        const followers = await Follow.findAll({
            where: { followeeId },
            include: [
                {
                    model: User,
                    as: 'follower',
                }
            ]
        });


        const adaptedFollowers = followers.map(adaptFollowersToClient)

        res.status(200).json(adaptedFollowers)
    } catch (error) {
        return next(ApiError.internal('failed to follow: ' + error))
    }
}