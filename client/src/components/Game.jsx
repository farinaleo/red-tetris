import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Game.css';
import GameBoard from './GameBoard.jsx';
import UserPanel from './UserPanel.jsx';
import TopBar from './TopBar.jsx';

const Game = () => {

    return (
        <div className="window-wrapper">
            <TopBar/>
            <div className="game-wrapper">
                <GameBoard/>
                <UserPanel/>
            </div>
        </div>
    );
};

export default Game;