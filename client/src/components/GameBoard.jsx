import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './GameBoard.css';
import Board from './Board.jsx'
import NextPiece from './NextPiece.jsx'
import GameStatus from '../types/enums/gameStatus.jsx'

const GameBoard = () => {
    const dispatch = useDispatch();
    const { game_status, next_piece } = useSelector((state) => state.game);

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

    const getGameStatusCss = (gameStatus) => {
        if (gameStatus === 'WAITING') {
            return 'game-board-status waiting';
        }
        if (gameStatus === 'STARTED') {
            return 'game-board-status started';
        }
        if (gameStatus === 'FINISHED') {
            return 'game-board-status finished';
        }
        return 'game-board-status';
    }


    return (
        <div className="game-board-container">
            <div className="game-board-header">
                <div className={getGameStatusCss(game_status)}>
                    <h2>{game_status}</h2>
                </div>
                <NextPiece pieceName={next_piece} />
            </div>
            <div className="game-board-main">
                <Board boardElements={elems}/>
            </div>
        </div>
    );
};

export default GameBoard;