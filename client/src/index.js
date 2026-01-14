// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './store/reducers';
import socketMiddleware from './store/socketMiddleware';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const store = configureStore({
    reducer: {
        game: gameReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(socketMiddleware),
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Router>
        <Provider store={store}>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/:roomName/:username" element={<App />} />
            </Routes>
        </Provider>
    </Router>
);
