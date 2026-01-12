// client/src/store/reducers.js
const initialState = {
    roomName: 'general',
    username: 'anonymous',
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'JOIN_ROOM':
            return {
                ...state,
                roomName: action.payload.roomName,
                username: action.payload.username,
            };
        default:
            return state;
    }
};

export default chatReducer;