// client/src/store/reducers.js
const initialState = {
    roomName: '',
    username: '',
    players: [],
    game_status: '',
    next_piece: 'Z',
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
        default:
            return state;
    }
};

export default gameReducer;