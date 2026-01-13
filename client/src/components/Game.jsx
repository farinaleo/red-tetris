import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { joinRoom } from '../store/actions';
import './Game.css';
import GameBoard from './GameBoard.jsx';
import UserPanel from './UserPanel.jsx';
import TopBar from './TopBar.jsx';

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
        return () => {
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