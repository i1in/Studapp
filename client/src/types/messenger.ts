export interface Companion {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
}

export interface ChatMember {
    userId: number;
    role: 'member' | 'admin' | 'owner';
    user: Companion;
}

export interface Chat {
    id: number;
    name: string | null;
    type: 'direct' | 'group' | 'channel';
    avatarUrl: string | null;
    allMembers: ChatMember[];
    lastMessage: MessagePayload | null;
    companion: Companion | null;

    unreadCount?: number;
}

export type PresenceStatus = 'online' | 'offline' | 'away' | 'hidden';

export interface Presence {
    status: PresenceStatus;
    lastSeen: number | null;
    hidden: boolean;
}

export interface PresenceUser {
    id: number;
    firstName?: string;
    lastName?: string;
    presence: Presence;
}