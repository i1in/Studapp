import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false,
});

export function connectSocket(token: string) {
    if (!token) return;

    if (!socket.connected) {
        console.log('[WS] Initializing socket connection...');

        socket.auth = { token };
        socket.connect();
    }
}

export function disconnectSocket() {
    if (!socket.connected) return;

    console.log('[WS] Disconnecting socket...');

    socket.disconnect();
}

export function updateSocketToken(token: string) {
    socket.auth = { token };
    if (socket.connected) {
        socket.disconnect();
        socket.connect();
    }
}
