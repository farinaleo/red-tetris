import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { joinRoom, movePiece } from '../store/actions';
import './Game.css';
import GameBoard from './GameBoard.jsx';
import UserPanel from './UserPanel.jsx';
import TopBar from './TopBar.jsx';
import Movements from '../types/enums/movements.jsx';

/**
 * @namspace Client
 */

const Game = () => {

    const dispatch = useDispatch();
    const { roomName, username } = useSelector((state) => state.game);

    useEffect(() => {
        // Get the current path and split it to for the roomName and username.
        const path = window.location.pathname.substring(1);
        const segments = path.split('/');
        const currentRoom = segments[0] || 'general';
        const currentUsername = segments[1] || 'anonymous';

        // Join the current roomName with socket.
        dispatch(joinRoom(currentRoom, currentUsername));

        // Manage keys events for tiles movements.
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowUp') {
                dispatch(movePiece(Movements.ROTATE));
            } else if (event.key === 'ArrowLeft') {
                dispatch(movePiece(Movements.LEFT));
            } else if (event.key === 'ArrowRight') {
                dispatch(movePiece(Movements.RIGHT));
            } else if (event.key === 'ArrowDown') {
                dispatch(movePiece(Movements.DOWN));
            } else if (event.key === ' ') {
                dispatch(movePiece(Movements.FAST_DOWN));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="window-wrapper">
            <TopBar username={username} roomName={roomName}/>
            <div className="game-wrapper">
                <GameBoard/>
                <UserPanel/>
            </div>
        </div>
    );
};

export default Game;