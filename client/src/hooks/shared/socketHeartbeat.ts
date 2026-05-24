import { socket } from "./socket";

let heartbeatInterval: number | null = null;

export function startHeartbeat() {
    if (heartbeatInterval) return;

    heartbeatInterval = window.setInterval(() => {
        if (socket.connected) {
            socket.emit('heartbeat', {
                ts: Date.now(),
            });

            console.log('[WS] Heartbeat sent');
        }
    }, 25000);
}

export function stopHeartbeat() {
    if (heartbeatInterval) { 
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
}