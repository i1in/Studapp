import { onlineUsers, PresenceStatus } from "../presence/presence.store.js";

import User from '../../models/users.js';
import { broadcastPresence } from "../presence/presence.service.js";

export async function registerUserHandlers(io, socket) {
    socket.on('heartbeat', () => {
        try {
            const userId = socket.user.id;
            if (!userId) return;

            console.log(`[WS] Heartbeat received: userId=${userId} ts=${Date.now()}`);

            const state = onlineUsers.get(userId);
            if (!state) return;

            const prevStatus = state.status;

            state.lastPing = Date.now();
            state.lastActivity = Date.now();

            if (state.status === 'hidden') {
                state.status = 'online';
            }

            if (prevStatus !== state.status) {
                broadcastPresence(io, userId, state)
            }

        } catch (e) {
            console.error('[Heartbeat error]: ' + e);
            socket.emit('error', { message: 'SERVER_ERROR' });
        }
    });

    socket.on('presence:hidden', async (hidden: boolean) => {
        try {
            const userId = socket.user.id;

            const state = onlineUsers.get(userId);
            if (!state) return

            state.hideOnline = hidden;
            state.status = hidden ? 'hidden' : 'online';

            await User.update(
                { isOnlineHidden: hidden },
                { where: { id: userId } }
            )

            broadcastPresence(io, userId, state);

            console.log(`userId=${socket.user.id} is currently ${state.status} (${state.hideOnline}).`)
        } catch (e) {
            console.error('[Presense hidden Error]: ' + e);
            socket.emit('error', { message: 'SERVER_ERROR' });
        }
    });

    socket.on('presence:state', async (status: PresenceStatus) => {
        const userId = socket.user.id;
        const date = Date;

        const state = onlineUsers.get(userId);
        if (!state) return;

        if (state.hideOnline) return;

        state.status = status;
        state.lastActivity = date.now();

        if (status === 'offline') {
            state.lastSeen = date.now();

            await User.update(
                { lastSeenAt: new Date() },
                { where: { id: userId } }
            );
        }

        broadcastPresence(io, userId, state);
        console.log(`[Presence State]: ${userId} is currently ${status} at ${state.lastActivity}`);
    });
}