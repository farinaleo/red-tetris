// client/src/store/actions.js

/**
 * @namspace Client
 */

/**
 * Join a room.
 * @param roomName The game name.
 * @param username The username.
 * @returns {(function(*): void)|*}
 */
export const joinRoom = (roomName, username) => (dispatch) => {
    dispatch({ type: 'JOIN_ROOM', payload: { roomName, username } });
};

/**
 * Start the game (only for masters).
 * @param roomName The game name.
 * @returns {(function(*): void)|*}
 */
export const StartGame = (roomName) => (dispatch) => {
    dispatch({type: 'START_GAME', payload: {roomName}});
}

/**
 * Send the direction to move the current piece.
 * @param movement The movement to execute.
 * @returns {(function(*): void)|*}
 */
export const movePiece = (movement) => (dispatch) => {
    dispatch({type: 'MOVE_PIECE', payload: {movement}});
}