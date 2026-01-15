import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { joinRoom, movePiece } from '../store/actions';
import './Game.css';
import GameBoard from './GameBoard.jsx';
import UserPanel from './UserPanel.jsx';
import TopBar from './TopBar.jsx';
import Movements from '../types/enums/movements.jsx';

const Game = () => {

    const dispatch = useDispatch();
    const { roomName, username } = useSelector((state) => state.game);

    useEffect(() => {
        // Récupérer le chemin depuis l'URL
        const path = window.location.pathname.substring(1);
        const segments = path.split('/');
        const currentRoom = segments[0] || 'general';
        const currentUsername = segments[1] || 'anonymous';

        console.log('current room : ' + currentRoom + ' current username : ' + currentUsername);

        dispatch(joinRoom(currentRoom, currentUsername));
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowUp') {
                console.log('Arrow Up key pressed globally!');
                dispatch(movePiece(Movements.ROTATE));
            } else if (event.key === 'ArrowLeft') {
                console.log('Arrow Left key pressed globally!');
                dispatch(movePiece(Movements.LEFT));
            } else if (event.key === 'ArrowRight') {
                console.log('Arrow Right key pressed globally!');
                dispatch(movePiece(Movements.RIGHT));
            } else if (event.key === 'ArrowDown') {
                console.log('Arrow Down key pressed globally!');
                dispatch(movePiece(Movements.DOWN));
            } else if (event.key === ' ') {
                console.log('Space key pressed globally!');
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