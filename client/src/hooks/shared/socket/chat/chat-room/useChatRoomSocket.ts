import { useEffect } from 'react';
import { useAppDispatch } from '../../../../../store/hooks';
import { socket } from '../../../socket';
import { startLoadingHistory } from '../../../../../features/api/messenger/messagesSlice';
import { registerChatRoomListeners } from './registerChatRoomSocket';

export function useChatRoomSocket(chatId: number) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(startLoadingHistory(chatId));

        const cleanup = registerChatRoomListeners(dispatch);

        const payload = chatId < 0
            ? { chatId: null, targetUserId: Math.abs(chatId) }
            : { chatId: chatId, targetUserId: null };

        socket.emit('join_chat', payload);

        return () => {
            cleanup();
        }
    }, [dispatch, chatId]);
}