import ChatMember from "../../models/chatMember.js";
import Message from "../../models/message.js";
import User from "../../models/users.js";

export function emitSystemMessage(io, socket) {
    
}

export function registerChatHandlers(io, socket) {
    socket.on('join_chat', async ({ chatId }) => {
        try {
            const member = await ChatMember.findOne({
                where: { chatId, userId: socket.user.id, leftAt: null, },
            });
            if (!member) return socket.emit('error', { message: 'USER_NOT_MEMBER' });

            const rooms = [...socket.rooms].filter(r => r !== socket.id);
            rooms.forEach(room => socket.leave(room));

            socket.join(String(chatId));

            const messages = await Message.findAll({
                where: { chatId },
                limit: 50,
                order: [['createdAt', 'DESC']],
                include: [
                    { model: User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
                ]
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
    })
}

