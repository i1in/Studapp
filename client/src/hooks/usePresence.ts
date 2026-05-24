import { useEffect } from "react";
import { socketEmitters } from "./shared/socketEmitters";

let lastSentStatus: string | null = null;
let timeout: ReturnType<typeof setTimeout> | null = null;

function emitPresenceStatus(status: 'online' | 'offline') {
    if (lastSentStatus === status) return;

    lastSentStatus = status;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
        socketEmitters.presenceState(status);
    }, 200);
}

export function getStatus() {
    return document.visibilityState === 'visible' ? 'online' : 'offline';
}

export function usePresence() {

    useEffect(() => {
        const handleVisibilityChange = () => {
            emitPresenceStatus(getStatus());
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        emitPresenceStatus(getStatus());

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
    }, []);
}