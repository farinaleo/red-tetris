// client/src/store/reducers.js
const initialState = {
    roomName: 'general',
    username: 'anonymous',
    players: []
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
            }
        default:
            return state;
    }
};

export default gameReducer;