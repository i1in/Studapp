import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Chat {
    id: number;
    name: string;
    type: 'direct' | 'group' | 'channel';
    avatarUrl: string | null;
    lastMessage: any | null;
}

interface MessengerState {
    chats: Chat[];
    activeChatId: number | null;
    typingUsers: Record<number, number[]>; // chatId -> userIds
    readStatus: Record<number, number>;

    users: Record<number, {
        id: number;
        presence?: {
            status: string,
            lastSeen: number | null;
        }
    }>;
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

        setActiveChat(state, action: PayloadAction<number>) {
            state.activeChatId = action.payload;
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
            const { chatId, messageId } = action.payload;
            state.readStatus[chatId] = messageId;
        },

        setUsersPresence(
            state,
            action: PayloadAction<{
                userId: number;
                status: string;
                lastSeen: number | null,
            }[]> 
        ) {
            const users = action.payload;

            for (const user of users) {
                state.users[user.userId] = {
                    id: user.userId,
                    presence: {
                        status: user.status,
                        lastSeen: user.lastSeen,
                    },
                };
            }
        },

        updateUserPresence(state, action: PayloadAction<{
            userId: number; status: string; lastSeen: number;
        }>) {
            const { userId, status, lastSeen } = action.payload;

            if (!state.users[userId]) {
                state.users[userId] = {
                    id: userId,
                };
            }

            state.users[userId].presence = { status, lastSeen };
        }
    },
});

export const { setChats, setActiveChat, setUserTyping, setMessageRead, setUsersPresence, updateUserPresence } = messengerSlice.actions;
export default messengerSlice.reducer;