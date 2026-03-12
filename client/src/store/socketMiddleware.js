import io from 'socket.io-client';
import { toast } from 'react-toastify';
import StatusMessages from '../types/enums/StatusMessages.jsx';

/**
 * @namspace Client
 */

let socket;
let socketStore;

const socketMiddleware = (navigate) => {
    return (store) => (next) => (action) => {
        socketStore = store;

        if (!socket) {
            socket = io(process.env.REACT_APP_SOCKET_SERVER_URL);

            // Show notification for errors
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

            // Show notification when a user enter the game.
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

            // Show a notification for error and redirect the client to the main page (/)
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

            // Update the players info (boards, username, status)
            socket.on('update_players', (players) => {
                socketStore.dispatch({
                    type: 'UPDATE_PLAYERS',
                    payload: players || [],
                });
            });

            // Update the game status (playing, pending, ...)
            socket.on('game_status', (data) => {
                socketStore.dispatch({
                    type: 'GAME_STATUS',
                    payload: data,
                });
            });

            // Update the next piece to play.
            socket.on('next_piece', (data) => {
                socketStore.dispatch({
                    type: 'NEXT_PIECE',
                    payload: data,
                });
            });

            // Update the current board to render.
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
