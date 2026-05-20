import { configureStore } from '@reduxjs/toolkit';
import { api } from '../features/api/apiSlice';
import authReducer from '../features/api/auth/authSlice';
import messagesReducer from '../features/api/messenger/messagesSlice';
import messengerReducer from '../features/api/messenger/messengerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
    messages: messagesReducer,
    messenger: messengerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
