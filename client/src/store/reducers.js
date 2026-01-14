// client/src/store/reducers.js
const initialState = {
    roomName: '',
    username: '',
    players: [],
    game_status: '',
    next_piece: 'Z',
    current_board: Array.from({ length: 10 * 20 }, (_, index) => 0),
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'JOIN_ROOM':
            return {
                ...state,
                roomName: action.payload.roomName,
                username: action.payload.username,
            };
        case 'UPDATE_PLAYERS':
            return {
                ...state,
                players: action.payload,
            };
        case 'GAME_STATUS':
            return {
                ...state,
                game_status:action.payload.status,
            };
        case 'NEXT_PIECE':
            return {
                ...state,
                next_piece:action.payload.piece.type,
            }
        case 'CURRENT_BOARD':
            return {
                ...state,
                current_board: action.payload.board,
            }
        default:
            return state;
    }
};

export default gameReducer;