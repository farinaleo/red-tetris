import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Game.css';
import GameBoard from './GameBoard.jsx';

const Game = () => {

    return (
        <div className="wrapper">
            <GameBoard />
            <GameBoard />
            <GameBoard />
        </div>
    );
};

export default Game;