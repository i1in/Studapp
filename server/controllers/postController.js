import { Op, fn, col, literal } from 'sequelize';
import { adaptFullPostToClient, adaptPostsToClient, adaptViewLikesToClient } from '../adapter/postAdapter.js';

import ApiError from '../error/ApiError.js';
import Post from '../models/post.js';
import User from '../models/users.js';
import Attachment from '../models/attachment.js'
import Like from '../models/like.js';
import Comment from '../models/comment.js';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

export async function getAllPosts(req, res, next) {
    try {
        const username = req.params.username;
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username },
                    { publicId: username }
                ]
            }
        })

        if (!user) {
            return next(ApiError.notFound('USER_NOT_FOUND'));
        }

        const posts = await Post.findAll({
            where: { authorId: user.id },
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
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'firstName', 'lastName', 'username', 'avatarUrl', 'faculty', 'publicId']
                },
                {
                    model: Attachment,
                    as: 'attachments',
                    attributes: []
                },
                {
                    model: Like,
                    as: 'likes',
                    attributes: []
                }
            ],
            group: ['Post.id', 'author.id'],
            order: [['createdAt', 'DESC']]
        });

        const adaptedPosts = posts.map(post =>
            adaptPostsToClient(post.get({ plain: true }))
        );

        res.status(200).json(adaptedPosts);
    } catch (error) {
        return next(ApiError.notFound('posts not found: ' + error));
    }
}

export async function createPost(req, res, next) {
    const t = await Post.sequelize.transaction();
    try {
        const { content } = req.body;
        const authorId = req.user.id;

        if (!content) {
            return next(ApiError.badRequest('Content is required'));
        }

        const post = await Post.create({
            authorId,
            content,
        }, { transaction: t });

        if (req.files && req.files.length > 0) {
            const attachmentRecords = req.files.map(file => ({
                postId: post.id,
                originalName: file.originalname,
                filename: file.filename,
                fileUrl: `/static/${file.filename}`,
                mimeType: file.mimetype,
                size: file.size
            }));

            await Attachment.bulkCreate(attachmentRecords, { transaction: t });
        }

        await t.commit()

        return res.status(201).json({
            success: true,
            postId: post.id
        });

    } catch (error) {
        await t.rollback();
        return next(ApiError.internal('failed to create post: ' + error))
    }
}

export async function getFullPost(req, res, next) {
    try {
        const { username, id: postId } = req.params;

        const user = await User.findOne({
            where: {
                [Op.or]: [{ username }, { publicId: username }]
            }
        });
        if (!user) {
            return next(ApiError.notFound('USER_NOT_FOUND'));
        }

        const post = await Post.findOne({
            where: { id: postId, authorId: user.id },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'firstName', 'lastName', 'username', 'avatarUrl', 'publicId', 'faculty']
                },
                {
                    model: Attachment,
                    as: 'attachments',
                    attributes: ['id', 'filename', 'fileUrl', 'mimeType', 'size', 'originalName', 'createdAt'],
                    order: [['createdAt', 'ASC']]
                },
                {
                    model: Like,
                    as: 'likes',
                    include: [
                        { 
                            model: User, 
                            as: 'author', 
                            attributes: ['id', 'firstName', 'lastName', 'username', 'avatarUrl', 'publicId'] 
                        }
                    ],
                    attributes: ['id', 'createdAt']
                },
                {
                    model: Comment,
                    as: 'comments',
                    include: [
                        { 
                            model: User, 
                            as: 'author', 
                            attributes: ['id', 'firstName', 'lastName', 'username', 'avatarUrl', 'publicId', 'faculty'] 
                        },
                        {
                            model: Comment,
                            as: 'replyTo',
                            include: [
                                {
                                    model: User,
                                    as: 'author',
                                    attributes: ['id', 'firstName', 'lastName', 'username']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!post) {
            return next(ApiError.notFound('POST_NOT_FOUND'));
        }

        const adaptedPost = adaptFullPostToClient(post);
        return res.status(200).json(adaptedPost);

    } catch (error) {
        console.error('============ [GET FULL POST ERROR CRASH] ============');
        console.error(error);
        console.error('=====================================================');
        
        return next(ApiError.internal('failed to fetch post: ' + error.message));
    }
}

export async function deletePost(req, res, next) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const staticDir = path.resolve(__dirname, '..', 'static');

    const transaction = await Post.sequelize.transaction();
    try {
        const authorId = req.user.id;
        const postId = req.params.id;

        const post = await Post.findOne({
            where: {
                id: postId, authorId
            },
            include: [{ model: Attachment, as: 'attachments' }]
        });

        if (!post) {
            await transaction.rollback();
            return next(ApiError.notFound('POST_NOT_FOUND'));
        }

        for (const attachment of post.attachments) {
            const filePath = path.join(staticDir, path.basename(attachment.fileUrl));
            try {
                await fs.promises.unlink(filePath);
            } catch (error) {
                return next(ApiError.internal('cannot delete file: ' + filePath));
            }
        }

        await Post.destroy({
            where: { id: postId },
            transaction
        })

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: 'post deleted.'
        });
    } catch (error) {
        await transaction.rollback();
        return next(ApiError.internal('failed to delete post: ' + error));
    }
}

export async function changeVisibility(req, res, next) {
    try {
        const { id: authorId } = req.user;
        const { id: postId } = req.params;

        const post = await Post.findOne({
            where: {
                id: postId, authorId
            },
        });

        if (!post) {
            return next(ApiError.notFound('POST_NOT_FOUND'));
        }

        const newVisibility = !post.visibility;

        await Post.update(
            { visibility: newVisibility },
            { where: { id: postId, authorId } }
        );

        return res.status(200).json({
            success: true,
            message: `VISIBILITY_${newVisibility ? 'PUBLIC' : 'PRIVATE'}`
        });
    } catch (error) {
        await transaction.rollback();
        return next(ApiError.internal('failed to delete post: ' + error));
    }
}

export async function likePost(req, res, next) {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await Post.findByPk(postId);
        if (!post) {
            return next(ApiError.notFound('POST_NOT_FOUND'));
        }

        const like = await Like.findOne({
            where: { postId, userId }
        });

        if (like) {
            await like.destroy({
                postId, userId
            })

            return res.status(201).json({
                success: true,
                message: 'POST_UNLIKED'
            })
        }

        await Like.create({
            postId, userId
        })

        return res.status(201).json({
            success: true,
            message: 'POST_LIKED'
        })
    } catch (error) {
        return next(ApiError.internal('failed to like post: ' + error))
    }
}

export async function viewLikesOnPost(req, res, next) {
    try {
        const postId = req.params.id;

        const likes = await Like.findAll({
            where: { postId },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'firstName', 'lastName', 'username', 'avatarUrl', 'publicId']
                }
            ]
        });

        const adaptedLikes = likes.map(adaptViewLikesToClient)

        if (!likes) {
            return next(ApiError.notFound('POST_NOT_FOUND'))
        }

        res.status(200).json(adaptedLikes);
    } catch (error) {
        return next(ApiError.internal('failed to count likes: ' + error));
    }
}

export async function commentPost(req, res, next) {
    try {
        const postId = req.params.id;
        const authorId = req.user.id;
        const { content, replyToId } = req.body;

        if (!content || !content.trim()) {
            return next(ApiError.badRequest('COMMENT_IS_NULL'));
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return next(ApiError.badRequest('POST_NOT_FOUND'));
        }

        if (replyToId) {
            const parentComment = await Comment.findByPk(replyToId);
            if (!parentComment) {
                return next(ApiError.badRequest('PARENT_COMMENT_NOT_FOUND'));
            }
        }

        const comment = await Comment.create({
            postId,
            authorId,
            content,
            replyToId: replyToId || null,
        });

        const full = await Comment.findByPk(comment.id, {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'firstName', 'lastName', 'username', 'avatarUrl', 'faculty']
                },
                {
                    model: Comment,
                    as: 'replyTo',
                    include: [{
                        model: User,
                        as: 'author',
                        attributes: ['id', 'firstName', 'lastName', 'username']
                    }]
                }
            ]
        });

        return res.status(201).json({
            success: true,
            message: 'COMMENT_ADDED',
            comment: full
        });
    } catch (error) {
        return next(ApiError.internal('failed to comment post: ' + error));
    }
}

export async function deleteComment(req, res, next) {
    try {
      const userId = req.user.id;
      const { postId, commentId } = req.params;
  
      const comment = await Comment.findOne({
        where: { id: commentId },
        include: [{
          model: Post,
          as: 'post',
          attributes: ['authorId']
        }]
      });
  
      if (!comment) {
        return next(ApiError.badRequest('COMMENT_NOT_FOUND'));
      }
  
      const isCommentAuthor = comment.authorId === userId;
      const isPostAuthor    = comment.post.authorId === userId;
  
      if (!isCommentAuthor && !isPostAuthor) {
        return next(ApiError.forbidden('NO_PERMISSION_TO_DELETE_COMMENT ' + String(comment.userId)));
      }

      await comment.destroy();
  
      return res.status(200).json({
        success: true,
        message: 'COMMENT_DELETED'
      });
    } catch (error) {
      return next(ApiError.internal('failed to delete comment: ' + error.message));
    }
  }
  
