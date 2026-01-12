// client/src/store/reducers.js
const initialState = {
    roomName: 'general',
    username: 'anonymous',
    users: []
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'JOIN_ROOM':
            return {
                ...state,
                roomName: action.payload.roomName,
                username: action.payload.username,
            };
        case 'UPDATE_USERS':
            return {
                ...state,
                users: action.payload,
            }
        default:
            return state;
    }
};

export default gameReducer;