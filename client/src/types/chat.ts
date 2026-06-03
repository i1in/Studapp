type MessageSenderPayload = {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl: string;
}

type MessagePayload = {
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
    attachments: any[];
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