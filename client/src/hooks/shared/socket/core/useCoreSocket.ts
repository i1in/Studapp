import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';

import { connectSocket, disconnectSocket } from '../../socket';
import { registerCoreListeners } from './registerCoreSocket';
import { registerChatListListeners } from '../chat/chat-list/registerChatListSocket';
import {
    selectIsAuthenticated,
    selectToken,
} from '../../../../features/api/auth/authSlice';

export function useCoreSocket() {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const token = useAppSelector(selectToken);

    useEffect(() => {
        if (!isAuthenticated || !token) return;

        connectSocket(token);

        const cleanupCore = registerCoreListeners(dispatch);
        const cleanupChatList = registerChatListListeners(dispatch);

        return () => {
            cleanupCore();
            cleanupChatList();

            disconnectSocket();
        };
    }, [dispatch, isAuthenticated, token]);
}
