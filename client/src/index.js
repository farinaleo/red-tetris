// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
// import chatReducer from './store/reducers';
// import socketMiddleware from './store/socketMiddleware';
import App from './App';

// const store = configureStore({
//     reducer: {
//         chat: chatReducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware().concat(socketMiddleware),
// });


import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/home" element={
                // <Provider store={store}>
                //     <App />
                // </Provider>
                <App />
            } />
        </Routes>
    );
};

root.render(
    <Router>
        <App />
    </Router>
);
