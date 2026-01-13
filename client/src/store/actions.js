// client/src/store/actions.js
export const joinRoom = (roomName, username) => (dispatch) => {
    dispatch({ type: 'JOIN_ROOM', payload: { roomName, username } });
};

export const StartGame = (roomName) => (dispatch) => {
    dispatch({type: 'START_GAME', payload: {roomName}});
}
