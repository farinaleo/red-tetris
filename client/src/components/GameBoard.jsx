import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './GameBoard.css';
import Board from './Board.jsx'

const GameBoard = () => {
    // const dispatch = useDispatch();
    // const { roomName, messages, username } = useSelector((state) => state.chat);

    // useEffect(() => {
    //     console.log('loaded gameboard');
    //
    //     return () => {
    //     };
    // }, []);
    //
    // const handleSendMessage = (message) => {
    //     dispatch(sendMessage(roomName, message, username));
    // };

    return (
        <div className="game-board-container">
            <div className="game-board-header">
                <p>coucou header</p>
            </div>
            <div className="game-board-main">
                <Board />
            </div>
        </div>
    );
};

export default GameBoard;