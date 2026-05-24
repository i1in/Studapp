import { useEffect } from 'react';
import { useAppDispatch } from '../../../../../store/hooks';
import { socket } from '../../../socket';
import { registerChatRoomListeners } from './registerChatRoomSocket';

export function useChatRoomSocket(chatId: number) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const cleanup = registerChatRoomListeners(dispatch);

        socket.emit('join_chat', { chatId });

        return () => {
            cleanup();
        }
    }, [dispatch, chatId]);
}