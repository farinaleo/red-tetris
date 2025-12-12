import io from 'socket.io-client';
import { toast } from 'react-toastify';
let socket;
let socketStore;

const socketMiddleware = (store) => {
    socketStore = store;
    if (!socket) {
        socket = io('http://localhost:3004');

    }
    return (next) => (action) => {
        switch (action.type) {
            ...
        }
        return next(action);
    };
};

export default socketMiddleware;
