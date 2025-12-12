// client/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './reducers';
import socketMiddleware from './socketMiddleware';

export const store = configureStore({
    reducer: {
        chat: chatReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(socketMiddleware),
});
