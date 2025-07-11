import Post from '../models/post.js';
import Follow from '../models/follow.js';
import User from '../models/users.js'
import Attachment from '../models/attachment.js'
import Like from '../models/like.js'
import { Op, fn, col, literal } from 'sequelize';
import ApiError from '../error/ApiError.js';
import { adaptFeedToClient } from '../adapter/feedAdapter.js';

export async function redirectToFeed(req, res, next) {
    res.redirect(302, '/feed');
}

export async function getFeed(req, res, next) {
    try {
        const userId = req.user.id;

        const follows = await Follow.findAll({
            where: { followerId: userId },
            attributes: ['followeeId']
        });

        const followeeIds = follows.map(f => f.followeeId);
        if (followeeIds.length === 0) {
            return res.json({ posts: [] });
        }

        const posts = await Post.findAll({
            where: { authorId: { [Op.in]: followeeIds } },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'firstName', 'lastName', 'username', 'faculty', 'avatarUrl', 'publicId']
                },
                {
                    model: Attachment,
                    as: 'attachments',
                    attributes: [],
                    required: false
                },
                {
                    model: Like,
                    as: 'likes',
                    attributes: [],
                    required: false
                }
            ],
            attributes: {
                include: [
                    [fn('COUNT', fn('DISTINCT', col('attachments.id'))), 'attachmentsCount'],
                    [fn('SUM', fn('DISTINCT', col('attachments.size'))), 'attachmentsTotalSize'],
                    [fn('COUNT', fn('DISTINCT', col('likes.id'))), 'likesCount'],
                    [
                        literal(`EXISTS (
                          SELECT 1 FROM "likes" AS l
                          WHERE l."postId" = "Post"."id" AND l."userId" = ${req.user.id}
                        )`),
                        'isLikedByCurrentUser'
                    ]
                ]
            },
            group: ['Post.id', 'author.id'],
            order: [['createdAt', 'DESC']],
            limit: 50,
            subQuery: false,
            duplicating: false
        });

        const adaptedPosts = posts.map(post =>
            adaptFeedToClient(post.get({ plain: true }))
        );

        res.json(adaptedPosts);
    } catch (error) {
        return next(ApiError.internal('failed to load feed: ' + error));
    }
}
