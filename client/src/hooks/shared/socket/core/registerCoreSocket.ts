import { editMessage, deleteMessage, updateReaction } from "../../../../features/api/messenger/messagesSlice";
import { setActiveChat, addNewChat, setUserTyping, setUsersPresence, updateUserPresence } from "../../../../features/api/messenger/messengerSlice";
import { AppDispatch, store, RootState } from "../../../../store/store";
import { getStatus } from "../../../usePresence";
import { socket } from "../../socket";
import { socketEmitters } from "../../socketEmitters";
import { startHeartbeat } from "../../socketHeartbeat";

export function registerCoreListeners(dispatch: AppDispatch) {

    const onConnect = () => {
        startHeartbeat();
        console.log('[WS] Connected: ' + socket.id);

        socketEmitters.presenceState(getStatus());
    };

    const onDisconnect = (reason: string) => {
        console.log('[WS] Disconnected: ' + reason);
    }

    const onConnectError = (err: SocketErrorPayload) => {
        console.log('[WS] connect_error:', err.message);
    }

    const onError = (message: SocketServerErrorPayload) => {
        console.error('[WS] Error: ' + message.message);
    }

    const onNewChat = (chatPayload: any) => {
        console.log('[WS] Received new chat payload: ', chatPayload);

        const state = store.getState();
        const myId = state.auth.userId;

        dispatch(addNewChat({chat: chatPayload, myId}));

        if (chatPayload.createdBy === myId && state.messenger.activeChatId === -chatPayload.companion?.id) {
            dispatch(setActiveChat(chatPayload.id));
        }
    };

    const onChatCreateSuccess = ({ chatId }: { chatId: number }) => {
        console.log('[WS] Chat created successfully, opening room: ', chatId);

       // dispatch(setActiveChat(chatId));

        socketEmitters.joinChat(chatId);
    };

    const onMessageEdit = ({
        messageId,
        text,
        editedAt,
    }: MessageEditPayload) => {
        console.log('MESSAGE_EDIT EVENT');
        dispatch(editMessage({ messageId, text, editedAt }));
    };

    const onMessageDelete = (data: any) => {
        console.log('MESSAGE_DELETE EVENT received: ', data);
        console.log('[SOCKET DEBUG] Прилетели данные удаления с бэка:', data);
        console.log('Предыдущее сообщение в объекте:', data.previousMessage);


        const cleanActionPayload = {
            messageId: Number(data.messageId ?? data.id),
            chatId: Number(data.chatId),
            previousMessage: data.previousMessage || null
        };

        dispatch(deleteMessage(cleanActionPayload));
    };

    const onTyping = ({
        chatId,
        userId,
        isTyping,
    }: TypingPayload) => {
        console.log(`${userId} is typing...`);
        dispatch(setUserTyping({ chatId, userId, isTyping }));
    };

    const onMessageReact = ({
        messageId,
        userId,
        emoji,
        action,
    }: MessageReactPayload) => {
        console.log('MESSAGE_REACT EVENT');
        dispatch(updateReaction({ messageId, userId, emoji, action }));
    };

    const onPresenceInit = (users: PresencePayload[]) => {
        console.log('[presence:init]: ', users);
        dispatch(setUsersPresence(users));
    };

    const onPresenceUpdate = (payload: PresencePayload) => {
        console.log(`[PAYLOAD] ${payload.userId} is currently ${payload.status} (Last Seen: ${payload.lastSeen})`)
        console.log('[onPresenceUpdate] dispatching:', payload);

        setTimeout(() => {
            console.log('[STATE AFTER DISPATCH]', store.getState().messenger.users[payload.userId]);
        }, 0);

        dispatch(updateUserPresence(payload))
    };

    socket.on('connect', onConnect);

    socket.on('disconnect', onDisconnect);

    socket.on('connect_error', onConnectError);

    socket.on('error', onError);

    socket.on('message_edit', onMessageEdit);

    socket.on('message_delete', onMessageDelete);

    socket.on('typing', onTyping);

    socket.on('message_react', onMessageReact);

    socket.on('presence:init', onPresenceInit);

    socket.on('presence:update', onPresenceUpdate);

    socket.on('new_chat', onNewChat);

    socket.on('chat_create_success', onChatCreateSuccess);

    return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('connect_error', onConnectError);
        socket.off('error', onError);
        socket.off('message_edit', onMessageEdit);
        socket.off('message_delete', onMessageDelete);
        socket.off('typing', onTyping);
        socket.off('message_react', onMessageReact);

        socket.off('presence:init', onPresenceInit);
        socket.off('presence:update', onPresenceUpdate);

        socket.off('new_chat', onNewChat);
        socket.off('chat_create_success', onChatCreateSuccess);
    }
}