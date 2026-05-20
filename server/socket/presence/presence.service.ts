import { onlineUsers } from './presence.store.js';

import User from '../../models/users.js';

export async function initPresence(io, socket) {
    const userId = socket.user.id;

    const user = await User.findByPk(userId);

    let state = onlineUsers.get(userId);

    if (!state) {

        state = {
            sockets: new Set(),
            lastPing: Date.now(),
            lastActivity: Date.now(),
            lastSeen: null,
            status: 'online',
            hideOnline: user?.hideOnline ?? false,
        };
        
        onlineUsers.set(userId, state);
    }

    state.sockets.add(socket.id);
    state.lastActivity = Date.now();
    state.status = 'online';

    socket.emit('presense:init', buildPresenceSnapshot(userId));

    broadcastPresence(io, userId, state);
}

export function buildPresenceSnapshot(viewerId?: number) {
    return Array.from(onlineUsers.entries()).map(([userId, state]) => ({
        userId,
        status: state.hideOnline && viewerId !== userId
            ? 'offline'
            : state.status,
        lastSeen: state.lastSeen ?? null,
    }));
}

export function buildPresencePayload(userId: number, state) {
    const isHidden = state.hideOnline;

    return { 
        userId,
        status: isHidden ? 'offline' : state.status,
        lastSeen: state.lastSeen ?? null,
        hidden: isHidden,
    }
}

export function broadcastPresence(io, userId: number, state) {
    io.emit('presence:update', buildPresencePayload(
        userId, 
        state
    ));
}

export async function handleDisconnect(io, socket, reason = null) {
    const userId = socket.user.id;

    const state = onlineUsers.get(userId);
    if (!state) return;

    state.sockets.delete(socket.id);

    if (state.sockets.size === 0) {
        state.status = 'offline';
        state.lastSeen = Date.now();

        await User.update(
            { lastSeenAt: new Date() },
            { where: {id: userId } }
        );

        broadcastPresence(io, userId, state);

        onlineUsers.delete(userId);
    }

    console.log(`[WS] User disconnected: userId=${socket.user.id} reason=${reason}`);
}