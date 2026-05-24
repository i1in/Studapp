import { useEffect } from 'react';
import { useAppDispatch } from '../../../../store/hooks';

import { connectSocket, disconnectSocket } from '../../socket';
import { registerCoreListeners } from './registerCoreSocket';
import { registerChatListListeners } from '../chat/chat-list/registerChatListSocket';
import { selectIsAuthenticated } from '../../../../features/api/auth/authSlice';

export function useCoreSocket() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!selectIsAuthenticated) return;

        connectSocket();

        const cleanupCore = registerCoreListeners(dispatch);
        const cleanupChatList = registerChatListListeners(dispatch);

        return () => {
            cleanupCore();
            cleanupChatList();

            disconnectSocket();
        }
    }, [dispatch, selectIsAuthenticated]);
}