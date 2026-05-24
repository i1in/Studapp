import { addMessage } from "../../../../../features/api/messenger/messagesSlice";
import { setChats, setMessageRead } from "../../../../../features/api/messenger/messengerSlice";
import { AppDispatch } from "../../../../../store/store";
import { Chat } from "../../../../../types/messenger";

import { socket } from "../../../socket";

export function registerChatListListeners(dispatch: AppDispatch) {

    const onNewMessage = (message: MessagePayload) => {
        console.log(`[${message.sender.id}] ${message.sender.firstName} ${message.sender.lastName}: ${message.text}`);
        dispatch(addMessage(message));
    };

    const onMessageRead = ({
        chatId,
        messageId,
        userId,
    }: MessageReadPayload) => {
        console.log('MESSAGE_READ EVENT');
        dispatch(setMessageRead({ chatId, messageId, userId }));
    };

    const onChatsList = (chats: Chat[]) => {
        dispatch(setChats(chats));
    }

    socket.on('new_message', onNewMessage);

    socket.on('message_read', onMessageRead);

    socket.on('list_chats', onChatsList);

    return () => {
        socket.off('new_message', onNewMessage);
        socket.off('message_read', onMessageRead);
        socket.off('list_chats', onChatsList);
    }

}