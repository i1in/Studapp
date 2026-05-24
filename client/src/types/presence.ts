type PresenceStatus = 'online' | 'offline' | 'away';

type PresencePayload = {
    userId: number;
    status: PresenceStatus;
    lastSeen: number | null;
    hidden: boolean;
}