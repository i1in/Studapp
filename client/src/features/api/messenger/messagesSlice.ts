import { createEntityAdapter, createSelector, EntityState, createSlice, PayloadAction } from "@reduxjs/toolkit";

const messagesAdapter = createEntityAdapter<MessagePayload, number>({
    selectId: (message) => message.id,
});

interface MessagesState extends EntityState<MessagePayload, number> {
    byChat: Record<number, number[]>;
}

const initialState: MessagesState = messagesAdapter.getInitialState({
    byChat: {},
});

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setHistory(state, action: PayloadAction<MessagePayload[]>) {
            const messages = action.payload;
            if (messages.length === 0) {
                return;
            }

            const chatId = messages[0].chatId;

            messagesAdapter.upsertMany(state, messages);

            state.byChat[chatId] = messages.map(m => m.id);
        },

        addMessage(state, action: PayloadAction<MessagePayload>) {
            const message = action.payload;

            if (message.deletedAt) return;

            messagesAdapter.upsertOne(state, message);

            if (!state.byChat[message.chatId]) {
                state.byChat[message.chatId] = [];
            }

            if (!state.byChat[message.chatId].includes(message.id)) {
                state.byChat[message.chatId].push(message.id);
            }
        },

        editMessage(state, action: PayloadAction<{ messageId: number; text: string; editedAt: string }>) {
            const { messageId, text, editedAt } = action.payload;
            
            const msg = state.entities[messageId];
            if (msg) {
                msg.text = text;
                msg.editedAt = editedAt;
            }
        },

        deleteMessage(state, action: PayloadAction<{ messageId: number; }>) {
            const { messageId } = action.payload;
            
            const msg = state.entities[messageId];
            if (!msg) return;

            const list = state.byChat[msg.chatId];
            if (list) {
                const idx = list.indexOf(messageId);
                if (idx !== -1) list.splice(idx, 1);
            }

            messagesAdapter.removeOne(state, messageId);
        },

        updateReaction(state, action: PayloadAction<{ 
            messageId: number; userId: number; emoji: string; action: 'added' | 'removed'
        }>) {
            const { messageId, userId, emoji, action: act} = action.payload;
            
            const msg = state.entities[messageId];
            if (!msg) return;
            
            if (!msg.reactions) msg.reactions = [];

            const idx = msg.reactions.findIndex(
                (r) => r.userId === userId && r.emoji === emoji
            );

            if (act === 'removed') {
                if (idx !== -1) msg.reactions.splice(idx, 1);
                return;
            }

            if (act === 'added') {
                if (idx === -1) msg.reactions.push({ userId, emoji });
                return;
            }
        },
    },
});

export const messagesSelectors = messagesAdapter.getSelectors(
    (state: { messages: MessagesState }) => state.messages
);

const selectByChat = (state: { messages: MessagesState }) => state.messages.byChat;
const selectEntities = (state: { messages: MessagesState }) => state.messages.entities;
const selectChatId = (_state: {messages: MessagesState}, chatId: number) => chatId;

export const selectMessagesByChat = createSelector(
    [selectByChat, selectEntities, selectChatId],
    (byChat, entities, chatId: number) => {
        const ids = byChat[chatId] ?? [];
        return ids
            .map(id => entities[id])
            .filter(Boolean) as MessagePayload[]
    }
)

export const { setHistory, addMessage, editMessage, deleteMessage, updateReaction } = messagesSlice.actions;
export default messagesSlice.reducer;
