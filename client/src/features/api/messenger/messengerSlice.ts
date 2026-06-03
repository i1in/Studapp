import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, Companion, Presence, PresenceStatus, PresenceUser } from '../../../types/messenger';
import { addMessage, deleteMessage, editMessage } from "./messagesSlice";

interface MessengerState {
    chats: Chat[];
    activeChatId: number | null;
    typingUsers: Record<number, number[]>; // chatId -> userIds
    readStatus: Record<number, Record<number, number>>;

    users: Record<number, PresenceUser>;
}

const initialState: MessengerState = {
    chats: [],
    activeChatId: null,
    typingUsers: {},
    readStatus: {},
    users: {},
};

const messengerSlice = createSlice({
    name: "messenger",
    initialState,
    reducers: {
        setChats(state, action: PayloadAction<Chat[]>) {
            state.chats = action.payload;
        },

        addNewChat(state, action: PayloadAction<{ chat: Chat; myId: number | null }>) {
            const { chat: newChat, myId } = action.payload;

            const exists = state.chats.some(c => c.id === newChat.id);
            if (exists) return;

            if (newChat.type === 'direct' && newChat.allMembers) {
                const companionMember = newChat.allMembers.find(
                    (m: any) => m.user && (m.user && m.userId !== myId)
                );

                if (companionMember && companionMember.user) {
                    newChat.companion = companionMember.user;
                }
            }

            const companionId = newChat.companion?.id;
            if (companionId) {
                state.chats = state.chats.filter(c => c.id !== -companionId);
            }

            state.chats.unshift(newChat);
        },

        setActiveChat(state, action: PayloadAction<number | null>) {
            state.activeChatId = action.payload;

            const chatIndex = state.chats.findIndex(c => c.id === action.payload);
            if (chatIndex !== -1) {
                state.chats[chatIndex].unreadCount = 0;
            }
        },

        setUserTyping(state, action: PayloadAction<{
            userId: number; chatId: number; isTyping: boolean;
        }>) {
            const { userId, chatId, isTyping } = action.payload;
            if (!state.typingUsers[chatId]) state.typingUsers[chatId] = [];

            if (isTyping) {
                if (!state.typingUsers[chatId].includes(userId)) {
                    state.typingUsers[chatId].push(userId);
                }
            } else {
                state.typingUsers[chatId] = state.typingUsers[chatId].filter((id) => id !== userId);
            }
        },

        setMessageRead(state, action: PayloadAction<{
            chatId: number; messageId: number; userId: number;
        }>) {
            const { chatId, messageId, userId } = action.payload;
            if (!state.readStatus[chatId]) state.readStatus[chatId] = {};

            state.readStatus[chatId][userId] = messageId
        },

        setUsersPresence(
            state,
            action: PayloadAction<{
                userId: number;
                status: Presence['status'];
                lastSeen: number | null,
                hidden: boolean;
            }[]>
        ) {
            const next: MessengerState['users'] = {};

            action.payload.forEach((u) => {
                next[u.userId] = {
                    id: u.userId,
                    presence: {
                        status: u.status,
                        lastSeen: u.lastSeen,
                        hidden: u.hidden,
                    }
                }
            });

            state.users = next;
        },

        updateUserPresence(state, action: PayloadAction<PresencePayload>) {
            const { userId, status, lastSeen, hidden } = action.payload;

            const existing = state.users[userId];

            state.users[userId] = {
                id: userId,
                presence: {
                    status: status ?? existing?.presence?.status ?? 'offline',
                    lastSeen: lastSeen !== null && lastSeen !== undefined ? lastSeen : (existing?.presence?.lastSeen ?? null),
                    hidden: hidden ?? existing?.presence?.hidden ?? false,
                },
            };

            console.log(`Updated presence for user ${userId}:`, state.users[userId].presence);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addMessage, (state, action) => {
            const newMessage = action.payload;

            const chatIndex = state.chats.findIndex(c => c.id === newMessage.chatId);

            if (chatIndex !== -1) {
                state.chats[chatIndex].lastMessage = newMessage;

                if (newMessage.chatId !== state.activeChatId) {
                    state.chats[chatIndex].unreadCount = (state.chats[chatIndex].unreadCount || 0) + 1;
                }
            }
        });

        builder.addCase(editMessage, (state, action) => {
            const { messageId, text, editedAt } = action.payload;

            const chat = state.chats.find(c => c.lastMessage?.id === messageId);

            if (chat && chat.lastMessage) {
                chat.lastMessage.text = text;
                chat.lastMessage.editedAt = editedAt;
            }
        });

        builder.addCase(deleteMessage, (state, action) => {
            const messageId = action.payload.messageId ?? (action.payload as any).id;
            const chatId = action.payload.chatId;
            const previousMessage = action.payload.previousMessage;

            const chatIndex = state.chats.findIndex(c => c.id === chatId);

            if (chatIndex !== -1 && messageId) {
                const currentChat = state.chats[chatIndex];

                state.chats[chatIndex] = {
                    ...currentChat,
                    lastMessage: previousMessage ?? null
                };

                if (currentChat.unreadCount && currentChat.unreadCount > 0) {
                    state.chats[chatIndex].unreadCount = currentChat.unreadCount - 1;
                }
            }
        });
    }
});

export const { setChats, addNewChat, setActiveChat, setUserTyping, setMessageRead, setUsersPresence, updateUserPresence } = messengerSlice.actions;
export default messengerSlice.reducer;