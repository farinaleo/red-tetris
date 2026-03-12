// client/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './reducers';
import socketMiddleware from './socketMiddleware';

/**
 * @namspace Client
 */

export const store = configureStore({
    reducer: {
        game: gameReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(socketMiddleware),
});