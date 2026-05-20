import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { registerChatHandlers } from './handlers/chatHandlers.js';
import { registerMessageHandlers } from './handlers/messageHandlers.js';
import { initPresence, handleDisconnect } from './presence/presence.service.js';
import { statePresenceWatcher } from './presence/presence.watcher.js';
import { registerUserHandlers } from './handlers/userHandlers.js';

const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.PRODUCTION_URL
].filter(Boolean);

export function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    console.log('CLIENT_URL:', process.env.CLIENT_URL);
    console.log('PRODUCTION_URL:', process.env.PRODUCTION_URL);

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('AUTH_TOKEN_MISSING'));

        try {
            const encoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = encoded;
            next();
        } catch (e) {
            next(new Error('AUTH_TOKEN_INVALID'));
        }
    });

    io.on('connection', async (socket) => {
        console.log(`[WS] User connected: userId=${socket.user.id} socketId=${socket.id}`);
        await initPresence(io, socket);

        registerChatHandlers(io, socket);
        registerMessageHandlers(io, socket);
        registerUserHandlers(io, socket);

        socket.on('disconnect', async (reason) => {
            await handleDisconnect(io, socket, reason);
        });
    });

    statePresenceWatcher();
    return io;
}