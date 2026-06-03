import ChatMember from "../../models/chatMember.js";
import Message from "../../models/message.js";
import MessageReaction from "../../models/messagereactions.js";
import Chat from "../../models/chat.js";
import User from "../../models/users.js";

import { Op } from "sequelize";

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

export async function joinAllUserChats(socket) {
    try {
        const activeMemberships = await ChatMember.findAll({
            where: { userId: socket.user.id, leftAt: null },
            attributes: ['chatId']
        });

        activeMemberships.forEach(membership => {
            socket.join(String(membership.chatId));
        });

        socket.join(`user:${socket.user.id}`);

        console.log(`[WS System] user ${socket.user.id} successfully joined ${activeMemberships.length} chat rooms.`);
    } catch (e) {
        console.error('[WS System] error joining user chats on connect: ' + e)
    }
}

export function registerChatHandlers(io, socket) {
    socket.on('join_chat', async ({ chatId, targetUserId }) => {
        try {
            let targetChatId = chatId;
            const myId = socket.user.id;

            if (!targetChatId && targetUserId) {
                console.log(`[WS Join] Checking existing history for direct chat between ${myId} and ${targetUserId}`);

                const existingChat = await Chat.findOne({
                    where: { type: 'direct' },
                    include: [
                        { model: ChatMember, as: 'members', where: { userId: myId, leftAt: null }, attributes: [] },
                        { model: ChatMember, as: 'allMembers', where: { userId: targetUserId, leftAt: null }, attributes: [] }
                    ]
                });

                if (existingChat) {
                    targetChatId = existingChat.id;

                    socket.emit('chat_create_success', { chatId: existingChat.id });
                } else {
                    return socket.emit('history', []);
                }
            }

            const chat = await Chat.findByPk(targetChatId);
            if (!chat) return socket.emit('error', { message: 'CHAT_NOT_FOUND' });

            let member = await ChatMember.findOne({
                where: { chatId: targetChatId, userId: myId, leftAt: null }
            });

            if (!member) {
                member = await ChatMember.create({
                    chatId: targetChatId, userId: myId, joinedAt: new Date(), role: 'member',
                });
            }

            try {
                const allChatMembers = await ChatMember.findAll({
                    where: {
                        chatId: targetChatId,
                        leftAt: null,
                        userId: { [Op.ne]: myId }
                    },
                    attributes: ['userId']
                })

                if (allChatMembers.length > 0) {
                    const memberIds = allChatMembers.map(m => m.userId);

                    const usersPresenceInfo = await User.findAll({
                        where: { id: { [Op.in]: memberIds } },
                        attributes: ['id', 'lastSeenAt']
                    });

                    const presencePayload = usersPresenceInfo.map(u => {
                        const isOnlineNow = io.sockets.adapter.rooms.has(`user_${u.id}`);

                        return {
                            userId: u.id,
                            status: isOnlineNow ? 'online' : 'offline',
                            lastSeen: u.lastSeenAt ? new Date(u.lastSeenAt).getTime() : null,
                            hidden: false,
                        };
                    });

                    if (chat.type === 'direct' && presencePayload.length > 0) {
                        socket.emit('presence:update', presencePayload[0]);
                    } else if (presencePayload.length > 0) {
                        socket.emit('presence:state', presencePayload);
                    }
                    
                    console.log(`[WS Presence] synced presence info for ${presencePayload.length} members in chatId=${targetChatId} for userId=${myId}`);
                }
            } catch (presenceError) {
                console.error(`[WS Presence] error syncing presence info for chatId=${targetChatId} userId=${myId}: ` + presenceError);
            }

            socket.join(String(targetChatId));

            const messages = await Message.findAll({
                where: { chatId: targetChatId },
                limit: 50,
                order: [['createdAt', 'DESC']],
                include: [
                    { 
                        model: User, 
                        as: 'sender', 
                        attributes: ['id', 'firstName', 'lastName', 'avatarUrl'], 
                        required: false 
                    },
                    {
                        model: MessageReaction,
                        as: 'reactions',
                        attributes: ['userId', 'emoji'],
                        required: false
                    }
                ],
            });

            const latestMessageId = messages.length > 0 ? messages[0].id : null;

            socket.emit('history', messages.reverse());

            if (latestMessageId) {
                await member.update({ lastReadMessageId: latestMessageId });
            }

            console.log(`[Join Chat Success] userId=${myId} chatId=${targetChatId}`);
        } catch (e) {
            console.error('[Join Chat error]: ' + e);
            socket.emit('error', { message: 'SERVER_ERROR' });
        }
    });

    socket.on('create_chat', async ({ type, userIds, name, firstMessageText }) => {
        try {
            const myId = socket.user.id;
            const targetType = type || 'direct';

            let chat = null;
            let isNewChat = false;
            let finalTargetUserIds = [];

            if (type === 'direct') {
                const targetUserId = Array.isArray(userIds) ? userIds[0] : userIds;
                if (!targetUserId || Number(targetUserId) === myId) return;

                finalTargetUserIds = [Number(targetUserId)];

                let chat = await Chat.findOne({
                    where: { type: 'direct' },
                    include: [
                        { model: ChatMember, as: 'members', where: { userId: myId, leftAt: null }, attributes: [] },
                        { model: ChatMember, as: 'allMembers', where: { userId: targetUserId, leftAt: null }, attributes: [] }
                    ]
                });

                let isNewChat = false;

                if (!chat) {
                    isNewChat = true;

                    chat = await Chat.create({
                        type: 'direct',
                        createdBy: myId
                    });

                    await ChatMember.bulkCreate([
                        { chatId: chat.id, userId: myId, role: 'member' },
                        { chatId: chat.id, userId: targetUserId, role: 'member' }
                    ]);
                }

                socket.join(String(chat.id));

                const targetSocketRoom = io.sockets.adapter.rooms.get(`user_${targetUserId}`);
                if (targetSocketRoom) {
                    targetSocketRoom.forEach(socketId => {
                        const clientSocket = io.sockets.sockets.get(socketId);
                        if (clientSocket) {
                            clientSocket.join(String(chat.id));
                        }
                    });
                }

                let lastMessagePayload = null;

                if (firstMessageText && firstMessageText.trim()) {
                    const message = await Message.create({
                        chatId: chat.id,
                        senderId: myId,
                        text: firstMessageText.trim(),
                        type: 'text',
                        replyToId: null
                    });

                    const fullMessage = await Message.findByPk(message.id, {
                        include: [
                            { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }
                        ]
                    });

                    lastMessagePayload = fullMessage.get({ plain: true });

                    await chat.update({ lastMessageId: message.id });

                    io.to(String(chat.id)).emit('new_message', lastMessagePayload);
                }


                const fullChatData = await Chat.findByPk(chat.id, {
                    include: [{
                        model: ChatMember, as: 'allMembers', attributes: ['userId', 'role'],
                        include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'avatarUrl', 'username', 'faculty', 'role', 'publicId'] }]
                    }]
                });

                const chatPayload = fullChatData.get({ plain: true });

                const companionForMe = chatPayload.allMembers.find(m => m.userId === Number(targetUserId));
                if (companionForMe && companionForMe.user) {
                    chatPayload.companion = companionForMe.user;
                }

                chatPayload.lastMessage = lastMessagePayload;
                chatPayload.unreadCount = 0;

                socket.emit('new_chat', chatPayload);

                const chatPayloadForTarget = { ...chatPayload };
                const companionForTarget = chatPayload.allMembers.find(m => m.userId === myId);
                if (companionForTarget && companionForTarget.user) {
                    chatPayloadForTarget.companion = companionForTarget.user;
                }

                chatPayloadForTarget.unreadCount = isNewChat ? 1 : 0;

                io.to(`user_${targetUserId}`).emit('new_chat', chatPayloadForTarget);

                socket.emit('chat_create_success', { chatId: chat.id });
            }
        } catch (e) {
            console.error('[Create Chat Error]: ' + e);
            socket.emit('error', { message: 'SERVER_ERROR' })
        }
    });

    socket.on('kick_or_leave_chat', async ({ chatId }) => {
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