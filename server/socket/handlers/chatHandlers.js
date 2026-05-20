import ChatMember from "../../models/chatMember.js";
import Message from "../../models/message.js";
import Chat from "../../models/chat.js";
import User from "../../models/users.js";

export async function emitSystemMessage(io, { chatId, event, actorId, targetId = null }) {
    const chat = await Chat.findByPk(chatId);
    if (!chat) return;

    const actor = await User.findByPk(actorId, {
        attributes: ['id', 'firstName', 'lastName']
    });
    if (!actor) return;

    const target = targetId
        ? await User.findByPk(targetId, { attributes: ['id', 'firstName', 'lastName'] })
        : null;

    let text = '';
    switch (event) {
        case 'user_joined':
            text = `${actor.firstName} ${actor.lastName} вступил в группу.`;
            break;
        case 'user_left':
            text = `${actor.firstName} ${actor.lastName} покинул группу.`;
            break;
        case 'member_added':
            if (!target) return; // ничего не делаем, если нет target
            text = `${actor.firstName} ${actor.lastName} добавил ${target.firstName} ${target.lastName}`;
            break;
        case 'member_removed':
            if (!target) return;
            text = `${actor.firstName} ${actor.lastName} удалил ${target.firstName} ${target.lastName}`;
            break;
        case 'chat_created':
            text = `${actor.firstName} ${actor.lastName} создал группу.`;
            break;
        case 'chat_renamed':
            text = `${actor.firstName} ${actor.lastName} переименовал группу.`;
            break;
        default:
            text = event;
    }

    const message = await Message.create({
        chatId,
        senderId: actorId,
        type: 'system',
        systemEvent: event,
        text: text,
    });

    io.to(String(chatId)).emit('new_message', {
        ...message.toJSON(),
        sender: actor,
    });
}

export function registerChatHandlers(io, socket) {
    socket.on('join_chat', async ({ chatId }) => {
        try {
            console.log(`trying to join chat: userId=${socket.user.id} chatId=${chatId}`);
            const chat = await Chat.findByPk(chatId);
            if (!chat) return socket.emit('error', { message: 'CHAT_NOT_FOUND' });

            let member = await ChatMember.findOne({
                where: { chatId, userId: socket.user.id, leftAt: null },
            });

            if (!member) {
                member = await ChatMember.create({
                    chatId,
                    userId: socket.user.id,
                    joinedAt: new Date(),
                    lastReadMessageId: null,
                    leftAt: null,
                });

                if (chat?.type === 'group') {
                    await emitSystemMessage(io, {
                        chatId,
                        event: 'user_joined',
                        actorId: socket.user.id,
                    });
                }
            }

            const rooms = [...socket.rooms].filter(room => room !== socket.id);
            rooms.forEach(room => socket.leave(room));

            socket.join(String(chatId));

            const messages = await Message.findAll({
                where: { chatId },
                limit: 50,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: User,
                        as: 'sender',
                        attributes: ['id', 'firstName', 'lastName', 'avatarUrl'],
                        required: false,
                    },
                ],
            });

            socket.emit('history', messages.reverse());

            if (messages.length > 0) {
                await member.update({ lastReadMessageId: messages.at(-1).id });
            }

            console.log(`[Join Chat] userId=${socket.user.id} chatId=${chatId}`);
        } catch (e) {
            console.error('[Join Chat error]: ' + e);
            socket.emit('error', { message: 'SERVER_ERROR' });
        }
    });

    socket.on('leave_chat', async ({ chatId }) => {
        try {
            const chat = await Chat.findByPk(chatId);
            if (chat?.type === 'group') {
                await emitSystemMessage(io, {
                    chatId,
                    event: 'user_left',
                    actorId: socket.user.id
                });
            }

            socket.leave(String(chatId));
            console.log(`[Leave Chat] userId=${socket.user.id} chatId=${chatId}`);
        } catch (e) {
            console.error('[Leave Chat error]: ' + e);
            socket.emit('error', { message: 'SERVER_ERROR' });
        }
    });

    socket.on('add_member', async ({ chatId, userId }) => {
        try {
            const requester = await ChatMember.findOne({
                where: { chatId, userId: socket.user.id, leftAt: null },
            });

            if (!requester || requester.role === 'member') {
                socket.emit('error', { message: 'USER_NOT_MEMBER' });
                return;
            }

            await ChatMember.create({
                chatId,
                userId,
                role: 'member',
            });

            await emitSystemMessage(io, {
                chatId,
                event: 'member_added',
                actorId: socket.user.id,
                targetId: userId,
            });

            console.log(`[Add Member] userId=${socket.user.id} added userId=${userId} to chatId=${chatId}`);
        } catch (e) {
            console.error('[Add Member error]: ' + e);
            socket.emit('error', { message: 'SERVER_ERROR' });
        }
    });

    socket.on('remove_member', async ({ chatId, userId }) => {
        try {
            const requester = await ChatMember.findOne({
                where: { chatId, userId: socket.user.id, leftAt: null },
            });

            if (!requester || requester.role === 'member') {
                socket.emit('error', { message: 'USER_NOT_MEMBER' });
            }

            await ChatMember.update(
                { leftAt: new Date() },
                { where: { chatId, userId } }
            );

            await emitSystemMessage(io, {
                chatId,
                event: 'member_removed',
                actorId: socket.user.id,
                targetId: userId,
            });

            console.log(`[Remove Member] userId=${socket.user.id} removed userId=${userId} from chatId=${chatId}`);
        } catch (e) {
            console.error('[Remove Member error]: ' + e);
            socket.emit('error', { message: 'SERVER_ERROR' });
        }
    });

    socket.on('message_read', async ({ chatId, messageId }) => {
        try {
            await ChatMember.update(
                { lastReadMessageId: messageId },
                { where: { chatId, userId: socket.user.id, leftAt: null } },
            );

            socket.to(String(chatId)).emit('message_read', {
                chatId,
                userId: socket.user.id,
                messageId,
            });
        } catch (e) {
            console.error('[Read Message error]: ' + e);
            socket.emit('error', { message: 'SERVER_ERROR' });
        }
    });
}