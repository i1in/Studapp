import { createSlice } from "@reduxjs/toolkit";
const initialState = {
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
        setChats(state, action) {
            state.chats = action.payload;
        },
        setActiveChat(state, action) {
            state.activeChatId = action.payload;
        },
        setUserTyping(state, action) {
            const { userId, chatId, isTyping } = action.payload;
            if (!state.typingUsers[chatId])
                state.typingUsers[chatId] = [];
            if (isTyping) {
                if (!state.typingUsers[chatId].includes(userId)) {
                    state.typingUsers[chatId].push(userId);
                }
            }
            else {
                state.typingUsers[chatId] = state.typingUsers[chatId].filter((id) => id !== userId);
            }
        },
        setMessageRead(state, action) {
            const { chatId, messageId } = action.payload;
            state.readStatus[chatId] = messageId;
        },
        setUsersPresence(state, action) {
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
        updateUserPresence(state, action) {
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
