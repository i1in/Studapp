import Message from '../../models/message.js';
import MessageReaction from '../../models/messagereactions.js';
import MessageAttachment from '../../models/messageattachments.js';
import ChatMember from '../../models/chatMember.js';
import Chat from '../../models/chat.js';
import User from '../../models/users.js';

import { Op } from 'sequelize';

export function registerMessageHandlers(io, socket) {
    socket.on('message_send', async ({ chatId, text, type = 'text', replyToId }) => {
        try {
            if (!text.trim()) return socket.emit('error', { message: 'MESSAGE_EMPTY' });

            const isMember = await ChatMember.findOne({
                where: { chatId, userId: socket.user.id, leftAt: null },
            });
            if (!isMember) return socket.emit('error', { message: 'USER_NOT_MEMBER' });

            const message = await Message.create({
                chatId,
                senderId: socket.user.id,
                text: text.trim(),
                type,
                replyToId: replyToId || null,
            });

            const full = await Message.findByPk(message.id, {
                include: [
                    { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
                    { model: MessageAttachment, as: 'attachments' },
                    {
                        model: Message, as: 'replyTo',
                        include: [{ model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }]
                    }
                ],
            });

            await Chat.update({ lastMessageId: message.id }, { where: { id: chatId } });

            io.to(String(chatId)).emit('new_message', full);

            console.log(`[Send Message] userId=${socket.user.id} chatId=${chatId} messageId=${message.id}`);
        } catch (e) {
            console.error('[Send Message error]: ' + e);
            socket.emit('error', { message: 'SERVER_ERROR' });
        }
    });

    socket.on('typing', async ({ chatId, isTyping }) => {
        socket.to(String(chatId)).emit('typing', { chatId, userId: socket.user.id, isTyping });
    });

    socket.on('message_edit', async ({ messageId, text }) => {
        try {
            const editedAt = new Date();
            if (!text.trim()) return socket.emit('error', { message: 'MESSAGE_EMPTY' });

            const message = await Message.findByPk(messageId);
            if (!message) return socket.emit('error', { message: 'MESSAGE_NOT_FOUND' });
            if (message.senderId !== socket.user.id) return socket.emit('error', { message: 'NOT_MESSAGE_OWNER' });

            await message.update({
                text: text.trim(),
                editedAt,
            });

            io.to(String(message.chatId)).emit('message_edit', {
                messageId,
                text: text.trim(),
                editedAt,
            });
        } catch (e) {
            console.error('[Edit Message error]: ' + e);
            socket.emit('error', { message: 'SERVER_ERROR' });
        }
    });

    socket.on('message_delete', async ({ messageId }) => {
        try {
            const message = await Message.findByPk(messageId);
            if (!message) return socket.emit('error', { message: 'MESSAGE_NOT_FOUND' });

            const isAuthor = message.senderId === socket.user.id;
            if (!isAuthor) {
                const member = await ChatMember.findOne({
                    where: { chatId: message.chatId, userId: socket.user.id, leftAt: null },
                });

                const hasRights = member && ['admin', 'owner'].includes(member.role);
                if (!hasRights) return socket.emit('error', { message: 'NOT_MESSAGE_OWNER' });
            }

            const chatId = message.chatId;
            const id = message.id;

            const prevMessageRow = await Message.findOne({
                where: { chatId, id: { [Op.lt]: id } },
                order: [['id', 'DESC']],
                include: [{ model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName'] }]
            });

            const previousMessage = prevMessageRow ? prevMessageRow.get({ plain: true }) : null;

            await message.destroy();

            io.to(String(chatId)).emit('message_delete', { messageId: id, chatId, previousMessage });
            console.log(`[Delete Message] userId=${socket.user.id} chatId=${message.chatId} messageId=${message.id}`);
        } catch (e) {
            console.error('[Delete Message error]: ' + e);
            socket.emit('error', { message: 'SERVER_ERROR' });
        }
    });

    socket.on('message_react', async ({ messageId, emoji }) => {
        try {
            if (!emoji) return socket.emit('error', { message: 'EMOJI_EMPTY' });

            const message = await Message.findByPk(messageId);
            if (!message) return socket.emit('error', { message: 'MESSAGE_NOT_FOUND' });

            const isMember = await ChatMember.findOne({
                where: { chatId: message.chatId, userId: socket.user.id, leftAt: null },
            });
            if (!isMember) return socket.emit('error', { message: 'USER_NOT_MEMBER' });

            const existing = await MessageReaction.findOne({
                where: { messageId, userId: socket.user.id, emoji },
            });

            let action;

            if (existing) {
                await existing.destroy();
                action = 'removed';
            } else {
                await MessageReaction.create({ messageId, userId: socket.user.id, emoji });
                action = 'added';
            }

            io.to(String(message.chatId)).emit('message_react', {
                messageId,
                userId: socket.user.id,
                emoji,
                action,
            });
        } catch (e) {
            console.error('[React Message error]: ' + e);
            socket.emit('error', { message: 'SERVER_ERROR' });
        }
    });
}

