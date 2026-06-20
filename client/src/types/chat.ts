type MessageSenderPayload = {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl: string;
}

export type MessageAttachment = {
    id: number;
    messageId: number;
    url: string;
    originalName: string;
    mimeType: string;
    size: number;
    width: number | null;
    height: number | null;
    thumbnailUrl: string | null;
    sortOrder: number;
};

export type MessagePayload = {
    id: number;
    chatId: number;
    senderId: number;
    type: 'text' | 'image' | 'file' | 'voice' | 'sticker' | 'system';
    text: string;
    editedAt: string | null;
    deletedAt: string | null;
    createdAt: string;
    sender: MessageSenderPayload;
    replyToId: number | null;
    attachments: MessageAttachment[];
    reactions: MessageReactPayload[];
}

type MessageEditPayload = {
    messageId: number;
    text: string;
    editedAt: string;
};

type MessageReadPayload = {
    chatId: number;
    messageId: number;
    userId: number;
};

type MessageReactPayload = {
    userId: number;
    emoji: string;
}

type TypingPayload = {
    chatId: number;
    userId: number;
    isTyping: boolean;
}