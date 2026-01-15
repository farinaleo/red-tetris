import io from 'socket.io-client';
import { toast } from 'react-toastify';

let socket;
let socketStore;

const socketMiddleware = (navigate) => {
    return (store) => (next) => (action) => {
        socketStore = store;

        if (!socket) {
            socket = io('http://localhost:3004');

            socket.on('notify_error', (data) => {
                toast.error(`${data.topic}: ${data.message}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });

            socket.on('redirect_error', (data) => {
                if (navigate) {
                    navigate('/');
                }
                toast.error(`${data.topic}: ${data.message}`, {
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

            socket.on('game_status', (data) => {
                console.log(data);
                socketStore.dispatch({
                    type: 'GAME_STATUS',
                    payload: data,
                });
            });

            socket.on('next_piece', (data) => {
                console.log(data);
                socketStore.dispatch({
                    type: 'NEXT_PIECE',
                    payload: data,
                });
            });

            socket.on('current_board', (data) => {
               console.log(data);
               socketStore.dispatch({
                   type: 'CURRENT_BOARD',
                   payload: data,
               });
            });
        }

        switch (action.type) {
            case 'JOIN_ROOM':
                socket.emit('join', action.payload);
                break;
            case 'START_GAME':
                socket.emit('start_game', action.payload);
                break;
            case 'MOVE_PIECE':
                socket.emit('move_piece', action.payload);
                break;
            default:
                break;
        }

        return next(action);
    };
};

export default socketMiddleware;
