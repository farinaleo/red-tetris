// client/src/store/reducers.js
const initialState = {
    roomName: 'general',
    username: 'anonymous',
    players: [],
    game_status: '',
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
        default:
            return state;
    }
};

export default gameReducer;