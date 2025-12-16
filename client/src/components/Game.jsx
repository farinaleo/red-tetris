import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Game.css';
import GameBoard from './GameBoard.jsx';
import UserPanel from './UserPanel.jsx';

const Game = () => {

    return (
        <div className="wrapper">
            <GameBoard />
            <UserPanel />
        </div>
    );
};

export default Game;