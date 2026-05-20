import { createEntityAdapter, EntityState, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
    id: number;
    chatId: number;
    senderId: number;
    type: 'text' | 'image' | 'file' | 'voice' | 'sticker' | 'system';
    text: string;
    editedAt: string | null;
    deletedAt: string | null;
    createdAt: string;
    sender: { 
        id: number;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
    };
    replyToId: number | null;
    attachments: any[];
    reactions: any[];
}

const messagesAdapter = createEntityAdapter<Message, number>({
    selectId: (message) => message.id,
});

interface MessagesState extends EntityState<Message, number> {
    byChat: Record<number, number[]>;
}

const initialState: MessagesState = messagesAdapter.getInitialState({
    byChat: {},
});

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setHistory(state, action: PayloadAction<Message[]>) {
            const messages = action.payload;
            if (!messages.length) return;

            const chatId = messages[0].chatId;

            messagesAdapter.setAll(state, messages);

            state.byChat[chatId] = messages.map(m => m.id);
        },

        addMessage(state, action: PayloadAction<Message>) {
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

            msg.deletedAt = new Date().toISOString();

            const list = state.byChat[msg.chatId];
            if (list) {
                const idx = list.indexOf(messageId);
                if (idx !== -1) list.splice(idx, 1);
            }
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

export const { setHistory, addMessage, editMessage, deleteMessage, updateReaction } = messagesSlice.actions;
export default messagesSlice.reducer;
