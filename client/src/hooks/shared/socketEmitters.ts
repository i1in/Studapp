import { socket } from "./socket";

export const socketEmitters = {
    joinChat(chatId: number) {
        socket.emit('join_chat', { chatId });
    },

    leaveChat(chatId: number) {
        socket.emit('kick_or_leave_chat', { chatId });
    },

    sendMessage(chatId: number, text: string, replyToId?: number) {
        socket.emit('message_send', { chatId, text, replyToId });
    },

    editMessage(messageId: number, text: string) {
        socket.emit('message_edit', { messageId, text });
    },

    deleteMessage(messageId: number) {
        socket.emit('message_delete', { messageId });
    },

    sendTyping(chatId: number, isTyping: boolean) {
        socket.emit('typing', { chatId, isTyping });
    },

    reactMessage(messageId: number, emoji: string) {
        socket.emit('message_react', { messageId, emoji });
    },

    readMessage(chatId: number, messageId: number) {
        socket.emit('message_read', { chatId, messageId });
    },

    toggleHidden(hidden: boolean) {
        socket.emit('presence:hidden', hidden)
    },

    presenceState(status: 'online' | 'offline') {
        socket.emit('presence:state', status)
    },
}