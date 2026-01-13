import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './GameBoard.css';
import Board from './Board.jsx'
import NextPiece from './NextPiece.jsx'
import GameStatus from '../types/enums/gameStatus.jsx'

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

    // const elems = Array.from({ length: 200 }, (_, index) => 1);

    const elems = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 3, 3, 0, 0, 0, 0, 0,
        0, 0, 0, 3, 2, 2, 0, 0, 0, 0,
        1, 1, 1, 1, 2, 2, 0, 0, 0, 0,
    ]


    return (
        <div className="game-board-container">
            <div className="game-board-header">
                <div className="game-board-status">
                    {GameStatus["WAITING"]}
                    coucou
                </div>
                <NextPiece pieceName={"Z"} />
            </div>
            <div className="game-board-main">
                <Board boardElements={elems}/>
            </div>
        </div>
    );
};

export default GameBoard;