import { createEntityAdapter, createSelector, EntityState, createSlice, PayloadAction, isAction } from "@reduxjs/toolkit";

const messagesAdapter = createEntityAdapter<MessagePayload, number>({
    selectId: (message) => message.id,
});

interface MessagesState extends EntityState<MessagePayload, number> {
    byChat: Record<number, number[]>;
    isCurrentChatLoading: boolean;
}

const initialState: MessagesState = messagesAdapter.getInitialState({
    byChat: {},
    isCurrentChatLoading: true,
});

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setHistory(state, action: PayloadAction<MessagePayload[]>) {
            const messages = action.payload;
            state.isCurrentChatLoading = false;
            
            if (messages.length === 0) {
                return;
            }

            const chatId = messages[0].chatId;

            messagesAdapter.upsertMany(state, messages);

            state.byChat[chatId] = messages.map(m => m.id);
        },

        startLoadingHistory(state, action: PayloadAction<number>) {
            state.isCurrentChatLoading = true;

            if (action.payload) state.byChat[action.payload] = [];
        },

        addMessage(state, action: PayloadAction<MessagePayload>) {
            const message = action.payload;

            if (message.deletedAt) return;
            
            state.isCurrentChatLoading = false;

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

        deleteMessage(state, action: PayloadAction<{
            messageId: number;
            chatId: number;
            previousMessage?: MessagePayload | null;
        }>) {
            const messageId = action.payload.messageId ?? (action.payload as any).id;
            const chatId = action.payload.chatId;

            if (!messageId) return;

            messagesAdapter.removeOne(state, messageId);

            if (state.byChat[chatId]) {
                state.byChat[chatId] = state.byChat[chatId].filter(id => id !== messageId);
            }
        },

        updateReaction(state, action: PayloadAction<{
            messageId: number; userId: number; emoji: string; action: 'added' | 'removed'
        }>) {
            const { messageId, userId, emoji, action: act } = action.payload;

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
const selectChatId = (_state: { messages: MessagesState }, chatId: number) => chatId;

export const selectMessagesByChat = createSelector(
    [selectByChat, selectEntities, selectChatId],
    (byChat, entities, chatId: number) => {
        const ids = byChat[chatId] ?? [];
        return ids
            .map(id => entities[id])
            .filter((msg): msg is MessagePayload => msg !== undefined && msg !== null)
    }
)

export const { setHistory, startLoadingHistory, addMessage, editMessage, deleteMessage, updateReaction } = messagesSlice.actions;
export default messagesSlice.reducer;
