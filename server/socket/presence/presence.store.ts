export type PresenceStatus = 'online' | 'offline' | 'away' | 'hidden';

export interface PresenceState {
    sockets: Set<string>;
    lastPing: number;
    lastActivity: number;
    lastSeen: number | null;
    status: PresenceStatus;
    hideOnline: boolean;
}

export const onlineUsers = new Map<number, PresenceState>();