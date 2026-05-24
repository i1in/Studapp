import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, Companion, Presence, PresenceStatus, PresenceUser } from '../../../types/messenger';
import { addMessage } from "./messagesSlice";

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

            state.users[userId] = {
                id: userId,
                presence: {
                    status,
                    lastSeen,
                    hidden: hidden ?? state.users[userId]?.presence?.hidden ?? false,
                }
            }
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
        })
    }
});

export const { setChats, setActiveChat, setUserTyping, setMessageRead, setUsersPresence, updateUserPresence } = messengerSlice.actions;
export default messengerSlice.reducer;