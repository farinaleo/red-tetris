import io from 'socket.io-client';
import { toast } from 'react-toastify';
import StatusMessages from '../types/enums/StatusMessages.jsx';

let socket;
let socketStore;

const socketMiddleware = (navigate) => {
    return (store) => (next) => (action) => {
        socketStore = store;

        if (!socket) {
            socket = io('http://10.11.1.1:3004');

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

            socket.on('player_status', (data) => {
                toast.info(`Game status: ${StatusMessages[data.status]}`, {
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
            });

            socket.on('game_status', (data) => {
                socketStore.dispatch({
                    type: 'GAME_STATUS',
                    payload: data,
                });
            });

            socket.on('next_piece', (data) => {
                socketStore.dispatch({
                    type: 'NEXT_PIECE',
                    payload: data,
                });
            });

            socket.on('current_board', (data) => {
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
