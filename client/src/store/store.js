// client/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './reducers';
import socketMiddleware from './socketMiddleware';

export const store = configureStore({
    reducer: {
        game: gameReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(socketMiddleware),
});