import io from 'socket.io-client';
import { toast } from 'react-toastify';
let socket;
let socketStore;

const socketMiddleware = (store) => {
    socketStore = store;
    if (!socket) {
        socket = io('http://localhost:3004',
        );

        // handle error with a notification
        socket.on('report_error', (data) => {
            toast.info(`Error: ${data.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });

        socket.on('update_users', (users) => {
            socketStore.dispatch({
                type: 'UPDATE_USERS',
                payload: users || [],
            });
            console.log(users);
        });
    }

    return (next) => (action) => {
        socket.off("report-error");
        switch (action.type) {
            case 'JOIN_ROOM':
                socket.emit('join', action.payload);
                break;
            default:
                break;
        }
        return next(action);
    };
};

export default socketMiddleware;
