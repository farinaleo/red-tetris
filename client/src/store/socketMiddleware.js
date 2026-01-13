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

        socket.on('update_players', (players) => {
            socketStore.dispatch({
                type: 'UPDATE_PLAYERS',
                payload: players || [],
            });
            console.log(players);
        });
    }

    return (next) => (action) => {
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
