import ApiError from "../error/ApiError.js";
import Message from "../models/message.js";
import MessageAttachment from "../models/messageattachments.js";
import MessageReaction from "../models/messagereactions.js";
import ChatMember from "../models/chatMember.js";
import User from "../models/users.js";
import { Op } from 'sequelize';

export async function getMessages(req, res, next) {
    try {
        const { chatId } = req.params;
        const { cursor, limit = 50 } = req.query;

        const isMember = await ChatMember.findOne({
            where: { chatId, userId: req.user.id, leftAt: null },
        });
        if (!isMember) return next(ApiError.forbidden('FORBIDDEN'));

        const where = { chatId };
        if (cursor) where.id = { [ Op.lt ]: cursor };

        const messages = await Message.findAll({
            where,
            limit: Number(limit),
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
                },
                {
                    model: MessageAttachment,
                    as: 'attachments',
                },
                {
                    model: MessageReaction,
                    as: 'reactions',
                    include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName'] }],
                },
                {
                    model: Message,
                    as: 'replyTo',
                    include: [{ model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName'] }],
                },
            ],
        });

        const reversed = messages.reverse();
        const nextCursor = messages.length === Number(limit) ? messages[0].id : null;

        return res.json({ messages: reversed, nextCursor });
    } catch (e) {
        next(ApiError.internal('getMessages error: ' + e));
    }
}

export async function getReactions(req, res, next) {
    try { 
        const { messageId } = req.params;

        const message = await Message.findByPk(messageId);
        if (!message) return next(ApiError.notFound('MESSAGE_NOT_FOUND'));

        const isMember = await ChatMember.findOne({
            where: { chatId: message.chatId, userId: req.user.id, leftAt: null },
        });
        if (!isMember) return next(ApiError.forbidden('USER_NOT_MEMBER'));

        const reactions = await MessageReaction.findAll({
            where: { messageId },
            include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }],
        });

        const grouped = reactions.reduce((acc, r) => {
            if (!acc) acc[r.emoji] = [];
            acc[r.emoji].push(r.user);
            return acc;
        }, {});

        return res.json({messageId, reactions: grouped});
    } catch (e) { 
        next(ApiError.internal('getReactions error: ' + e));
    }
}

export async function sendMessage(req, res, next) {
    try {
        const { chatId } = req.params;
        const { text, type = 'text', replyToId } = req.body;

        const isMember = await ChatMember.findOne({
           where: { chatId, userId: req.user.id, leftAt: null }, 
        });
        if (!isMember) return next(ApiError.forbidden('USER_NOT_MEMBER'));

        if (!text.trim()) return next(ApiError.badRequest('TEXT_IS_REQUIRED'));

        const message = await Message.create({
            chatId,
            senderId: req.user.id,
            type: text.trim(),
            replyToId: replyToId || null,
        });

        const full = await Message.findByPk(message.id, {
            include: [
                { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
                { model: MessageAttachment, as: 'attachments' },
                { model: Message, as: 'replyTo',
                include: [{ model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName'] }] },
            ],
        });

        return res.status(201).json(full);
    } catch (e) {
        next(ApiError.internal('sendMessage error: ' + e));
    }
}

export async function editMessage(req, res, next) {
    try {
        const { messageId } = req.params;
        const { text } = req.body;

        if (!text?.trim()) return next(ApiError.badRequest('TEXT_IS_REQUIRED'));

        const message = await Message.findByPk(messageId);
        if (!message) return next(ApiError.notFound('MESSAGE_NOT_FOUND'));

        if (message.senderId !== req.user.id) return next(ApiError.forbidden('CANT_EDIT_MESSAGE'));

        await message.update({ text: text.trim(), editedAt: new Date() });

        return res.json(message);
    } catch (e) { 
        next(ApiError.internal('editMessage error: ' + e));
    }
}

export async function deleteMessage(req, res, next) {
    try {
        const { messageId } = req.params;

        const message = await Message.findByPk(messageId);
        if (!message) return next(ApiError.notFound('MESSAGE_NOT_FOUND'));

        const isAuthor = message.senderId === req.user.id;
        if (!isAuthor) {
            const member = await ChatMember.findOne({
                where: { chatId: message.chatId, userId: req.user.id, leftAt: null },
            });
            const hasRights = member && ['admin', 'owner'].includes(member.role);
            if (!hasRights) return next(ApiError.forbidden('MEMBER_NOT_ADMIN'));
        }

        await message.destroy();

        return res.status(204).send();
    } catch (e) {
        next(ApiError.internal('deleteMessage error: ' + e));
    }
}

export async function addReaction(req, res, next) {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body;

        if (!emoji) return next(ApiError.badRequest('EMOJI_IS_REQUIRED'));

        const message = await Message.findByPk(messageId);
        if (!message) return next(ApiError.notFound('MESSAGE_NOT_FOUND'));

        const isMember = await ChatMember.findOne({
            where: { chatId: message.chatId, userId: req.user.id, leftAt: null },
        });
        if (!isMember) return next(ApiError.forbidden('USER_NOT_MEMBER'));

        const [reaction, created] = await MessageReaction.findOrCreate({
            where: { messageId, userId: req.user.id, emoji }
        });

        return res.status(created ? 201 : 200).json(reaction);
    } catch (e) {
        next(ApiError.internal('addReaction error: ' + e));
    }
}

export async function removeReaction(req, res, next) { 
    try {
        const { messageId, emoji } = req.params;

        const reaction = await MessageReaction.findOne({
            where: { messageId, userId: req.user.id, emoji },
        });
        if (!reaction) return next(ApiError.notFound('REACTION_NOT_FOUND'));

        await reaction.destroy();

        return res.status(204).send();
    } catch (e) {
        next(ApiError.internal('removeReaction error: ' + e));
    }
}