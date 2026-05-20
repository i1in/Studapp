import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { socket } from "./shared/socket";
import { addMessage, editMessage, deleteMessage, setHistory, updateReaction, } from "../features/api/messenger/messagesSlice";
import { setMessageRead, setUserTyping, setUsersPresence, updateUserPresence, } from "../features/api/messenger/messengerSlice";
export function useSocket() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!socket)
            return;
        const heartbeat = setInterval(() => {
            if (socket.connected) {
                let ts = Date.now();
                socket.emit('heartbeat', {
                    ts
                });
                console.log('[WS] Heartbeat sent');
            }
        }, 25000);
        socket.on('history', (messages) => {
            console.log(messages);
            dispatch(setHistory(messages));
        });
        socket.on('new_message', (message) => {
            console.log('NEW_MESSAGE EVENT: ' + message.text);
            dispatch(addMessage(message));
        });
        socket.on('message_edit', ({ messageId, text, editedAt }) => {
            console.log('MESSAGE_EDIT EVENT');
            dispatch(editMessage({ messageId, text, editedAt }));
        });
        socket.on('message_delete', ({ messageId }) => {
            console.log('MESSAGE_DELETE EVENT');
            dispatch(deleteMessage({ messageId }));
        });
        socket.on('message_read', ({ chatId, messageId, userId }) => {
            console.log('MESSAGE_READ EVENT');
            dispatch(setMessageRead({ chatId, messageId, userId }));
        });
        socket.on('typing', ({ chatId, userId, isTyping }) => {
            console.log(`${userId} is typing...`);
            dispatch(setUserTyping({ chatId, userId, isTyping }));
        });
        socket.on('message_react', ({ messageId, userId, emoji, action }) => {
            console.log('MESSAGE_REACT EVENT');
            dispatch(updateReaction({ messageId, userId, emoji, action }));
        });
        socket.on('presence:init', (users) => {
            console.log('[presence:init]: ', users);
            dispatch(setUsersPresence(users));
        });
        // socket.onAny((event, data) => {
        //     console.log('[SOCKET EVENT]', event, data);
        //     console.log('SOCKET ID:', socket.id);
        // });
        socket.on('presence:update', (payload) => {
            dispatch(updateUserPresence(payload));
        });
        socket.on('connect', () => {
            console.log('[WS] Connected: ' + socket.id);
        });
        socket.on('disconnect', (reason) => {
            console.log('[WS] Disconnected: ' + reason);
        });
        socket.on('error', ({ message }) => {
            console.error('[WS] Error: ' + message);
        });
        socket.on('connect_error', (err) => {
            console.log('[WS] connect_error:', err.message);
        });
        return () => {
            socket.off('history');
            socket.off('new_message');
            socket.off('message_edit');
            socket.off('message_delete');
            socket.off('message_read');
            socket.off('typing');
            socket.off('message_react');
            socket.off('connect');
            socket.off('disconnect');
            socket.off('error');
            clearInterval(heartbeat);
        };
    }, [dispatch]);
    const emitJoinChat = (chatId) => {
        socket.emit('join_chat', { chatId });
    };
    const emitLeaveChat = (chatId) => {
        socket.emit('leave_chat', { chatId });
    };
    const emitSendMessage = (chatId, text, replyToId) => {
        socket.emit('message_send', { chatId, text, replyToId });
    };
    const emitEditMessage = (messageId, text) => {
        socket.emit('message_edit', { messageId, text });
    };
    const emitDeleteMessage = (messageId) => {
        socket.emit('message_delete', { messageId });
    };
    const emitSendTyping = (chatId, isTyping) => {
        socket.emit('typing', { chatId, isTyping });
    };
    const emitReactMessage = (messageId, emoji) => {
        socket.emit('message_react', { messageId, emoji });
    };
    const emitReadMessage = (chatId, messageId) => {
        socket.emit('message_read', { chatId, messageId });
    };
    const emitToggleHidden = (hidden) => {
        socket.emit('presence:hidden', hidden);
    };
    const emitPresenceState = (status) => {
        socket.emit('presence:state', status);
    };
    return {
        emitJoinChat,
        emitLeaveChat,
        emitSendMessage,
        emitEditMessage,
        emitDeleteMessage,
        emitSendTyping,
        emitReactMessage,
        emitReadMessage,
        emitToggleHidden,
        emitPresenceState
    };
}
