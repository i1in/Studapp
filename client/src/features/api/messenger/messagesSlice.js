import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
const messagesAdapter = createEntityAdapter({
    selectId: (message) => message.id,
});
const initialState = messagesAdapter.getInitialState({
    byChat: {},
});
const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setHistory(state, action) {
            const messages = action.payload;
            if (!messages.length)
                return;
            const chatId = messages[0].chatId;
            messagesAdapter.setAll(state, messages);
            state.byChat[chatId] = messages.map(m => m.id);
        },
        addMessage(state, action) {
            const message = action.payload;
            if (message.deletedAt)
                return;
            messagesAdapter.upsertOne(state, message);
            if (!state.byChat[message.chatId]) {
                state.byChat[message.chatId] = [];
            }
            if (!state.byChat[message.chatId].includes(message.id)) {
                state.byChat[message.chatId].push(message.id);
            }
        },
        editMessage(state, action) {
            const { messageId, text, editedAt } = action.payload;
            const msg = state.entities[messageId];
            if (msg) {
                msg.text = text;
                msg.editedAt = editedAt;
            }
        },
        deleteMessage(state, action) {
            const { messageId } = action.payload;
            const msg = state.entities[messageId];
            if (!msg)
                return;
            msg.deletedAt = new Date().toISOString();
            const list = state.byChat[msg.chatId];
            if (list) {
                const idx = list.indexOf(messageId);
                if (idx !== -1)
                    list.splice(idx, 1);
            }
        },
        updateReaction(state, action) {
            const { messageId, userId, emoji, action: act } = action.payload;
            const msg = state.entities[messageId];
            if (!msg)
                return;
            if (!msg.reactions)
                msg.reactions = [];
            const idx = msg.reactions.findIndex((r) => r.userId === userId && r.emoji === emoji);
            if (act === 'removed') {
                if (idx !== -1)
                    msg.reactions.splice(idx, 1);
                return;
            }
            if (act === 'added') {
                if (idx === -1)
                    msg.reactions.push({ userId, emoji });
                return;
            }
        },
    },
});
export const { setHistory, addMessage, editMessage, deleteMessage, updateReaction } = messagesSlice.actions;
export default messagesSlice.reducer;
